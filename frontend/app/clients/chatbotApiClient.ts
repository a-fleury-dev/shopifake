/**
 * Chatbot API Client
 * Client for communicating with the chatbot service
 */

import { API_CONFIG } from '../config/api';
import type {
  ChatbotSearchRequest,
  ChatbotSearchResponse,
  ChatbotChatRequest,
  ChatbotChatResponse,
} from '../lib/chatbot/dto';

/**
 * Search products using semantic search
 */
export async function searchProducts(
  request: ChatbotSearchRequest
): Promise<ChatbotSearchResponse> {
  try {
    const response = await fetch(API_CONFIG.endpoints.chatbot.search(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Chatbot search failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Chatbot search error:', error);
    throw error;
  }
}

/**
 * Send a chat message to the chatbot
 */
export async function sendChatMessage(
  request: ChatbotChatRequest
): Promise<ChatbotChatResponse> {
  try {
    const response = await fetch(API_CONFIG.endpoints.chatbot.chat(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Chatbot chat failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Chatbot chat error:', error);
    throw error;
  }
}
