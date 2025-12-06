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
  product_slug: string;
  price: string;
  stock: number;
  shop_id: number;
  attributes: Record<string, string>;
  snippet: string;
}

export interface ChatbotSearchResponse {
  results: ChatbotSearchResult[];
}

export interface ChatbotAssistRequest {
  prompt: string;
  shop_id?: number;
  top_k?: number;
}

export interface ChatbotAssistResponse {
  response: string;
  results: ChatbotSearchResult[];
  intent: string;
}
