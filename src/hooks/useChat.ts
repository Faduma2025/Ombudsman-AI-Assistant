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

        // Map question to IOA category (same logic as statistics)
        let targetCategoryId: number | null = null;

        if (lowerQuestion.match(/\b(compensation|benefit|pension|salary|pay|allowance|severance)\b/i)) {
          targetCategoryId = 1;
        } else if (lowerQuestion.match(/\b(performance|evaluation|appraisal|evaluat|rating|supervisor|manager|work program|retaliation)\b/i)) {
          targetCategoryId = 2;
        } else if (lowerQuestion.match(/\b(peer|colleague|workplace relationship|coworker)\b/i)) {
          targetCategoryId = 3;
        } else if (lowerQuestion.match(/\b(promotion|career|recruitment|appointment|contract|hiring|non-selection)\b/i)) {
          targetCategoryId = 4;
        } else if (lowerQuestion.match(/\b(legal|compliance|discrimination|harassment|regulatory|fraud)\b/i)) {
          targetCategoryId = 5;
        } else if (lowerQuestion.match(/\b(safety|health|medical|disability|illness|injury)\b/i)) {
          targetCategoryId = 6;
        } else if (lowerQuestion.match(/\b(service|administrative|process|procedure|objection)\b/i)) {
          targetCategoryId = 7;
        } else if (lowerQuestion.match(/\b(organizational|strategic|restructur|reorganization|budget)\b/i)) {
          targetCategoryId = 8;
        } else if (lowerQuestion.match(/\b(ethics|misconduct|disciplinary|code of conduct)\b/i)) {
          targetCategoryId = 9;
        }

        let filtered: TribunalCase[];

        // Filter by IOA category if matched
        if (targetCategoryId !== null) {
          filtered = allCases.filter(c => c.ioaCategory?.id === targetCategoryId);
        } else {
          filtered = allCases;
        }

        // Limit to MAX_CASES to prevent token overflow
        return filtered.slice(0, MAX_CASES);
      };

      const relevantCases = props?.cases ? filterRelevantCases(content, props.cases) : [];

      // Compute statistics from ALL filtered cases (before limiting to 20)
      const allFilteredCases = props?.cases ? (() => {
        const lowerQuestion = content.toLowerCase();

        // Map question to IOA category
        let targetCategoryId: number | null = null;

        // Category 1: Compensation & Benefits
        if (lowerQuestion.match(/\b(compensation|benefit|pension|salary|pay|allowance|severance)\b/i)) {
          targetCategoryId = 1;
        }
        // Category 2: Evaluative Relationships - MOST IMPORTANT FOR EVALUATION QUESTIONS
        else if (lowerQuestion.match(/\b(performance|evaluation|appraisal|evaluat|rating|supervisor|manager|work program|retaliation)\b/i)) {
          targetCategoryId = 2;
        }
        // Category 3: Peer and Colleague Relationships
        else if (lowerQuestion.match(/\b(peer|colleague|workplace relationship|coworker)\b/i)) {
          targetCategoryId = 3;
        }
        // Category 4: Career Progression and Development
        else if (lowerQuestion.match(/\b(promotion|career|recruitment|appointment|contract|hiring|non-selection)\b/i)) {
          targetCategoryId = 4;
        }
        // Category 5: Legal, Regulatory, Financial and Compliance
        else if (lowerQuestion.match(/\b(legal|compliance|discrimination|harassment|regulatory|fraud)\b/i)) {
          targetCategoryId = 5;
        }
        // Category 6: Safety, Health, and Physical Environment
        else if (lowerQuestion.match(/\b(safety|health|medical|disability|illness|injury)\b/i)) {
          targetCategoryId = 6;
        }
        // Category 7: Services/Administrative Issues
        else if (lowerQuestion.match(/\b(service|administrative|process|procedure|objection)\b/i)) {
          targetCategoryId = 7;
        }
        // Category 8: Organizational, Strategic, and Mission Related
        else if (lowerQuestion.match(/\b(organizational|strategic|restructur|reorganization|budget)\b/i)) {
          targetCategoryId = 8;
        }
        // Category 9: Values, Ethics, and Standards
        else if (lowerQuestion.match(/\b(ethics|misconduct|disciplinary|code of conduct)\b/i)) {
          targetCategoryId = 9;
        }

        // Filter by IOA category if matched, otherwise use all cases
        if (targetCategoryId !== null) {
          return props.cases.filter(c => c.ioaCategory?.id === targetCategoryId);
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
