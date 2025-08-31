import React from 'react';
import { ChatMessage } from '../types';
import MarkdownMessage from './MarkdownMessage';

interface MessagesAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessagesArea: React.FC<MessagesAreaProps> = ({
  messages,
  isLoading,
  messagesEndRef,
}) => {
  return (
    <div className="messages-area">
      {messages.length === 0 ? (
        <div className="welcome-message">
          <h2>Welcome to SmartHub AI</h2>
          <p>Start a conversation by typing a message below.</p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((msg: ChatMessage) => (
            <div key={msg.id} className={`message ${msg.isUser ? 'user' : 'ai'}`}>
              <div className="message-content">
                {msg.error ? (
                  <div className="error-message">Error: {msg.error}</div>
                ) : (
                  <div className="message-text">
                    {msg.isUser ? (
                      msg.content
                    ) : (
                      <MarkdownMessage content={msg.content} isUser={msg.isUser} />
                    )}
                  </div>
                )}
              </div>
              <div className="message-info">
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {!msg.isUser && msg.provider && (
                  <span className="message-provider">{msg.provider}</span>
                )}
                {!msg.isUser && msg.tokensUsed && (
                  <span className="message-tokens">{msg.tokensUsed} tokens</span>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message ai">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessagesArea;
