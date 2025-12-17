import { useState, useCallback } from 'react';
import { ChatMessage, ChatRequest, ChatResponse } from '../types/chat';
import { TribunalCase } from '../types/case';

interface UseChatProps {
  cases?: TribunalCase[];
}

export const useChat = (props?: UseChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Filter cases based on the question to reduce token usage
      const filterRelevantCases = (question: string, allCases: TribunalCase[]) => {
        const lowerQuestion = question.toLowerCase();

        // Keywords to filter cases
        const keywords = [
          'compensation', 'benefits', 'pension', 'salary', 'pay',
          'promotion', 'career', 'development',
          'discrimination', 'harassment', 'retaliation',
          'performance', 'evaluation', 'appraisal',
          'disciplinary', 'misconduct', 'termination',
          'contract', 'renewal', 'employment'
        ];

        // Check if question mentions specific categories
        const matchedKeywords = keywords.filter(kw => lowerQuestion.includes(kw));

        // If specific keywords found, filter cases; otherwise send all (for general questions)
        if (matchedKeywords.length > 0) {
          return allCases.filter(c => {
            const caseText = `${c.claim} ${c.decision} ${c.lessonsLearned} ${c.csvCategory}`.toLowerCase();
            return matchedKeywords.some(kw => caseText.includes(kw));
          });
        }

        // For general questions, send all cases
        return allCases;
      };

      const relevantCases = props?.cases ? filterRelevantCases(content, props.cases) : [];

      // Include conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const request: ChatRequest = {
        message: content,
        conversationHistory,
        casesData: relevantCases
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data: ChatResponse = await response.json();

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        relatedCases: data.relatedCases
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send message');

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please make sure the OpenAI API is properly configured.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, props?.cases]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat
  };
};
