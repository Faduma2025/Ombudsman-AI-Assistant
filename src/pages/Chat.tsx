import React, { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageComponent } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { SuggestedQuestions } from '../components/chat/SuggestedQuestions';
import { useChat } from '../hooks/useChat';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Chat: React.FC = () => {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Chat Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ask questions about tribunal cases and get AI-powered insights
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Clear Chat
          </button>
        )}
      </div>

      {messages.length === 0 && (
        <SuggestedQuestions onSelect={sendMessage} />
      )}

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-center px-4">
              <div className="max-w-2xl">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-4xl">🤖</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Hi! I'm Your AI Ombudsman Assistant
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                  I can help you explore tribunal cases, understand patterns, and provide insights based on 199 documented decisions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-blue-600 dark:text-blue-400 font-semibold mb-1">📊 Analyze Patterns</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ask about case trends, outcomes, and statistics</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-green-600 dark:text-green-400 font-semibold mb-1">🏛️ Explore Categories</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Learn about the 9 IOA classification categories</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="text-purple-600 dark:text-purple-400 font-semibold mb-1">💡 Get Insights</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Discover lessons learned from past cases</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="text-orange-600 dark:text-orange-400 font-semibold mb-1">⚖️ Understand Outcomes</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Compare ruling patterns and success rates</p>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                  💡 Tip: Start by selecting a suggested question below or type your own question!
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessageComponent key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
                <LoadingSpinner size="sm" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};
