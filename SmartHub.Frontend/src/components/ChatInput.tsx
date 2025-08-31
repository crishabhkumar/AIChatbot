import React from 'react';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  isOnline: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  onSendMessage,
  isLoading,
  isOnline
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && isOnline) {
      onSendMessage(e);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading && isOnline) {
        // Create a form event for consistency
        const formEvent = e as any as React.FormEvent;
        onSendMessage(formEvent);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <div className="chat-input-container">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            !isOnline 
              ? "Disconnected from server..." 
              : isLoading 
                ? "AI is thinking..." 
                : "Type your message here..."
          }
          disabled={isLoading || !isOnline}
          className="chat-input"
          rows={1}
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading || !isOnline}
          className="send-button"
        >
          {isLoading ? '⏳' : '📤'}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
