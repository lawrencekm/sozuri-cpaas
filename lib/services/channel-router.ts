import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface RoutingRequest {
  projectId: string;
  customerId: string;
  preferredChannel?: string;
  fallbackChannels?: string[];
  messageType: string;
  priority: string;
  context: any;
}

export interface RoutingDecision {
  routeId: string;
  primaryChannel: string;
  fallbackChannels: string[];
  provider: string;
  fromIdentifier: string;
  reason: string;
  confidence: number;
  decisionFactors: any;
}

export interface ChannelAvailability {
  channel: string;
  available: boolean;
  provider?: string;
  cost?: number;
  reliability?: number;
  responseTime?: number;
  lastFailure?: Date;
  reason?: string;
}

export class ChannelRouter {
  private readonly CHANNEL_PRIORITIES = {
    urgent: ['whatsapp', 'sms', 'voice', 'email'],
    high: ['whatsapp', 'sms', 'email', 'voice'],
    normal: ['sms', 'whatsapp', 'email', 'voice'],
    low: ['email', 'sms', 'whatsapp', 'voice']
  };

  private readonly CHANNEL_COSTS = {
    sms: 0.05,
    whatsapp: 0.03,
    email: 0.01,
    voice: 0.15
  };

  private readonly CHANNEL_RELIABILITY = {
    sms: 0.95,
    whatsapp: 0.92,
    email: 0.98,
    voice: 0.85
  };

  /**
   * Determine the optimal routing for a message
   */
  async determineOptimalRoute(request: RoutingRequest): Promise<RoutingDecision> {
    // 1. Get customer preferences
    const customerPrefs = await this.getCustomerPreferences(request.projectId, request.customerId);
    
    // 2. Check channel availability
    const channelAvailability = await this.checkChannelAvailability(request.projectId);
    
    // 3. Analyze message requirements
    const messageRequirements = this.analyzeMessageRequirements(request);
    
    // 4. Calculate channel scores
    const channelScores = await this.calculateChannelScores({
      request,
      customerPrefs,
      channelAvailability,
      messageRequirements
    });
    
    // 5. Select primary and fallback channels
    const selectedChannels = this.selectChannels(channelScores, request);
    
    // 6. Create routing record
    const routeId = await this.createRoutingRecord({
      request,
      selectedChannels,
      channelScores,
      channelAvailability
    });

    return {
      routeId,
      primaryChannel: selectedChannels.primary.channel,
      fallbackChannels: selectedChannels.fallbacks.map(f => f.channel),
      provider: selectedChannels.primary.provider || 'default',
      fromIdentifier: await this.getFromIdentifier(selectedChannels.primary.channel, request.projectId),
      reason: selectedChannels.primary.reason,
      confidence: selectedChannels.primary.score,
      decisionFactors: {
        customerPreference: customerPrefs?.preferredChannels || [],
        availability: channelAvailability,
        priority: request.priority,
        messageType: request.messageType,
        scores: channelScores
      }
    };
  }

  /**
   * Get customer channel preferences
   */
  private async getCustomerPreferences(projectId: string, customerId: string) {
    return await prisma.channelPreference.findFirst({
      where: {
        projectId,
        customerId,
        isActive: true
      }
    });
  }

  /**
   * Check availability of all channels
   */
  private async checkChannelAvailability(projectId: string): Promise<ChannelAvailability[]> {
    const availability: ChannelAvailability[] = [];

    // Check SMS availability
    const smsConfig = await this.checkSMSAvailability(projectId);
    availability.push(smsConfig);

    // Check WhatsApp availability
    const whatsappConfig = await this.checkWhatsAppAvailability(projectId);
    availability.push(whatsappConfig);

    // Check Email availability
    const emailConfig = await this.checkEmailAvailability(projectId);
    availability.push(emailConfig);

    // Check Voice availability
    const voiceConfig = await this.checkVoiceAvailability(projectId);
    availability.push(voiceConfig);

    return availability;
  }

