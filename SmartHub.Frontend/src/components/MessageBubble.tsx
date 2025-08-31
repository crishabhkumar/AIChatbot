import React from 'react';
import { ChatMessage } from '../types';
import MarkdownMessage from './MarkdownMessage';
import { User, Bot, Clock, Zap, AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { content, isUser, timestamp, provider, model, tokensUsed, error } = message;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getProviderColor = (provider?: string) => {
    switch (provider?.toLowerCase()) {
      case 'azure openai':
      case 'azureopenai':
        return 'text-blue-600';
      case 'amazon bedrock':
      case 'amazonbedrock':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`flex max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : error 
                ? 'bg-red-500 text-white'
                : 'bg-gray-600 text-white'
          }`}>
            {isUser ? <User size={16} /> : error ? <AlertCircle size={16} /> : <Bot size={16} />}
          </div>
        </div>

        {/* Message Content */}
        <div className={`rounded-lg p-3 ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : error
              ? 'bg-red-50 border border-red-200'
              : 'bg-white border border-gray-200'
        }`}>
          {/* Error Message */}
          {error ? (
            <div className="text-red-600">
              <div className="font-medium">Error occurred:</div>
              <div className="text-sm mt-1">{error}</div>
            </div>
          ) : (
            /* Regular Message Content */
            <div className={isUser ? 'text-white' : 'text-gray-800'}>
              <MarkdownMessage content={content} isUser={isUser} />
            </div>
          )}

          {/* Message Metadata */}
          <div className={`flex items-center justify-between mt-2 pt-2 border-t ${
            isUser 
              ? 'border-blue-400 text-blue-100' 
              : error
                ? 'border-red-200 text-red-500'
                : 'border-gray-200 text-gray-500'
          } text-xs`}>
            <div className="flex items-center space-x-2">
              <Clock size={12} />
              <span>{formatTime(timestamp)}</span>
            </div>

            {/* AI Provider Info */}
            {!isUser && !error && (
              <div className="flex items-center space-x-2">
                {provider && (
                  <span className={`font-medium ${getProviderColor(provider)}`}>
                    {provider}
                  </span>
                )}
                {model && (
                  <span className="text-gray-400">
                    {model}
                  </span>
                )}
                {tokensUsed && (
                  <div className="flex items-center space-x-1">
                    <Zap size={12} />
                    <span>{tokensUsed}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
