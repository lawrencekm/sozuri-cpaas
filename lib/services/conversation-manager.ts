import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateConversationRequest {
  projectId: string;
  customerId: string;
  category?: string;
  priority?: string;
  assignedAgent?: string;
  initialChannel?: string;
  context?: any;
}

export interface ConversationUpdate {
  status?: string;
  priority?: string;
  assignedAgent?: string;
  tags?: string[];
  journeyStage?: string;
  metadata?: any;
}

export class ConversationManager {
  /**
   * Get or create a conversation for a customer
   */
  async getOrCreateConversation(request: CreateConversationRequest) {
    // First, try to find an existing active conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        projectId: request.projectId,
        customerId: request.customerId,
        status: { in: ['active', 'paused'] }
      },
      include: {
        participants: true,
        states: {
          where: { validTo: null },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (conversation) {
      return conversation;
    }

    // Create new conversation if none exists
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    conversation = await prisma.conversation.create({
      data: {
        conversationId,
        projectId: request.projectId,
        customerId: request.customerId,
        customerName: await this.getCustomerName(request.projectId, request.customerId),
        assignedAgent: request.assignedAgent,
        primaryChannel: request.initialChannel || 'sms',
        activeChannels: request.initialChannel ? [request.initialChannel] : [],
        status: 'active',
        priority: request.priority || 'normal',
        category: request.category || 'general',
        journeyStage: 'awareness',
        metadata: request.context || {}
      },
      include: {
        participants: true,
        states: true
      }
    });

    // Create initial conversation state
    await this.createConversationState(conversationId, {
      state: 'active',
      context: request.context || {},
      customerData: await this.getCustomerData(request.projectId, request.customerId)
    });

    // Add customer as participant
    await this.addParticipant(conversationId, {
      participantId: request.customerId,
      participantType: 'customer',
      phoneNumber: this.isPhoneNumber(request.customerId) ? request.customerId : undefined,
      email: this.isEmail(request.customerId) ? request.customerId : undefined
    });

    return conversation;
  }

  /**
   * Update conversation details
   */
  async updateConversation(conversationId: string, updates: ConversationUpdate) {
    return await prisma.conversation.update({
      where: { conversationId },
      data: {
        ...updates,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Add participant to conversation
   */
  async addParticipant(conversationId: string, participant: {
    participantId: string;
    participantType: string;
    role?: string;
    phoneNumber?: string;
    email?: string;
    name?: string;
    preferredChannels?: string[];
  }) {
    return await prisma.conversationParticipant.create({
      data: {
        conversationId,
        participantId: participant.participantId,
        participantType: participant.participantType,
        role: participant.role || 'participant',
        phoneNumber: participant.phoneNumber,
        email: participant.email,
        name: participant.name,
        preferredChannels: participant.preferredChannels || [],
        blockedChannels: []
      }
    });
  }

  /**
   * Create conversation state snapshot
   */
  async createConversationState(conversationId: string, state: {
    state: string;
    subState?: string;
    reason?: string;
    context?: any;
    customerData?: any;
    agentNotes?: string;
    workflowStage?: string;
    nextActions?: string[];
  }) {
    // Mark previous state as expired
    await prisma.conversationState.updateMany({
      where: {
        conversationId,
        validTo: null
      },
      data: {
        validTo: new Date()
      }
    });

    // Create new state
    return await prisma.conversationState.create({
      data: {
        conversationId,
        state: state.state,
        subState: state.subState,
        reason: state.reason,
        context: state.context || {},
        customerData: state.customerData || {},
        agentNotes: state.agentNotes,
        workflowStage: state.workflowStage,
        nextActions: state.nextActions || []
      }
    });
  }

  /**
   * Get conversation with full context
   */
  async getConversationWithContext(conversationId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { conversationId },
      include: {
        participants: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 50
        },
        routes: {
          orderBy: { routedAt: 'desc' },
          take: 10
        },
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

    // Calculate conversation metrics
    const metrics = await this.calculateConversationMetrics(conversationId);

    return {
      ...conversation,
      preferences,
      metrics,
      currentState: conversation.states[0] || null
    };
  }

  /**
   * Archive conversation
   */
  async archiveConversation(conversationId: string, reason?: string) {
    // Update conversation status
    await prisma.conversation.update({
      where: { conversationId },
      data: {
        status: 'closed',
        isArchived: true,
        archivedAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Create final state
    await this.createConversationState(conversationId, {
      state: 'closed',
      reason: reason || 'Conversation archived',
      context: { archivedAt: new Date() }
    });
  }

  /**
   * Transfer conversation to another agent
   */
  async transferConversation(conversationId: string, newAgentId: string, reason?: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { conversationId }
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Update conversation
    await prisma.conversation.update({
      where: { conversationId },
      data: {
        assignedAgent: newAgentId,
        updatedAt: new Date()
      }
    });

    // Add new agent as participant
    await this.addParticipant(conversationId, {
      participantId: newAgentId,
      participantType: 'agent',
      role: 'moderator'
    });

    // Create state change
    await this.createConversationState(conversationId, {
      state: 'transferred',
      reason: reason || 'Conversation transferred',
      context: {
        previousAgent: conversation.assignedAgent,
        newAgent: newAgentId,
        transferredAt: new Date()
      }
    });
  }

  /**
   * Escalate conversation
   */
  async escalateConversation(conversationId: string, escalationLevel: string, reason: string) {
    await prisma.conversation.update({
      where: { conversationId },
      data: {
        status: 'escalated',
        priority: 'urgent',
        updatedAt: new Date()
      }
    });

    await this.createConversationState(conversationId, {
      state: 'escalated',
      subState: escalationLevel,
      reason,
      context: {
        escalatedAt: new Date(),
        escalationLevel
      }
    });
  }

  /**
   * Merge conversations (when duplicate conversations are detected)
   */
  async mergeConversations(primaryConversationId: string, secondaryConversationId: string) {
    const primaryConv = await prisma.conversation.findUnique({
      where: { conversationId: primaryConversationId }
    });

    const secondaryConv = await prisma.conversation.findUnique({
      where: { conversationId: secondaryConversationId }
    });

    if (!primaryConv || !secondaryConv) {
      throw new Error('One or both conversations not found');
    }

    // Move all messages from secondary to primary
    await prisma.unifiedMessage.updateMany({
      where: { conversationId: secondaryConversationId },
      data: { conversationId: primaryConversationId }
    });

    // Move all participants from secondary to primary (avoid duplicates)
    const secondaryParticipants = await prisma.conversationParticipant.findMany({
      where: { conversationId: secondaryConversationId }
    });

    for (const participant of secondaryParticipants) {
      const existingParticipant = await prisma.conversationParticipant.findFirst({
        where: {
          conversationId: primaryConversationId,
          participantId: participant.participantId
        }
      });

      if (!existingParticipant) {
        await prisma.conversationParticipant.create({
          data: {
            conversationId: primaryConversationId,
            participantId: participant.participantId,
            participantType: participant.participantType,
            role: participant.role,
            phoneNumber: participant.phoneNumber,
            email: participant.email,
            name: participant.name,
            preferredChannels: participant.preferredChannels,
            blockedChannels: participant.blockedChannels
          }
        });
      }
    }

    // Archive secondary conversation
    await this.archiveConversation(secondaryConversationId, 'Merged into primary conversation');

    // Update primary conversation with merged data
    const mergedChannels = Array.from(new Set([
      ...primaryConv.activeChannels,
      ...secondaryConv.activeChannels
    ]));

    await prisma.conversation.update({
      where: { conversationId: primaryConversationId },
      data: {
        activeChannels: mergedChannels,
        lastActivity: new Date(),
        updatedAt: new Date()
      }
    });

    // Create merge state
    await this.createConversationState(primaryConversationId, {
      state: 'merged',
      reason: 'Conversations merged',
      context: {
        mergedConversationId: secondaryConversationId,
        mergedAt: new Date()
      }
    });
  }

  /**
   * Calculate conversation metrics
   */
  private async calculateConversationMetrics(conversationId: string) {
    const messages = await prisma.unifiedMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }
    });

    const totalMessages = messages.length;
    const customerMessages = messages.filter(m => m.fromType === 'customer').length;
    const agentMessages = messages.filter(m => m.fromType === 'agent').length;
    const systemMessages = messages.filter(m => m.fromType === 'system').length;

    // Calculate response times
    const responseTimes = [];
    for (let i = 1; i < messages.length; i++) {
      const prev = messages[i - 1];
      const curr = messages[i];
      
      if (prev.fromType === 'customer' && curr.fromType === 'agent') {
        const responseTime = curr.createdAt.getTime() - prev.createdAt.getTime();
        responseTimes.push(responseTime);
      }
    }

    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0;

    // Channel distribution
    const channelDistribution = messages.reduce((acc, msg) => {
      acc[msg.channel] = (acc[msg.channel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMessages,
      customerMessages,
      agentMessages,
      systemMessages,
      avgResponseTime: Math.round(avgResponseTime / 1000), // Convert to seconds
      channelDistribution,
      conversationDuration: totalMessages > 0 
        ? messages[messages.length - 1].createdAt.getTime() - messages[0].createdAt.getTime()
        : 0
    };
  }

  /**
   * Get customer name from contacts or user records
   */
  private async getCustomerName(projectId: string, customerId: string): Promise<string | null> {
    // Try to find in contacts first
    const contact = await prisma.contact.findFirst({
      where: {
        projectId,
        OR: [
          { mobile: customerId },
          { email: customerId }
        ]
      }
    });

    if (contact) {
      return contact.fullName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || null;
    }

    // Try to find in users
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { mobile: customerId },
          { email: customerId }
        ]
      }
    });

    if (user) {
      return user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || null;
    }

    return null;
  }

  /**
   * Get customer data for context
   */
  private async getCustomerData(projectId: string, customerId: string): Promise<any> {
    const contact = await prisma.contact.findFirst({
      where: {
        projectId,
        OR: [
          { mobile: customerId },
          { email: customerId }
        ]
      }
    });

    if (contact) {
      return {
        name: contact.fullName,
        firstName: contact.firstName,
        lastName: contact.lastName,
        mobile: contact.mobile,
        email: contact.email,
        company: contact.company,
        jobTitle: contact.jobTitle,
        city: contact.city,
        country: contact.country,
        timezone: contact.timezone,
        preferredLanguage: contact.preferredLanguage,
        customFields: contact.customFields,
        tags: contact.tags
      };
    }

    return {};
  }

  /**
   * Check if string is a phone number
   */
  private isPhoneNumber(str: string): boolean {
    return /^\+?[1-9]\d{1,14}$/.test(str.replace(/\s+/g, ''));
  }

  /**
   * Check if string is an email
   */
  private isEmail(str: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  }

  /**
   * Search conversations
   */
  async searchConversations(projectId: string, filters: {
    customerId?: string;
    status?: string;
    priority?: string;
    category?: string;
    assignedAgent?: string;
    channel?: string;
    dateFrom?: Date;
    dateTo?: Date;
    tags?: string[];
    limit?: number;
    offset?: number;
  }) {
    const where: any = { projectId };

    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.category) where.category = filters.category;
    if (filters.assignedAgent) where.assignedAgent = filters.assignedAgent;
    if (filters.channel) where.activeChannels = { has: filters.channel };
    if (filters.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags };
    }
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        participants: {
          where: { participantType: 'customer' },
          take: 1
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { lastActivity: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0
    });

    const total = await prisma.conversation.count({ where });

    return {
      conversations,
      total,
      hasMore: (filters.offset || 0) + conversations.length < total
    };
  }
}

export default ConversationManager;
