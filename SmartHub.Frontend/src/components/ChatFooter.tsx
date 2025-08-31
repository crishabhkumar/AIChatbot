import React from 'react';
import { AIProvider } from '../types';

interface ChatFooterProps {
  availableProviders: AIProvider[];
}

const ChatFooter: React.FC<ChatFooterProps> = ({ availableProviders }) => {
  return (
    <div className="footer">
      <p>
        Powered by SmartHub API • {availableProviders.length} provider
        {availableProviders.length !== 1 ? 's' : ''} available
      </p>
    </div>
  );
};

export default ChatFooter;
