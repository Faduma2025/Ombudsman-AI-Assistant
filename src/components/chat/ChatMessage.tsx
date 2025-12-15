import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types/chat';
import clsx from 'clsx';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-[80%] rounded-lg p-4 mb-4',
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
        )}
      >
        <div className="flex items-start">
          {!isUser && (
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
              <span className="text-blue-600 dark:text-blue-300 font-bold">AI</span>
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            {message.relatedCases && message.relatedCases.length > 0 && (
              <div className="mt-2 text-xs opacity-75">
                Related cases: {message.relatedCases.join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
