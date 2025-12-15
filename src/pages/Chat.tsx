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
        <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-center px-4">
              <div className="max-w-xl">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Get Advice Based on Past Cases
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Share your case or situation, and I'll provide advice based on insights from 199 tribunal cases.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>How it works:</strong>
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Describe your case or concern</li>
                    <li>• I'll analyze similar past tribunal cases</li>
                    <li>• Get personalized advice and insights</li>
                  </ul>
                </div>
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
