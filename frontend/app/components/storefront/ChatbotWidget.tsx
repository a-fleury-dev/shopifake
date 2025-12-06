import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { sendAssistMessage } from '../../clients/chatbotApiClient';
import { API_CONFIG } from '../../config/api';
import type { ChatbotSearchResult } from '../../lib/chatbot/dto';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  products?: ChatbotSearchResult[];
}

interface ChatbotWidgetProps {
  shopId: number;
  shopName: string;
  language: 'en' | 'fr';
}

export default function ChatbotWidget({ shopId, shopName, language }: ChatbotWidgetProps) {
  const navigate = useNavigate();
  const { domainName } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeMessage = language === 'fr' 
    ? `Bonjour ! 👋 Je suis l'assistant virtuel de ${shopName}. Comment puis-je vous aider aujourd'hui ?`
    : `Hello! 👋 I'm ${shopName}'s virtual assistant. How can I help you today?`;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        content: welcomeMessage,
        role: 'assistant',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length, welcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendAssistMessage({ 
        prompt: inputValue,
        top_k: 5,
        shop_id: shopId
      });
      
      // Verify each variant belongs to the current shop and get product slug
      const shopProducts: ChatbotSearchResult[] = [];
      
      for (const result of response.results) {
        try {
          // Check if variant exists in current shop
          const variantResponse = await fetch(API_CONFIG.endpoints.variants.byId(shopId, result.id), {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (variantResponse.ok) {
            const variantData = await variantResponse.json();
            
            // Get product to retrieve slug
            const productResponse = await fetch(API_CONFIG.endpoints.products.byId(shopId, variantData.productId), {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
            });
            
            if (productResponse.ok) {
              const productData = await productResponse.json();
              // Add product slug to result
              shopProducts.push({
                ...result,
                product_slug: productData.slug
              });
            }
          }
        } catch (error) {
          // Variant doesn't exist in this shop or error, skip it
          console.log(`Variant ${result.id} not found in shop ${shopId}`);
        }
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: shopProducts.length === 0 
          ? (language === 'fr' 
            ? "Pas de produits correspondants sur cette boutique. " + response.response
            : "No matching products in this shop. " + response.response)
          : response.response,
        role: 'assistant',
        timestamp: new Date(),
        products: shopProducts
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: language === 'fr' 
          ? "Désolé, une erreur s'est produite. Veuillez réessayer."
          : "Sorry, an error occurred. Please try again.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
        aria-label="Chat"
      >
        <div className="flex items-center justify-center text-2xl">
          {isOpen ? '✕' : '💬'}
        </div>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-96 h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          {/* Header */}
          <div
            className="p-4 border-b border-white/20"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{
                  background: 'rgba(147, 51, 234, 0.1)',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                }}
              >
                🤖
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {language === 'fr' ? 'Assistant' : 'Assistant'}
                </h3>
                <p className="text-xs text-gray-600">
                  {language === 'fr' ? 'En ligne' : 'Online'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'rounded-br-sm'
                      : 'rounded-bl-sm'
                  }`}
                  style={
                    message.role === 'user'
                      ? {
                          background: 'rgba(34, 197, 94, 0.9)',
                          color: 'white',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                        }
                      : {
                          background: 'rgba(148, 163, 184, 0.2)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(148, 163, 184, 0.3)',
                          color: '#1e293b',
                        }
                  }
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Product Links */}
                {message.products && message.products.length > 0 && (
                  <div className="mt-2 space-y-1 max-w-[80%]">
                    {message.products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          // Navigate to product page with variant ID as query param
                          navigate(`/${domainName}/products/${product.product_slug}?variant=${product.id}`);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 hover:scale-[1.02]"
                        style={{
                          background: 'rgba(147, 51, 234, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(147, 51, 234, 0.2)',
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-purple-700">{product.sku}</span>
                          <span className="text-green-600 font-semibold">{product.price}€</span>
                        </div>
                        <div className="text-gray-600 mt-1">{product.product_name}</div>
                        {Object.keys(product.attributes).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(product.attributes).map(([key, value]) => (
                              <span
                                key={key}
                                className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{
                                  background: 'rgba(147, 51, 234, 0.1)',
                                  color: '#7c3aed',
                                }}
                              >
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3"
                  style={{
                    background: 'rgba(148, 163, 184, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                  }}
                >
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            className="p-4 border-t border-white/20"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'fr' ? 'Écrivez votre message...' : 'Type your message...'}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 text-gray-900 placeholder:text-gray-500"
                style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: inputValue.trim() && !isLoading 
                    ? 'rgba(147, 51, 234, 0.9)'
                    : 'rgba(148, 163, 184, 0.3)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                {language === 'fr' ? 'Envoyer' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
