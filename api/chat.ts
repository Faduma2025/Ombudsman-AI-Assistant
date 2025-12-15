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

Your role is to:
- Help users understand tribunal case patterns and outcomes
- Provide advice based on historical case data
- Explain IOA categories and how cases are classified
- Offer insights on likely outcomes based on similar cases

You have access to 199 tribunal cases with their claims, decisions, and lessons learned.
Provide accurate, helpful advice while noting you're an AI assistant for informational purposes only.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
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
