export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  responseType?: 'knowledge_base' | 'ai_generated' | 'default';
}