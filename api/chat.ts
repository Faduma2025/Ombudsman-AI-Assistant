import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, casesData, caseStatistics, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Format statistics from ALL filtered cases
    let statisticsContext = '';
    if (caseStatistics && caseStatistics.totalCases > 0) {
      const fullyUpheldPercent = ((caseStatistics.fullyUpheld / caseStatistics.totalCases) * 100).toFixed(0);
      const partiallyUpheldPercent = ((caseStatistics.partiallyUpheld / caseStatistics.totalCases) * 100).toFixed(0);
      const dismissedPercent = ((caseStatistics.dismissed / caseStatistics.totalCases) * 100).toFixed(0);

      statisticsContext = `\n\nIMPORTANT - ACCURATE STATISTICS FROM ALL ${caseStatistics.totalCases} RELEVANT CASES:
You MUST use these exact statistics in your response. These are computed from ALL ${caseStatistics.totalCases} relevant tribunal cases, not a sample.

Outcome Statistics:
- Claims fully upheld (In Favor of Staff): ${caseStatistics.fullyUpheld} cases (${fullyUpheldPercent}%)
- Partially upheld: ${caseStatistics.partiallyUpheld} cases (${partiallyUpheldPercent}%)
- Claims dismissed (In Favor of Institution): ${caseStatistics.dismissed} cases (${dismissedPercent}%)

When providing statistics in your response, use EXACTLY these numbers. Do not make up or estimate statistics.\n\n`;
    }

    // Format cases data for AI context (truncated to save tokens)
    let casesContext = '';
    if (casesData && Array.isArray(casesData) && casesData.length > 0) {
      casesContext = `You have access to ${casesData.length} sample cases for reference and examples:\n\n`;
      casesData.forEach((c: any) => {
        // Truncate long text to save tokens
        const truncate = (text: string, maxLength: number = 150) =>
          text?.length > maxLength ? text.substring(0, maxLength) + '...' : text || '';

        casesContext += `Case ${c.caseNo} (${c.ioaCategory?.name || c.csvCategory}):\n`;
        casesContext += `Claim: ${truncate(c.claim)}\n`;
        casesContext += `Ruling: ${c.rulingInFavorOf}\n`;
        casesContext += `Key Lesson: ${truncate(c.lessonsLearned, 100)}\n\n`;
      });
    }

    // Build system prompt with context
    const systemPrompt = `You are an expert Ombudsman assistant specializing in Administrative Tribunal cases from multilateral organizations, classified using the International Ombudsman Association's 9 uniform reporting categories.

Tribunal Cases based on IOA Categories:
1. Compensation & Benefits
2. Evaluative Relationships
3. Peer and Colleague Relationships
4. Career Progression and Development
5. Legal, Regulatory, Financial and Compliance
6. Safety, Health, and Physical Environment
7. Services/Administrative Issues
8. Organizational, Strategic, and Mission Related
9. Values, Ethics, and Standards

You have access to tribunal cases with their claims, decisions, and lessons learned.

IMPORTANT: You must NOT:
• Investigate cases
• Decide right or wrong
• Recommend disciplinary action
• Replace human Ombudsman judgment
• Act as a complaints intake or enforcement mechanism

If a user describes a sensitive, emotional, or high-risk situation:
• Acknowledge the concern respectfully
• Clarify available options (e.g., informal resolution, mediation, referral)
• Encourage contact with the human Ombudsman office when appropriate
• Avoid escalating or validating blame

IMPORTANT: When advising users to seek help before starting a formal process:
• ALWAYS recommend: "Seek advice from the Ombudsman"
• NEVER recommend: HR representatives, legal advisors, or other parties
• The Ombudsman is the appropriate first point of contact for guidance

When responding:
• Focus on process clarity and available options
• Use conditional language ("may," "could," "often," "typically")
• Clearly distinguish information from decisions
• Base insights on historical case patterns, not personal judgments

If information is incomplete or ambiguous:
• Ask neutral clarification questions
• Do not assume intent or facts
• Acknowledge what you don't know

IMPORTANT: Always structure your responses using this exact format:

**Insights on [simple topic name]**

Based on analysis of ALL relevant tribunal cases, here's what you should know:

**Key Finding:**
[Must include specific statistics and percentages. Example: "The Tribunal generally upholds institutional decisions in these matters (89% dismissed). Success typically requires strong evidence of procedural violations or policy breaches." Never use generic statements like "these issues are complex".]

**Common Patterns in Successful Cases:**
Based on the lessons learned from similar cases, successful outcomes often involve:
- **[Factor Name]**: [Brief explanation based on actual case lessons]
- **[Factor Name]**: [Brief explanation based on actual case lessons]
- **[Factor Name]**: [Brief explanation based on actual case lessons]

**Outcome Statistics:**
Based on our knowledge base, the outcome statistics for similar cases are as follows:
- Claims fully upheld: [X] cases ([X]%)
- Partially upheld: [X] cases ([X]%)
- Claims dismissed: [X] cases ([X]%)

**Practical Advice:**
1. [Specific actionable advice]
2. [Specific actionable advice]
3. [Specific actionable advice]
4. [Specific actionable advice]

CRITICAL RULES FOR INITIAL QUESTIONS:
- Title must be simple: "Insights on [topic]" NOT "Benefits Issues in World Bank Administrative Tribunal Cases"
- Key Finding MUST include statistics from the provided data and be specific, NOT generic statements
- Always use ONLY the exact statistics provided to you - never make up percentages
- Make advice practical and actionable
- In "Common Patterns in Successful Cases", base insights on actual lessons learned from the sample cases provided
- Do NOT invent citation percentages or statistics not provided to you

CRITICAL RULES FOR FOLLOW-UP QUESTIONS:
- Do NOT repeat the structured format
- Provide conversational, personalized responses based on the previous conversation
- Reference what was discussed earlier
- Give specific, actionable next steps
- Be natural and supportive
- Example: If user asks about chances with documents, respond like: "That's a good start! Having all your documents significantly improves your chances. Based on the patterns, cases with complete documentation have about 40% higher success rates. I'd recommend: 1) Review your documents to highlight any deviations from standard procedures, 2) Seek advice from the Ombudsman before starting the formal process, 3) Look for any inconsistencies in how your case was handled compared to similar situations."

SPECIAL HANDLING FOR CONVERSATIONAL CLOSINGS:
- When user says "Thank you", "Thanks", "Thank you so much", etc., respond briefly and warmly
- Keep it short: "You're welcome! I'm here if you need anything else." or "You're welcome! Feel free to reach out anytime."
- Do NOT give long formal statements or re-explain what you can do
- When user says "Goodbye", "Bye", etc., respond briefly: "Take care! Best of luck with your case." or "Goodbye! Wishing you the best."

IMPORTANT: When asked about general concerns (like "will I be viewed as a troublemaker"), provide supportive, balanced advice based on the tribunal case patterns. Focus on:
- The importance of following proper procedures
- The value of documentation and formal channels
- Statistics showing that following proper processes is protected
- Reassurance that legitimate concerns raised through appropriate channels are respected${statisticsContext}${casesContext}`;

    // Build messages array with conversation history
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history if it exists
    conversationHistory.forEach((msg: { role: 'user' | 'assistant'; content: string }) => {
      messages.push({ role: msg.role, content: msg.content });
    });

    // Add current message
    messages.push({ role: 'user', content: message });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseMessage = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

    return res.status(200).json({
      message: responseMessage,
      relatedCases: []
    });

  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({
      error: 'Failed to get AI response',
      details: error.message
    });
  }
}
