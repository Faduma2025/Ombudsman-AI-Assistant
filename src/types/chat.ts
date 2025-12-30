export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedCases?: string[]; // Case numbers referenced
}

export interface ChatContext {
  categoryFilter?: number;
  relevantCases?: string[];
}

export interface CaseStatistics {
  totalCases: number;
  fullyUpheld: number;
  partiallyUpheld: number;
  dismissed: number;
  staffWins: number;
  institutionWins: number;
  partialWins: number;
}

export interface ChatRequest {
  message: string;
  context?: ChatContext;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  casesData?: any[]; // Sample cases for examples (max 20)
  caseStatistics?: CaseStatistics; // Accurate statistics from ALL filtered cases
}

export interface ChatResponse {
  message: string;
  relatedCases?: string[];
}
