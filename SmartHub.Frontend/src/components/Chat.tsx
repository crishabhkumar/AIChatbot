import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { Trash2, AlertTriangle } from 'lucide-react';
import { ChatMessage, ChatSettings, AIProvider } from '../types';
import { aiApi, handleApiError } from '../api';
import ChatHeader from './ChatHeader';
import SettingsPanel from './SettingsPanel';
import MessagesArea from './MessagesArea';
import ChatInput from './ChatInput';
import ChatFooter from './ChatFooter';
import '../App.css';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState<ChatSettings>({
    temperature: 0.7,
    maxTokens: 1000,
    systemMessage: 'You are a helpful AI assistant. Provide clear, accurate, and useful responses.',
    selectedProvider: undefined,
  });
  const [availableProviders, setAvailableProviders] = useState<AIProvider[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check API connection and get available providers
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await aiApi.healthCheck();
        const providers = await aiApi.getAvailableProviders();
        setAvailableProviders(providers);
        setIsOnline(true);
      } catch (error) {
        console.error('Failed to connect to API:', error);
        setIsOnline(false);
      }
    };

    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isOnline || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev: ChatMessage[]) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const request = {
        prompt: message.trim(),
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        systemMessage: settings.systemMessage || undefined,
      };

      let response;
      if (settings.selectedProvider !== undefined) {
        response = await aiApi.generateResponse(request, settings.selectedProvider);
      } else {
        response = await aiApi.generateResponseWithFallback(request);
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        isUser: false,
        timestamp: new Date(response.timestamp),
        provider: response.provider,
        model: response.model,
        tokensUsed: response.tokensUsed,
      };

      setMessages((prev: ChatMessage[]) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = handleApiError(error);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: '',
        isUser: false,
        timestamp: new Date(),
        error: errorMessage,
      };

      setMessages((prev: ChatMessage[]) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setIsClearModalOpen(true);
  };

  const confirmClearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
    setIsClearModalOpen(false);
  };

  const cancelClearChat = () => {
    setIsClearModalOpen(false);
  };

  return (
    <div className="chat-container">
      <ChatHeader isOnline={isOnline} onClearChat={handleClearChat} />
      
      <SettingsPanel
        settings={settings}
        setSettings={setSettings}
        availableProviders={availableProviders}
      />

      <MessagesArea
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />

      <ChatInput
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        isOnline={isOnline}
      />

      <ChatFooter availableProviders={availableProviders} />

      {/* Clear Chat Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onRequestClose={cancelClearChat}
        className="clear-chat-modal"
        overlayClassName="clear-chat-modal-overlay"
        ariaHideApp={false}
      >
        <div className="modal-header">
          <div className="modal-icon">
            <AlertTriangle size={32} className="text-orange-500" />
          </div>
          <h2 className="modal-title">Clear Chat History</h2>
        </div>
        
        <div className="modal-body">
          <p className="modal-message">
            Are you sure you want to clear all chat history? This action cannot be undone.
          </p>
        </div>
        
        <div className="modal-actions">
          <button onClick={cancelClearChat} className="modal-cancel-btn">
            Cancel
          </button>
          <button onClick={confirmClearChat} className="modal-confirm-btn">
            <Trash2 size={16} />
            Clear History
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Chat;
