'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import chatService, { Conversation, ChatMessage, Agent } from '../services/chat-service';
import websocketService, { WebSocketEvent } from '../services/websocket-service';

// Context types
interface ChatContextType {
  // Conversations
  conversations: Conversation[];
  activeConversation: Conversation | null;
  conversationsLoading: boolean;
  conversationsError: string | null;
  setActiveConversation: (conversation: Conversation | null) => void;
  loadConversations: (status?: string) => Promise<void>;

  // Messages
  messages: ChatMessage[];
  messagesLoading: boolean;
  messagesError: string | null;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, message: string, attachments?: string[]) => Promise<void>;

  // Agents
  agents: Agent[];
  agentsLoading: boolean;
  agentsError: string | null;
  loadAgents: () => Promise<void>;

  // Typing indicators
  typingUsers: Record<string, string[]>;
  setTyping: (conversationId: string, isTyping: boolean) => void;

  // Message status
  markMessageAsRead: (messageId: string) => void;

  // WebSocket status
  isConnected: boolean;
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for conversations
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [conversationsError, setConversationsError] = useState<string | null>(null);

  // State for messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  // State for agents
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agentsError, setAgentsError] = useState<string | null>(null);

  // State for typing indicators
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});

  // WebSocket connection status
  const [isConnected, setIsConnected] = useState(false);

  // Load conversations
  const loadConversations = useCallback(async (status?: string) => {
    setConversationsLoading(true);
    setConversationsError(null);

    try {
      const response = await chatService.getLiveChats({ status });

      if (response.error) {
        setConversationsError(response.error.message);
      } else if (response.data) {
        setConversations(response.data.data);
      }
    } catch (error) {
      setConversationsError('Failed to load conversations');
      console.error('Error loading conversations:', error);
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    setMessagesLoading(true);
    setMessagesError(null);

    try {
      const response = await chatService.getLiveChatMessages(conversationId);

      if (response.error) {
        setMessagesError(response.error.message);
      } else if (response.data) {
        setMessages(response.data.data);

        // Mark messages as read
        response.data.data.forEach(message => {
          if (message.sender !== 'agent' && message.status !== 'read') {
            markMessageAsRead(message.id);
          }
        });
      }
    } catch (error) {
      setMessagesError('Failed to load messages');
      console.error('Error loading messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  }, [markMessageAsRead]);

  // Send a message
  const sendMessage = useCallback(async (conversationId: string, message: string, attachments?: string[]) => {
    try {
      // Optimistically add the message to the UI
      const optimisticMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: conversationId,
        sender: 'agent',
        sender_id: 'current-agent', // This would be the current agent's ID in a real app
        message,
        timestamp: new Date().toISOString(),
        status: 'sent',
        attachments: attachments ? attachments.map((url, index) => ({
          id: `temp-attachment-${index}`,
          name: url.split('/').pop() || 'attachment',
          url,
          type: 'image/jpeg', // This would be determined by the file in a real app
          size: 0,
        })) : undefined,
      };

      setMessages(prev => [...prev, optimisticMessage]);

      // Send the message to the API
      const response = await chatService.sendLiveChatMessage({
        conversation_id: conversationId,
        message,
        attachments,
      });

      if (response.error) {
        // Handle error - in a real app, you might want to show a notification
        console.error('Error sending message:', response.error);

        // Remove the optimistic message
        setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      } else if (response.data) {
        // Replace the optimistic message with the real one
        setMessages(prev => prev.map(m =>
          m.id === optimisticMessage.id ? response.data! : m
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, []);

  // Load agents
  const loadAgents = useCallback(async () => {
    setAgentsLoading(true);
    setAgentsError(null);

    try {
      const response = await chatService.getAgents();

      if (response.error) {
        setAgentsError(response.error.message);
      } else if (response.data) {
        setAgents(response.data.data);
      }
    } catch (error) {
      setAgentsError('Failed to load agents');
      console.error('Error loading agents:', error);
    } finally {
      setAgentsLoading(false);
    }
  }, []);

  // Set typing indicator
  const setTyping = useCallback((conversationId: string, isTyping: boolean) => {
    // Send typing indicator via WebSocket
    websocketService.sendTypingIndicator(conversationId, isTyping);
  }, []);

  // Mark message as read
  const markMessageAsRead = useCallback((messageId: string) => {
    // Send read receipt via WebSocket
    websocketService.sendReadReceipt(messageId);

    // Update message status locally
    setMessages(prev => prev.map(message =>
      message.id === messageId
        ? { ...message, status: 'read' }
        : message
    ));
  }, []);

  // Handle WebSocket events
  const handleWebSocketEvent = useCallback((event: WebSocketEvent) => {
    switch (event.type) {
      case 'message':
        // Add new message to the messages list if it's for the active conversation
        if (activeConversation && event.data.conversation_id === activeConversation.id) {
          setMessages(prev => [...prev, event.data]);

          // Mark the message as read if it's from the user
          if (event.data.sender !== 'agent') {
            markMessageAsRead(event.data.id);
          }
        }

        // Update the last message in the conversation list
        setConversations(prev => prev.map(conv =>
          conv.id === event.data.conversation_id
            ? { ...conv, last_message: event.data }
            : conv
        ));
        break;

      case 'conversation_update':
        // Update the conversation in the list
        setConversations(prev => prev.map(conv =>
          conv.id === event.data.id ? event.data : conv
        ));

        // Update active conversation if it's the one that was updated
        if (activeConversation && activeConversation.id === event.data.id) {
          setActiveConversation(event.data);
        }
        break;

      case 'agent_status':
        // Update agent status
        setAgents(prev => prev.map(agent =>
          agent.id === event.data.agent_id
            ? { ...agent, status: event.data.status }
            : agent
        ));
        break;

      case 'typing':
        // Update typing indicators
        setTypingUsers(prev => {
          const conversationId = event.data.conversation_id;
          const userId = event.data.user_id;
          const isTyping = event.data.is_typing;

          if (!prev[conversationId]) {
            prev[conversationId] = [];
          }

          if (isTyping && !prev[conversationId].includes(userId)) {
            return {
              ...prev,
              [conversationId]: [...prev[conversationId], userId],
            };
          } else if (!isTyping && prev[conversationId].includes(userId)) {
            return {
              ...prev,
              [conversationId]: prev[conversationId].filter(id => id !== userId),
            };
          }

          return prev;
        });
        break;

      case 'message_status':
        // Update message status
        setMessages(prev => prev.map(message =>
          message.id === event.data.message_id
            ? { ...message, status: event.data.status }
            : message
        ));
        break;
    }
  }, [activeConversation, markMessageAsRead]);

  // Initialize WebSocket connection
  useEffect(() => {
    // In a real app, you would get the token from your auth system
    const token = localStorage.getItem('auth_token');

    if (token) {
      websocketService.connect(token);

      // Add event listener
      const removeListener = websocketService.addEventListener(handleWebSocketEvent);

      // Check connection status periodically
      const checkConnection = setInterval(() => {
        setIsConnected(websocketService.isConnected());
      }, 5000);

      return () => {
        removeListener();
        clearInterval(checkConnection);
        websocketService.disconnect();
      };
    }
  }, [handleWebSocketEvent]);

  // Context value
  const value: ChatContextType = {
    conversations,
    activeConversation,
    conversationsLoading,
    conversationsError,
    setActiveConversation,
    loadConversations,

    messages,
    messagesLoading,
    messagesError,
    loadMessages,
    sendMessage,

    agents,
    agentsLoading,
    agentsError,
    loadAgents,

    typingUsers,
    setTyping,

    markMessageAsRead,

    isConnected,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Hook for using the chat context
export const useChat = () => {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }

  return context;
};
