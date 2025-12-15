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

export interface ChatRequest {
  message: string;
  context?: ChatContext;
}

export interface ChatResponse {
  message: string;
  relatedCases?: string[];
}
