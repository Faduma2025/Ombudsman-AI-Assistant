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
        const MAX_CASES = 20; // Limit to prevent token overflow

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

        let filtered: TribunalCase[];

        // If specific keywords found, filter cases
        if (matchedKeywords.length > 0) {
          filtered = allCases.filter(c => {
            const caseText = `${c.claim} ${c.decision} ${c.lessonsLearned} ${c.csvCategory}`.toLowerCase();
            return matchedKeywords.some(kw => caseText.includes(kw));
          });
        } else {
          // For general questions, send a sample of diverse cases
          filtered = allCases;
        }

        // Limit to MAX_CASES to prevent token overflow
        return filtered.slice(0, MAX_CASES);
      };

      const relevantCases = props?.cases ? filterRelevantCases(content, props.cases) : [];

      // Compute statistics from ALL filtered cases (before limiting to 20)
      const allFilteredCases = props?.cases ? (() => {
        const lowerQuestion = content.toLowerCase();
        const keywords = [
          'compensation', 'benefits', 'pension', 'salary', 'pay',
          'promotion', 'career', 'development',
          'discrimination', 'harassment', 'retaliation',
          'performance', 'evaluation', 'appraisal',
          'disciplinary', 'misconduct', 'termination',
          'contract', 'renewal', 'employment'
        ];

        const matchedKeywords = keywords.filter(kw => lowerQuestion.includes(kw));

        if (matchedKeywords.length > 0) {
          return props.cases.filter(c => {
            const caseText = `${c.claim} ${c.decision} ${c.lessonsLearned} ${c.csvCategory}`.toLowerCase();
            return matchedKeywords.some(kw => caseText.includes(kw));
          });
        }
        return props.cases;
      })() : [];

      // Compute statistics from ALL filtered cases
      const caseStatistics = {
        totalCases: allFilteredCases.length,
        fullyUpheld: allFilteredCases.filter(c => c.rulingInFavorOf === 'Applicant').length,
        partiallyUpheld: allFilteredCases.filter(c => c.rulingInFavorOf === 'Partially Applicant').length,
        dismissed: allFilteredCases.filter(c => c.rulingInFavorOf === 'Bank').length,
        staffWins: allFilteredCases.filter(c => c.rulingInFavorOf === 'Applicant').length,
        institutionWins: allFilteredCases.filter(c => c.rulingInFavorOf === 'Bank').length,
        partialWins: allFilteredCases.filter(c => c.rulingInFavorOf === 'Partially Applicant').length
      };

      // Include conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const request: ChatRequest = {
        message: content,
        conversationHistory,
        casesData: relevantCases, // Sample of 20 cases for examples
        caseStatistics // Statistics from ALL filtered cases
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to get response from AI');
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
        content: `I apologize, but I encountered an error: ${err.message || 'Please make sure the OpenAI API is properly configured.'}`,
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
