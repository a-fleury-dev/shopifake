/**
 * Chatbot DTOs
 * Data Transfer Objects for chatbot service communication
 */

export interface ChatbotSearchRequest {
  query: string;
  shop_id: number;
  top_k?: number;
  min_score?: number;
  category_ids?: number[];
}

export interface ChatbotSearchResult {
  id: number;
  score: number;
  sku: string;
  product_name: string;
  price: string;
  stock: number;
  attributes: Record<string, string>;
  snippet: string;
}

export interface ChatbotSearchResponse {
  results: ChatbotSearchResult[];
}

export interface ChatbotChatRequest {
  message: string;
  shop_id: number;
  conversation_id?: string;
}

export interface ChatbotChatResponse {
  response: string;
  conversation_id: string;
  products?: ChatbotSearchResult[];
}
