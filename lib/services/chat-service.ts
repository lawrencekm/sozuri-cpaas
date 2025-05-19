import apiClient, { ApiResponse, PaginatedResponse } from '../api-client';

// Types
export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender: 'user' | 'agent' | 'bot';
  sender_id: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

export interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  agent?: {
    id: string;
    name: string;
    avatar?: string;
  };
  status: 'active' | 'waiting' | 'resolved' | 'transferred';
  created_at: string;
  updated_at: string;
  last_message?: ChatMessage;
  tags: string[];
  metadata?: Record<string, any>;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'agent';
  status: 'online' | 'offline' | 'away';
  avatar?: string;
  skills: string[];
  metadata?: Record<string, any>;
}

export interface Chatbot {
  id: string;
  name: string;
  display_name: string;
  description: string;
  type: 'ai' | 'rule-based';
  status: 'active' | 'inactive' | 'draft';
  created_at: string;
  updated_at: string;
  settings: {
    welcome_message: string;
    fallback_message: string;
    handoff_message?: string;
    handoff_enabled: boolean;
    proactive_enabled: boolean;
    typing_indicator: boolean;
    response_time: number;
  };
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used_at?: string;
  status: 'active' | 'inactive';
  scopes: string[];
}

// Chat Service
class ChatService {
  // Live Chat API
  async getLiveChats(params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<Conversation>>> {
    return apiClient.get<PaginatedResponse<Conversation>>('/v1/chat/live', params);
  }

  async getLiveChatById(id: string): Promise<ApiResponse<Conversation>> {
    return apiClient.get<Conversation>(`/v1/chat/live/${id}`);
  }

  async createLiveChat(data: { user_id: string; metadata?: Record<string, any> }): Promise<ApiResponse<Conversation>> {
    return apiClient.post<Conversation>('/v1/chat/live', data);
  }

  async updateLiveChatStatus(id: string, status: 'active' | 'resolved' | 'transferred'): Promise<ApiResponse<Conversation>> {
    return apiClient.put<Conversation>(`/v1/chat/live/${id}/status`, { status });
  }

  async assignLiveChat(id: string, agent_id: string): Promise<ApiResponse<Conversation>> {
    return apiClient.put<Conversation>(`/v1/chat/live/${id}/assign`, { agent_id });
  }

  async getLiveChatMessages(conversation_id: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<ChatMessage>>> {
    return apiClient.get<PaginatedResponse<ChatMessage>>(`/v1/chat/live/${conversation_id}/messages`, params);
  }

  async sendLiveChatMessage(data: { conversation_id: string; message: string; attachments?: string[] }): Promise<ApiResponse<ChatMessage>> {
    return apiClient.post<ChatMessage>('/v1/chat/live/message', data);
  }

  // Chatbot API
  async getChatbots(params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<Chatbot>>> {
    return apiClient.get<PaginatedResponse<Chatbot>>('/v1/chat/bots', params);
  }

  async getChatbotById(id: string): Promise<ApiResponse<Chatbot>> {
    return apiClient.get<Chatbot>(`/v1/chat/bots/${id}`);
  }

  async createChatbot(data: Partial<Chatbot>): Promise<ApiResponse<Chatbot>> {
    return apiClient.post<Chatbot>('/v1/chat/bots', data);
  }

  async updateChatbot(id: string, data: Partial<Chatbot>): Promise<ApiResponse<Chatbot>> {
    return apiClient.put<Chatbot>(`/v1/chat/bots/${id}`, data);
  }

  async deleteChatbot(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/v1/chat/bots/${id}`);
  }

  async sendChatbotMessage(data: { conversation_id: string; message: string }): Promise<ApiResponse<ChatMessage>> {
    return apiClient.post<ChatMessage>('/v1/chat/bot/message', data);
  }

  // Agent API
  async getAgents(params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<Agent>>> {
    return apiClient.get<PaginatedResponse<Agent>>('/v1/chat/agents', params);
  }

  async getAgentById(id: string): Promise<ApiResponse<Agent>> {
    return apiClient.get<Agent>(`/v1/chat/agents/${id}`);
  }

  async createAgent(data: Partial<Agent>): Promise<ApiResponse<Agent>> {
    return apiClient.post<Agent>('/v1/chat/agents', data);
  }

  async updateAgent(id: string, data: Partial<Agent>): Promise<ApiResponse<Agent>> {
    return apiClient.put<Agent>(`/v1/chat/agents/${id}`, data);
  }

  async deleteAgent(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/v1/chat/agents/${id}`);
  }

  async updateAgentStatus(id: string, status: 'online' | 'offline' | 'away'): Promise<ApiResponse<Agent>> {
    return apiClient.put<Agent>(`/v1/chat/agents/${id}/status`, { status });
  }

  // API Keys
  async getApiKeys(): Promise<ApiResponse<ApiKey[]>> {
    return apiClient.get<ApiKey[]>('/v1/api-keys');
  }

  async createApiKey(data: { name: string; scopes: string[] }): Promise<ApiResponse<ApiKey>> {
    return apiClient.post<ApiKey>('/v1/api-keys', data);
  }

  async deleteApiKey(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/v1/api-keys/${id}`);
  }

  async regenerateApiKey(id: string): Promise<ApiResponse<ApiKey>> {
    return apiClient.post<ApiKey>(`/v1/api-keys/${id}/regenerate`, {});
  }
}

// Create a singleton instance
const chatService = new ChatService();

export default chatService;
