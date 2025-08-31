import React from 'react';
import { Trash2 } from 'lucide-react';

interface ChatHeaderProps {
  isOnline: boolean;
  onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isOnline, onClearChat }) => {
  return (
    <div className="chat-header">
      <div className="header-content">
        <h1>SmartHub AI Chat</h1>
        <p>Intelligent conversation assistant</p>
      </div>
      
      <div className="header-controls">
        <button
          onClick={onClearChat}
          className="header-clear-button"
          title="Clear Chat History"
        >
          <Trash2 size={16} />
          <span>Clear</span>
        </button>
        
        <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? '🟢 Connected' : '🔴 Offline'}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
