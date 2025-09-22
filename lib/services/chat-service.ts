import { ApiKeyService } from '@/lib/api-keys/service';
import { ApiKeyV2Data, CreateApiKeyRequest } from '@/lib/api-keys/types';

// Type alias for backward compatibility
export type ApiKey = ApiKeyV2Data;

// Response wrapper types
interface ServiceResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

class ChatService {
  private apiKeyService: ApiKeyService;

  constructor() {
    this.apiKeyService = new ApiKeyService();
  }

  /**
   * Get API keys for a project
   */
  async getApiKeys(projectId?: string): Promise<ServiceResponse<ApiKey[]>> {
    try {
      // For now, we'll use a default project ID or get from context
      const keys = await this.apiKeyService.listApiKeys(projectId || 'default-project');
      return { data: keys };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch API keys',
          code: 'FETCH_ERROR'
        }
      };
    }
  }

  /**
   * Create a new API key
   */
  async createApiKey(request: {
    name: string;
    scopes?: string[];
    permissions?: any[];
  }): Promise<ServiceResponse<{ apiKey: ApiKey; key: string }>> {
    try {
      const createRequest: CreateApiKeyRequest = {
        projectId: 'default-project', // TODO: Get from context
        userId: 'default-user', // TODO: Get from auth context
        name: request.name,
        permissions: request.permissions || [],
        scopes: request.scopes || ['chat:read']
      };

      const result = await this.apiKeyService.createApiKey(createRequest);
      return { data: result };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Failed to create API key',
          code: 'CREATE_ERROR'
        }
      };
    }
  }

  /**
   * Delete an API key
   */
  async deleteApiKey(id: string): Promise<ServiceResponse<void>> {
    try {
      await this.apiKeyService.deleteApiKey(id, 'default-project');
      return {};
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Failed to delete API key',
          code: 'DELETE_ERROR'
        }
      };
    }
  }

  /**
   * Regenerate an API key
   */
  async regenerateApiKey(id: string): Promise<ServiceResponse<{ apiKey: ApiKey; key: string }>> {
    try {
      const result = await this.apiKeyService.rotateApiKey(id, 'default-project');
      return { data: result };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Failed to regenerate API key',
          code: 'REGENERATE_ERROR'
        }
      };
    }
  }
}

// Export singleton instance
const chatService = new ChatService();
export default chatService;

// Export types for backward compatibility
export { ApiKey };