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
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build system prompt with context
    const systemPrompt = `You are an expert Ombudsman assistant specializing in World Bank Administrative Tribunal cases and the International Ombudsman Association's 9 uniform reporting categories.

The 9 IOA categories are:
1. Compensation & Benefits
2. Evaluative Relationships
3. Peer and Colleague Relationships
4. Career Progression and Development
5. Legal, Regulatory, Financial and Compliance
6. Safety, Health, and Physical Environment
7. Services/Administrative Issues
8. Organizational, Strategic, and Mission Related
9. Values, Ethics, and Standards

You have access to 199 tribunal cases with their claims, decisions, and lessons learned.

IMPORTANT: Always structure your responses using this exact format:

**Insights on [simple topic name]**

Based on analysis of [X] tribunal cases, here's what you should know:

**Key Finding:**
[Must include specific statistics and percentages. Example: "The Tribunal generally upholds institutional decisions in these matters (89% dismissed). Success typically requires strong evidence of procedural violations or policy breaches." Never use generic statements like "these issues are complex".]

**Outcome Statistics:**
- Claims fully upheld: [X] cases ([X]%)
- Partially upheld: [X] cases ([X]%)
- Claims dismissed: [X] cases ([X]%)

**What Makes Cases Succeed:**
- [Factor 1] (cited in [X]% of cases): [Brief explanation]
- [Factor 2] (cited in [X]% of cases): [Brief explanation]
- [Factor 3] (cited in [X]% of cases): [Brief explanation]

**Practical Advice:**
1. [Specific actionable advice]
2. [Specific actionable advice]
3. [Specific actionable advice]
4. [Specific actionable advice]

CRITICAL RULES:
- Title must be simple: "Insights on [topic]" NOT "Benefits Issues in World Bank Administrative Tribunal Cases"
- Key Finding MUST include statistics and be specific, NOT generic statements
- Always provide real numbers and percentages
- Make advice practical and actionable`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
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
