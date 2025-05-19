import { ChatMessage, Conversation, Agent } from './chat-service';

// WebSocket event types
export type WebSocketEvent = 
  | { type: 'message'; data: ChatMessage }
  | { type: 'conversation_update'; data: Conversation }
  | { type: 'agent_status'; data: { agent_id: string; status: 'online' | 'offline' | 'away' } }
  | { type: 'typing'; data: { conversation_id: string; user_id: string; is_typing: boolean } }
  | { type: 'message_status'; data: { message_id: string; status: 'sent' | 'delivered' | 'read' } };

// WebSocket service
class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: ((event: WebSocketEvent) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private token: string | null = null;

  /**
   * Initialize the WebSocket connection
   */
  connect(token: string) {
    if (this.socket) {
      this.disconnect();
    }

    this.token = token;
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.sozuri.com/ws';
    
    try {
      this.socket = new WebSocket(`${wsUrl}?token=${token}`);
      
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.attemptReconnect();
    }
  }

  /**
   * Disconnect the WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.reconnectAttempts = 0;
  }

  /**
   * Add an event listener
   */
  addEventListener(callback: (event: WebSocketEvent) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Send a message through the WebSocket
   */
  send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  /**
   * Send a typing indicator
   */
  sendTypingIndicator(conversationId: string, isTyping: boolean) {
    return this.send({
      type: 'typing',
      conversation_id: conversationId,
      is_typing: isTyping
    });
  }

  /**
   * Send a message read receipt
   */
  sendReadReceipt(messageId: string) {
    return this.send({
      type: 'read_receipt',
      message_id: messageId
    });
  }

  /**
   * Handle WebSocket open event
   */
  private handleOpen() {
    console.log('WebSocket connection established');
    this.reconnectAttempts = 0;
    
    // Start ping interval to keep connection alive
    this.pingInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Handle WebSocket message event
   */
  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      
      // Ignore pong responses
      if (data.type === 'pong') {
        return;
      }
      
      // Notify all listeners
      this.listeners.forEach(listener => {
        listener(data as WebSocketEvent);
      });
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Handle WebSocket close event
   */
  private handleClose(event: CloseEvent) {
    console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
    
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    // Attempt to reconnect if the connection was closed unexpectedly
    if (event.code !== 1000) { // 1000 is normal closure
      this.attemptReconnect();
    }
  }

  /**
   * Handle WebSocket error event
   */
  private handleError(event: Event) {
    console.error('WebSocket error:', event);
    this.attemptReconnect();
  }

  /**
   * Attempt to reconnect to the WebSocket
   */
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnection attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.log(`Attempting to reconnect in ${delay}ms...`);
    
    this.reconnectAttempts++;
    
    this.reconnectTimeout = setTimeout(() => {
      if (this.token) {
        this.connect(this.token);
      }
    }, delay);
  }

  /**
   * Check if the WebSocket is connected
   */
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService;
