import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types/chat';
import clsx from 'clsx';

interface ChatMessageProps {
  message: ChatMessageType;
}

const formatMessageContent = (content: string) => {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      elements.push(<br key={`br-${index}`} />);
      return;
    }

    // Bold headings (** text **)
    if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
      const text = trimmedLine.slice(2, -2);
      elements.push(
        <div key={index} className="font-bold text-base mt-3 mb-2">
          {text}
        </div>
      );
      return;
    }

    // Bullet points (- text)
    if (trimmedLine.startsWith('- ')) {
      const text = trimmedLine.slice(2);
      // Handle inline bold within bullet points
      const formattedText = text.split(/(\*\*.*?\*\*)/).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      elements.push(
        <div key={index} className="flex items-start ml-4 mb-1">
          <span className="mr-2">•</span>
          <span>{formattedText}</span>
        </div>
      );
      return;
    }

    // Numbered lists (1. text, 2. text, etc.)
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      const [, number, text] = numberedMatch;
      elements.push(
        <div key={index} className="flex items-start ml-4 mb-1">
          <span className="mr-2 font-medium">{number}.</span>
          <span>{text}</span>
        </div>
      );
      return;
    }

    // Regular text with inline bold
    const formattedText = trimmedLine.split(/(\*\*.*?\*\*)/).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    elements.push(
      <div key={index} className="mb-1">
        {formattedText}
      </div>
    );
  });

  return elements;
};

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
          <div className="flex-1">
            <div className="text-sm">
              {formatMessageContent(message.content)}
            </div>
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