  /**
   * Check SMS channel availability
   */
  private async checkSMSAvailability(projectId: string): Promise<ChannelAvailability> {
    try {
      // Check if project has SMS credits and active sender IDs
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          alphanumerics: {
            where: { isActive: true, status: 'approved' },
            take: 1
          }
        }
      });

      const hasCredits = project && project.smsCredits.toNumber() > 0;
      const hasSenderId = project && project.alphanumerics.length > 0;

      return {
        channel: 'sms',
        available: Boolean(hasCredits && hasSenderId),
        provider: 'safaricom', // Default provider
        cost: this.CHANNEL_COSTS.sms,
        reliability: this.CHANNEL_RELIABILITY.sms,
        responseTime: 5000, // 5 seconds average
        reason: !hasCredits ? 'Insufficient credits' : !hasSenderId ? 'No approved sender ID' : undefined
      };
    } catch (error) {
      return {
        channel: 'sms',
        available: false,
        reason: 'Configuration error'
      };
    }
  }

  /**
   * Check WhatsApp channel availability
   */
  private async checkWhatsAppAvailability(projectId: string): Promise<ChannelAvailability> {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          whatsappAccounts: {
            where: { isActive: true, status: 'approved' },
            include: {
              phoneNumbers: {
                where: { isActive: true, isVerified: true },
                take: 1
              }
            },
            take: 1
          }
        }
      });

      const hasCredits = project && project.whatsappCredits.toNumber() > 0;
      const hasAccount = project && project.whatsappAccounts.length > 0;
      const hasPhoneNumber = hasAccount && project.whatsappAccounts[0].phoneNumbers.length > 0;

      return {
        channel: 'whatsapp',
        available: Boolean(hasCredits && hasAccount && hasPhoneNumber),
        provider: 'meta',
        cost: this.CHANNEL_COSTS.whatsapp,
        reliability: this.CHANNEL_RELIABILITY.whatsapp,
        responseTime: 3000, // 3 seconds average
        reason: !hasCredits ? 'Insufficient credits' : 
                !hasAccount ? 'No WhatsApp account' : 
                !hasPhoneNumber ? 'No verified phone number' : undefined
      };
    } catch (error) {
      return {
        channel: 'whatsapp',
        available: false,
        reason: 'Configuration error'
      };
    }
  }

  /**
   * Check Email channel availability
   */
  private async checkEmailAvailability(projectId: string): Promise<ChannelAvailability> {
    // For now, assume email is always available (implement actual email config check)
    return {
      channel: 'email',
      available: true,
      provider: 'smtp',
      cost: this.CHANNEL_COSTS.email,
      reliability: this.CHANNEL_RELIABILITY.email,
      responseTime: 10000, // 10 seconds average
    };
  }

  /**
   * Check Voice channel availability
   */
  private async checkVoiceAvailability(projectId: string): Promise<ChannelAvailability> {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId }
      });

      const hasCredits = project && project.voiceCredits.toNumber() > 0;

      return {
        channel: 'voice',
        available: Boolean(hasCredits),
        provider: 'twilio',
        cost: this.CHANNEL_COSTS.voice,
        reliability: this.CHANNEL_RELIABILITY.voice,
        responseTime: 15000, // 15 seconds average
        reason: !hasCredits ? 'Insufficient voice credits' : undefined
      };
    } catch (error) {
      return {
        channel: 'voice',
        available: false,
        reason: 'Configuration error'
      };
    }
  }

  /**
   * Analyze message requirements
   */
  private analyzeMessageRequirements(request: RoutingRequest) {
    const requirements = {
      supportsMedia: false,
      requiresRichContent: false,
      requiresInteractivity: false,
      maxLength: Infinity,
      urgency: request.priority
    };

    // Analyze based on message type
    switch (request.messageType) {
      case 'text':
        requirements.maxLength = 1600; // SMS limit
        break;
      case 'image':
      case 'video':
      case 'audio':
      case 'document':
        requirements.supportsMedia = true;
        break;
      case 'template':
        requirements.requiresRichContent = true;
        break;
      case 'interactive':
        requirements.requiresInteractivity = true;
        break;
    }

    return requirements;
  }

  /**
   * Calculate scores for each available channel
   */
  private async calculateChannelScores(params: {
    request: RoutingRequest;
    customerPrefs: any;
    channelAvailability: ChannelAvailability[];
    messageRequirements: any;
  }): Promise<Array<{ channel: string; score: number; reason: string; provider?: string }>> {
    const scores = [];

    for (const availability of params.channelAvailability) {
      if (!availability.available) {
        scores.push({
          channel: availability.channel,
          score: 0,
          reason: `Channel unavailable: ${availability.reason}`,
          provider: availability.provider
        });
        continue;
      }

      let score = 0;
      const factors = [];

      // 1. Customer preference score (40% weight)
      const customerPreferredChannels = params.customerPrefs?.preferredChannels || [];
      const preferenceIndex = customerPreferredChannels.indexOf(availability.channel);
      if (preferenceIndex >= 0) {
        const preferenceScore = (customerPreferredChannels.length - preferenceIndex) / customerPreferredChannels.length;
        score += preferenceScore * 0.4;
        factors.push(`Customer preference: ${preferenceScore.toFixed(2)}`);
      }

      // 2. Channel capability score (25% weight)
      let capabilityScore = 0;
      if (params.messageRequirements.supportsMedia) {
        capabilityScore = ['whatsapp', 'email'].includes(availability.channel) ? 1 : 0;
      } else if (params.messageRequirements.requiresInteractivity) {
        capabilityScore = ['whatsapp'].includes(availability.channel) ? 1 : 0;
      } else {
        capabilityScore = 1; // All channels support text
      }
      score += capabilityScore * 0.25;
      factors.push(`Capability: ${capabilityScore.toFixed(2)}`);

      // 3. Priority alignment score (20% weight)
      const priorityChannels = this.CHANNEL_PRIORITIES[params.request.priority as keyof typeof this.CHANNEL_PRIORITIES];
      const priorityIndex = priorityChannels.indexOf(availability.channel);
      const priorityScore = priorityIndex >= 0 ? (priorityChannels.length - priorityIndex) / priorityChannels.length : 0;
      score += priorityScore * 0.2;
      factors.push(`Priority alignment: ${priorityScore.toFixed(2)}`);

      // 4. Reliability score (10% weight)
      const reliabilityScore = availability.reliability || 0;
      score += reliabilityScore * 0.1;
      factors.push(`Reliability: ${reliabilityScore.toFixed(2)}`);

      // 5. Cost efficiency score (5% weight)
      const maxCost = Math.max(...Object.values(this.CHANNEL_COSTS));
      const costScore = 1 - ((availability.cost || 0) / maxCost);
      score += costScore * 0.05;
      factors.push(`Cost efficiency: ${costScore.toFixed(2)}`);

      scores.push({
        channel: availability.channel,
        score,
        reason: `Score: ${score.toFixed(3)} (${factors.join(', ')})`,
        provider: availability.provider
      });
    }

    return scores.sort((a, b) => b.score - a.score);
  }

  /**
   * Select primary and fallback channels
   */
  private selectChannels(channelScores: Array<{ channel: string; score: number; reason: string; provider?: string }>, request: RoutingRequest) {
    // Filter out channels with zero scores
    const availableChannels = channelScores.filter(c => c.score > 0);

    if (availableChannels.length === 0) {
      throw new Error('No available channels for message delivery');
    }

    // Primary channel is the highest scoring
    const primary = availableChannels[0];

    // Fallback channels are the rest, up to 3 alternatives
    const fallbacks = availableChannels.slice(1, 4);

    // If user specified preferred channel and it's available, prioritize it
    if (request.preferredChannel) {
      const preferredChannel = availableChannels.find(c => c.channel === request.preferredChannel);
      if (preferredChannel) {
        return {
          primary: preferredChannel,
          fallbacks: availableChannels.filter(c => c.channel !== request.preferredChannel).slice(0, 3)
        };
      }
    }

    return { primary, fallbacks };
  }

  /**
   * Create routing record in database
   */
  private async createRoutingRecord(params: {
    request: RoutingRequest;
    selectedChannels: any;
    channelScores: any[];
    channelAvailability: ChannelAvailability[];
  }): Promise<string> {
    const routeId = `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get or create conversation first
    let conversation = await prisma.conversation.findFirst({
      where: {
        projectId: params.request.projectId,
        customerId: params.request.customerId,
        status: { in: ['active', 'paused'] }
      }
    });

    if (!conversation) {
      const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      conversation = await prisma.conversation.create({
        data: {
          conversationId,
          projectId: params.request.projectId,
          customerId: params.request.customerId,
          primaryChannel: params.selectedChannels.primary.channel,
          activeChannels: [params.selectedChannels.primary.channel],
          status: 'active',
          priority: params.request.priority,
          category: 'outbound'
        }
      });
    }

    await prisma.messageRoute.create({
      data: {
        routeId,
        conversationId: conversation.conversationId,
        projectId: params.request.projectId,
        primaryChannel: params.selectedChannels.primary.channel,
        fallbackChannels: params.selectedChannels.fallbacks.map((f: any) => f.channel),
        routingStrategy: 'intelligent',
        decisionFactors: JSON.parse(JSON.stringify({
          scores: params.channelScores,
          availability: params.channelAvailability,
          selectedReason: params.selectedChannels.primary.reason
        })),
        channelStatus: params.channelAvailability.reduce((acc, ch) => {
          acc[ch.channel] = {
            available: ch.available,
            reason: ch.reason,
            cost: ch.cost,
            reliability: ch.reliability
          };
          return acc;
        }, {} as any)
      }
    });

    return routeId;
  }

  /**
   * Get appropriate sender identifier for channel
   */
  private async getFromIdentifier(channel: string, projectId: string): Promise<string> {
    switch (channel) {
      case 'sms':
        const alphanumeric = await prisma.alphanumeric.findFirst({
          where: {
            projectId,
            isActive: true,
            status: 'approved'
          }
        });
        return alphanumeric?.senderId || 'SOZURI';

      case 'whatsapp':
        const whatsappAccount = await prisma.whatsappAccount.findFirst({
          where: {
            projectId,
            isActive: true,
            status: 'approved'
          },
          include: {
            phoneNumbers: {
              where: { isActive: true, isVerified: true },
              take: 1
            }
          }
        });
        return whatsappAccount?.phoneNumbers[0]?.phoneNumber || '';

      case 'email':
        const project = await prisma.project.findUnique({
          where: { id: projectId }
        });
        return `noreply@${project?.name?.toLowerCase().replace(/\s+/g, '-') || 'sozuri'}.com`;

      case 'voice':
        return '+254700000000'; // Default voice number

      default:
        return 'SOZURI';
    }
  }

  /**
   * Update channel performance metrics
   */
  async updateChannelMetrics(params: {
    projectId: string;
    customerId: string;
    channel: string;
    success: boolean;
    responseTime?: number;
    cost?: number;
  }): Promise<void> {
    // Update customer preferences based on successful interactions
    if (params.success) {
      await this.updateCustomerChannelPreference(params.projectId, params.customerId, params.channel);
    }

    // Log channel performance for future routing decisions
    // This could be stored in a separate metrics table
    console.log(`Channel performance update: ${params.channel} - Success: ${params.success}`);
  }

  /**
   * Update customer channel preferences based on successful interactions
   */
  private async updateCustomerChannelPreference(projectId: string, customerId: string, channel: string): Promise<void> {
    const existing = await prisma.channelPreference.findFirst({
      where: { projectId, customerId }
    });

    if (existing) {
      // Update response rates
      const responseRates = existing.responseRates as any || {};
      responseRates[channel] = (responseRates[channel] || 0) + 1;

      await prisma.channelPreference.update({
        where: { id: existing.id },
        data: {
          responseRates,
          lastChannelUsed: channel,
          engagementScore: (existing.engagementScore || 0) + 1,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new preference record
      await prisma.channelPreference.create({
        data: {
          projectId,
          customerId,
          customerType: 'phone', // Assume phone for now
          preferredChannels: [channel],
          blockedChannels: [],
          responseRates: { [channel]: 1 },
          engagementScore: 1,
          lastChannelUsed: channel
        }
      });
    }
  }
}

export default ChannelRouter;
