// Local Message type (for UI/local state)
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
}

// API Types (matching backend schema)

// Request types
export interface ChatRequest {
  message: string;
  conversation_id?: number | null;
}

// Response types
export interface MessageResponse {
  id: number;
  role: string;
  content: string;
  created_at: string;
}

export interface ConversationListItem {
  id: number;
  title: string | null;
  last_message_preview: string | null;
  message_count: number;
  created_at: string;
  updated_at: string | null;
}

export interface ConversationDetail {
  id: number;
  title: string | null;
  agents_used: unknown[] | null;
  conversation_metadata: Record<string, unknown> | null;
  messages: MessageResponse[];
  created_at: string;
  updated_at: string | null;
}

export interface ChatResponse {
  message: string;
  conversation_id: number;
  response: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}
