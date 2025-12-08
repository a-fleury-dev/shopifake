/**
 * Chatbot API Client
 * Client for communicating with the chatbot service
 */

import { API_CONFIG } from '../config/api';
import type {
  ChatbotSearchRequest,
  ChatbotSearchResponse,
  ChatbotAssistRequest,
  ChatbotAssistResponse,
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
 * Send a message to the chatbot assist endpoint
 */
export async function sendAssistMessage(
  request: ChatbotAssistRequest
): Promise<ChatbotAssistResponse> {
  try {
    const response = await fetch(API_CONFIG.endpoints.chatbot.assist(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Chatbot assist failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Chatbot assist error:', error);
    throw error;
  }
}
