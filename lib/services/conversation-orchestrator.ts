import { PrismaClient } from '@prisma/client';
import { ChannelRouter } from './channel-router';
import { ConversationManager } from './conversation-manager';
import { CustomerJourneyTracker } from './customer-journey-tracker';

const prisma = new PrismaClient();

export interface SendMessageRequest {
  projectId: string;
  customerId: string; // Phone number, email, or customer ID
  content: any; // Message content (text, media, etc.)
  messageType?: string;
  subject?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  category?: string;
  preferredChannel?: string;
  fallbackChannels?: string[];
  context?: any;
  automationId?: string;
}

export interface ConversationContext {
  conversationId: string;
  customerId: string;
  customerData: any;
  preferences: any;
  journeyStage: string;
  lastChannel: string;
  channelHistory: any[];
  activeChannels: string[];
}

export class ConversationOrchestrator {
  private channelRouter: ChannelRouter;
  private conversationManager: ConversationManager;
  private journeyTracker: CustomerJourneyTracker;

  constructor() {
    this.channelRouter = new ChannelRouter();
    this.conversationManager = new ConversationManager();
    this.journeyTracker = new CustomerJourneyTracker();
  }

  /**
   * Send a message with intelligent routing and conversation orchestration
   */
  async sendMessage(request: SendMessageRequest): Promise<{
    success: boolean;
    conversationId: string;
    messageId: string;
    channel: string;
    routeId: string;
    error?: string;
  }> {
    try {
      // 1. Get or create conversation
      const conversation = await this.conversationManager.getOrCreateConversation({
        projectId: request.projectId,
        customerId: request.customerId,
        category: request.category,
        priority: request.priority || 'normal'
      });

      // 2. Build conversation context
      const context = await this.buildConversationContext(conversation.conversationId);

      // 3. Determine optimal channel routing
      const routingDecision = await this.channelRouter.determineOptimalRoute({
        projectId: request.projectId,
        customerId: request.customerId,
        preferredChannel: request.preferredChannel,
        fallbackChannels: request.fallbackChannels,
        messageType: request.messageType || 'text',
        priority: request.priority || 'normal',
        context: context
      });

      // 4. Create unified message
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const unifiedMessage = await prisma.unifiedMessage.create({
        data: {
          messageId,
          conversationId: conversation.conversationId,
          projectId: request.projectId,
          channel: routingDecision.primaryChannel,
          channelProvider: routingDecision.provider,
          fromId: 'system',
          fromType: 'system',
          fromIdentifier: routingDecision.fromIdentifier,
          toId: request.customerId,
          toType: 'customer',
          toIdentifier: request.customerId,
          messageType: request.messageType || 'text',
          content: request.content,
          subject: request.subject,
          routeId: routingDecision.routeId,
          isAutoRouted: true,
          routingReason: routingDecision.reason,
          priority: request.priority || 'normal',
          isAutomated: !!request.automationId,
          automationId: request.automationId
        }
      });

      // 5. Execute message delivery through selected channel
      const deliveryResult = await this.executeMessageDelivery(
        unifiedMessage,
        routingDecision,
        context
      );

      // 6. Update conversation state and journey
      await this.updateConversationAfterMessage(
        conversation.conversationId,
        routingDecision.primaryChannel,
        deliveryResult.success
      );

      // 7. Track customer journey progression
      await this.journeyTracker.trackMessageEvent({
        conversationId: conversation.conversationId,
        customerId: request.customerId,
        channel: routingDecision.primaryChannel,
        messageType: request.messageType || 'text',
        success: deliveryResult.success
      });

      return {
        success: deliveryResult.success,
        conversationId: conversation.conversationId,
        messageId: unifiedMessage.messageId,
        channel: routingDecision.primaryChannel,
        routeId: routingDecision.routeId,
        error: deliveryResult.error
      };

    } catch (error) {
      console.error('Conversation orchestration error:', error);
      return {
        success: false,
        conversationId: '',
        messageId: '',
        channel: '',
        routeId: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Handle incoming message from any channel
   */
  async handleIncomingMessage(data: {
    projectId: string;
    channel: string;
    fromIdentifier: string;
    toIdentifier: string;
    content: any;
    messageType: string;
    externalId?: string;
    timestamp?: Date;
  }): Promise<{
    success: boolean;
    conversationId: string;
    messageId: string;
  }> {
    try {
      // 1. Get or create conversation for incoming message
      const conversation = await this.conversationManager.getOrCreateConversation({
        projectId: data.projectId,
        customerId: data.fromIdentifier,
        category: 'inbound'
      });

      // 2. Create unified message for incoming message
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await prisma.unifiedMessage.create({
        data: {
          messageId,
          conversationId: conversation.conversationId,
          projectId: data.projectId,
          channel: data.channel,
          externalId: data.externalId,
          fromId: data.fromIdentifier,
          fromType: 'customer',
          fromIdentifier: data.fromIdentifier,
          toId: 'system',
          toType: 'system',
          toIdentifier: data.toIdentifier,
          messageType: data.messageType,
          content: data.content,
          status: 'delivered',
          deliveredAt: data.timestamp || new Date()
        }
      });

      // 3. Update conversation activity
      await this.updateConversationAfterMessage(
        conversation.conversationId,
        data.channel,
        true
      );

      // 4. Analyze message for intent and sentiment
      await this.analyzeIncomingMessage(messageId, data.content);

      // 5. Track customer journey
      await this.journeyTracker.trackMessageEvent({
        conversationId: conversation.conversationId,
        customerId: data.fromIdentifier,
        channel: data.channel,
        messageType: data.messageType,
        success: true,
        direction: 'inbound'
      });

      return {
        success: true,
        conversationId: conversation.conversationId,
        messageId
      };

    } catch (error) {
      console.error('Incoming message handling error:', error);
      return {
        success: false,
        conversationId: '',
        messageId: ''
      };
    }
  }

  /**
   * Build comprehensive conversation context
   */
  private async buildConversationContext(conversationId: string): Promise<ConversationContext> {
    const conversation = await prisma.conversation.findUnique({
      where: { conversationId },
      include: {
        participants: true,
        states: {
          where: { validTo: null },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Get customer preferences
    const preferences = await prisma.channelPreference.findFirst({
      where: {
        projectId: conversation.projectId,
        customerId: conversation.customerId
      }
    });

    return {
      conversationId: conversation.conversationId,
      customerId: conversation.customerId,
      customerData: conversation.states[0]?.customerData || {},
      preferences: preferences || {},
      journeyStage: conversation.journeyStage || 'awareness',
      lastChannel: conversation.lastChannel || '',
      channelHistory: conversation.channelHistory as any[] || [],
      activeChannels: conversation.activeChannels
    };
  }

  /**
   * Execute message delivery through the selected channel
   */
  private async executeMessageDelivery(
    message: any,
    routingDecision: any,
    context: ConversationContext
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // This would integrate with actual channel providers
      // For now, we'll simulate the delivery process
      
      switch (routingDecision.primaryChannel) {
        case 'sms':
          return await this.deliverSMS(message, routingDecision);
        case 'whatsapp':
          return await this.deliverWhatsApp(message, routingDecision);
        case 'email':
          return await this.deliverEmail(message, routingDecision);
        case 'voice':
          return await this.deliverVoice(message, routingDecision);
        default:
          throw new Error(`Unsupported channel: ${routingDecision.primaryChannel}`);
      }
    } catch (error) {
      // If primary channel fails, attempt fallback
      if (routingDecision.fallbackChannels.length > 0) {
        return await this.attemptFallbackDelivery(message, routingDecision, context);
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delivery failed'
      };
    }
  }

  /**
   * Attempt delivery through fallback channels
   */
  private async attemptFallbackDelivery(
    message: any,
    routingDecision: any,
    context: ConversationContext
  ): Promise<{ success: boolean; error?: string }> {
    for (let i = 0; i < routingDecision.fallbackChannels.length; i++) {
      const fallbackChannel = routingDecision.fallbackChannels[i];
      
      try {
        // Update message with fallback information
        await prisma.unifiedMessage.update({
          where: { id: message.id },
          data: {
            channel: fallbackChannel,
            fallbackLevel: i + 1,
            routingReason: `Fallback to ${fallbackChannel} after ${routingDecision.primaryChannel} failed`
          }
        });

        // Attempt delivery through fallback channel
        const result = await this.deliverThroughChannel(message, fallbackChannel, routingDecision);
        
        if (result.success) {
          // Update route with successful fallback
          await prisma.messageRoute.update({
            where: { id: routingDecision.routeId },
            data: {
              successfulChannel: fallbackChannel,
              totalAttempts: i + 2,
              completedAt: new Date()
            }
          });
          
          return result;
        }
      } catch (error) {
        console.error(`Fallback delivery failed for ${fallbackChannel}:`, error);
        continue;
      }
    }

    return {
      success: false,
      error: 'All delivery channels failed'
    };
  }

  /**
   * Deliver message through specific channel
   */
  private async deliverThroughChannel(
    message: any,
    channel: string,
    routingDecision: any
  ): Promise<{ success: boolean; error?: string }> {
    switch (channel) {
      case 'sms':
        return await this.deliverSMS(message, routingDecision);
      case 'whatsapp':
        return await this.deliverWhatsApp(message, routingDecision);
      case 'email':
        return await this.deliverEmail(message, routingDecision);
      case 'voice':
        return await this.deliverVoice(message, routingDecision);
      default:
        return { success: false, error: `Unsupported channel: ${channel}` };
    }
  }

  /**
   * SMS delivery implementation
   */
  private async deliverSMS(message: any, routingDecision: any): Promise<{ success: boolean; error?: string }> {
    // Integrate with existing SMS service
    // This would call the actual SMS API
    console.log(`Delivering SMS message ${message.messageId} via ${routingDecision.provider}`);
    
    // Simulate delivery
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Update message status
    await prisma.unifiedMessage.update({
      where: { id: message.id },
      data: {
        status: 'sent',
        sentAt: new Date()
      }
    });

    return { success: true };
  }

  /**
   * WhatsApp delivery implementation
   */
  private async deliverWhatsApp(message: any, routingDecision: any): Promise<{ success: boolean; error?: string }> {
    // Integrate with existing WhatsApp service
    console.log(`Delivering WhatsApp message ${message.messageId} via ${routingDecision.provider}`);
    
    // Simulate delivery
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await prisma.unifiedMessage.update({
      where: { id: message.id },
      data: {
        status: 'sent',
        sentAt: new Date()
      }
    });

    return { success: true };
  }

  /**
   * Email delivery implementation
   */
  private async deliverEmail(message: any, routingDecision: any): Promise<{ success: boolean; error?: string }> {
    // Integrate with email service
    console.log(`Delivering Email message ${message.messageId} via ${routingDecision.provider}`);
    
    // Simulate delivery
    await new Promise(resolve => setTimeout(resolve, 150));
    
    await prisma.unifiedMessage.update({
      where: { id: message.id },
      data: {
        status: 'sent',
        sentAt: new Date()
      }
    });

    return { success: true };
  }

  /**
   * Voice delivery implementation
   */
  private async deliverVoice(message: any, routingDecision: any): Promise<{ success: boolean; error?: string }> {
    // Integrate with voice service
    console.log(`Delivering Voice message ${message.messageId} via ${routingDecision.provider}`);
    
    // Simulate delivery
    await new Promise(resolve => setTimeout(resolve, 200));
    
    await prisma.unifiedMessage.update({
      where: { id: message.id },
      data: {
        status: 'sent',
        sentAt: new Date()
      }
    });

    return { success: true };
  }

  /**
   * Update conversation after message activity
   */
  private async updateConversationAfterMessage(
    conversationId: string,
    channel: string,
    success: boolean
  ): Promise<void> {
    const conversation = await prisma.conversation.findUnique({
      where: { conversationId }
    });

    if (!conversation) return;

    // Update channel history
    const channelHistory = conversation.channelHistory as any[] || [];
    channelHistory.push({
      channel,
      timestamp: new Date(),
      success
    });

    // Update active channels
    const activeChannels = conversation.activeChannels || [];
    if (!activeChannels.includes(channel)) {
      activeChannels.push(channel);
    }

    await prisma.conversation.update({
      where: { conversationId },
      data: {
        lastChannel: channel,
        channelHistory,
        activeChannels,
        lastActivity: new Date(),
        updatedAt: new Date()
      }
    });
  }

  /**
   * Analyze incoming message for intent and sentiment
   */
  private async analyzeIncomingMessage(messageId: string, content: any): Promise<void> {
    // Basic intent detection (can be enhanced with AI/ML)
    let intent = 'general';
    let sentiment = 'neutral';
    let urgency = 'normal';

    if (typeof content === 'string') {
      const text = content.toLowerCase();
      
      // Simple intent detection
      if (text.includes('help') || text.includes('support')) {
        intent = 'support';
      } else if (text.includes('buy') || text.includes('purchase')) {
        intent = 'sales';
      } else if (text.includes('cancel') || text.includes('stop')) {
        intent = 'cancellation';
      }

      // Simple sentiment analysis
      if (text.includes('angry') || text.includes('frustrated') || text.includes('terrible')) {
        sentiment = 'negative';
        urgency = 'high';
      } else if (text.includes('happy') || text.includes('great') || text.includes('excellent')) {
        sentiment = 'positive';
      }

      // Urgency detection
      if (text.includes('urgent') || text.includes('emergency') || text.includes('asap')) {
        urgency = 'urgent';
      }
    }

    await prisma.unifiedMessage.update({
      where: { messageId },
      data: {
        intent,
        sentiment,
        urgency
      }
    });
  }
}

export default ConversationOrchestrator;
