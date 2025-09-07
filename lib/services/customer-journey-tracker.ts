import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface JourneyEvent {
  conversationId: string;
  customerId: string;
  channel: string;
  messageType: string;
  success: boolean;
  direction?: 'inbound' | 'outbound';
  timestamp?: Date;
  metadata?: any;
}

export interface JourneyStage {
  stage: string;
  enteredAt: Date;
  exitedAt?: Date;
  duration?: number;
  channels: string[];
  messageCount: number;
  successRate: number;
}

export interface CustomerJourney {
  customerId: string;
  projectId: string;
  currentStage: string;
  stages: JourneyStage[];
  totalDuration: number;
  channelPreferences: Record<string, number>;
  engagementScore: number;
  conversionEvents: any[];
  touchpoints: any[];
}

export class CustomerJourneyTracker {
  private readonly JOURNEY_STAGES = [
    'awareness',      // Customer becomes aware of the business
    'interest',       // Customer shows interest (opens messages, responds)
    'consideration',  // Customer is considering (asks questions, requests info)
    'intent',         // Customer shows purchase intent
    'purchase',       // Customer makes a purchase
    'onboarding',     // Customer is being onboarded
    'engagement',     // Active customer engagement
    'support',        // Customer needs support
    'retention',      // Customer retention activities
    'advocacy'        // Customer becomes an advocate
  ];

  private readonly STAGE_TRIGGERS = {
    awareness: ['first_message', 'campaign_message'],
    interest: ['message_opened', 'link_clicked', 'response_received'],
    consideration: ['question_asked', 'info_requested', 'multiple_interactions'],
    intent: ['purchase_inquiry', 'pricing_request', 'demo_request'],
    purchase: ['payment_made', 'order_placed', 'subscription_started'],
    onboarding: ['welcome_message', 'setup_instructions', 'tutorial_started'],
    engagement: ['regular_usage', 'feature_adoption', 'positive_feedback'],
    support: ['help_request', 'issue_reported', 'complaint_filed'],
    retention: ['renewal_reminder', 'loyalty_program', 'special_offer'],
    advocacy: ['referral_made', 'review_left', 'testimonial_provided']
  };

  /**
   * Track a message event in the customer journey
   */
  async trackMessageEvent(event: JourneyEvent): Promise<void> {
    try {
      // Get or create customer journey
      const journey = await this.getOrCreateCustomerJourney(event.customerId, event.conversationId);

      // Analyze event for stage progression
      const stageProgression = await this.analyzeStageProgression(event, journey);

      // Update journey if stage changed
      if (stageProgression.stageChanged) {
        await this.updateJourneyStage(journey.customerId, stageProgression.newStage, event);
      }

      // Record touchpoint
      await this.recordTouchpoint(journey.customerId, event);

      // Update engagement metrics
      await this.updateEngagementMetrics(journey.customerId, event);

      // Check for conversion events
      await this.checkConversionEvents(journey.customerId, event);

    } catch (error) {
      console.error('Journey tracking error:', error);
    }
  }

  /**
   * Get or create customer journey record
   */
  private async getOrCreateCustomerJourney(customerId: string, conversationId: string): Promise<any> {
    const conversation = await prisma.conversation.findUnique({
      where: { conversationId }
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Check if journey already exists
    let journey = await this.getCustomerJourney(conversation.projectId, customerId);

    if (!journey) {
      // Create new journey starting at awareness stage
      journey = {
        customerId,
        projectId: conversation.projectId,
        currentStage: 'awareness',
        stages: [{
          stage: 'awareness',
          enteredAt: new Date(),
          channels: [],
          messageCount: 0,
          successRate: 0
        }],
        totalDuration: 0,
        channelPreferences: {},
        engagementScore: 0,
        conversionEvents: [],
        touchpoints: []
      };

      // Store in conversation metadata for now (could be separate table)
      await prisma.conversation.update({
        where: { conversationId },
        data: {
          journeyStage: 'awareness',
          metadata: {
            ...conversation.metadata as any,
            customerJourney: journey
          }
        }
      });
    }

    return journey;
  }

  /**
   * Get customer journey from conversation metadata
   */
  private async getCustomerJourney(projectId: string, customerId: string): Promise<any> {
    const conversation = await prisma.conversation.findFirst({
      where: {
        projectId,
        customerId,
        status: { in: ['active', 'paused'] }
      }
    });

    if (conversation?.metadata) {
      const metadata = conversation.metadata as any;
      return metadata.customerJourney || null;
    }

    return null;
  }

  /**
   * Analyze if the event should trigger stage progression
   */
  private async analyzeStageProgression(event: JourneyEvent, journey: any): Promise<{
    stageChanged: boolean;
    newStage?: string;
    reason?: string;
  }> {
    const currentStage = journey.currentStage;
    const currentStageIndex = this.JOURNEY_STAGES.indexOf(currentStage);

    // Analyze event characteristics
    const eventAnalysis = await this.analyzeEventCharacteristics(event);

    // Check for stage progression triggers
    for (let i = currentStageIndex + 1; i < this.JOURNEY_STAGES.length; i++) {
      const nextStage = this.JOURNEY_STAGES[i];
      const triggers = this.STAGE_TRIGGERS[nextStage as keyof typeof this.STAGE_TRIGGERS];

      for (const trigger of triggers) {
        if (this.eventMatchesTrigger(eventAnalysis, trigger)) {
          return {
            stageChanged: true,
            newStage: nextStage,
            reason: `Triggered by: ${trigger}`
          };
        }
      }
    }

    // Check for stage regression (e.g., support issues)
    if (eventAnalysis.isSupport && currentStage !== 'support') {
      return {
        stageChanged: true,
        newStage: 'support',
        reason: 'Support request detected'
      };
    }

    return { stageChanged: false };
  }

  /**
   * Analyze event characteristics for journey insights
   */
  private async analyzeEventCharacteristics(event: JourneyEvent): Promise<any> {
    const analysis = {
      isFirstInteraction: false,
      isResponse: event.direction === 'inbound',
      isQuestion: false,
      isPurchaseRelated: false,
      isSupport: false,
      sentiment: 'neutral',
      urgency: 'normal',
      hasMedia: false,
      messageLength: 0
    };

    // Get conversation history to determine if this is first interaction
    const messageCount = await prisma.unifiedMessage.count({
      where: { conversationId: event.conversationId }
    });
    analysis.isFirstInteraction = messageCount <= 1;

    // Analyze message content if available
    if (event.metadata?.content) {
      const content = typeof event.metadata.content === 'string' 
        ? event.metadata.content 
        : JSON.stringify(event.metadata.content);
      
      analysis.messageLength = content.length;
      analysis.hasMedia = event.messageType !== 'text';

      // Simple content analysis
      const lowerContent = content.toLowerCase();
      
      // Question detection
      analysis.isQuestion = lowerContent.includes('?') || 
                           lowerContent.includes('how') || 
                           lowerContent.includes('what') || 
                           lowerContent.includes('when') || 
                           lowerContent.includes('where') || 
                           lowerContent.includes('why');

      // Purchase intent detection
      analysis.isPurchaseRelated = lowerContent.includes('buy') ||
                                  lowerContent.includes('purchase') ||
                                  lowerContent.includes('price') ||
                                  lowerContent.includes('cost') ||
                                  lowerContent.includes('order') ||
                                  lowerContent.includes('payment');

      // Support detection
      analysis.isSupport = lowerContent.includes('help') ||
                          lowerContent.includes('support') ||
                          lowerContent.includes('problem') ||
                          lowerContent.includes('issue') ||
                          lowerContent.includes('error') ||
                          lowerContent.includes('broken');

      // Sentiment analysis (basic)
      if (lowerContent.includes('angry') || lowerContent.includes('frustrated') || lowerContent.includes('terrible')) {
        analysis.sentiment = 'negative';
        analysis.urgency = 'high';
      } else if (lowerContent.includes('happy') || lowerContent.includes('great') || lowerContent.includes('excellent')) {
        analysis.sentiment = 'positive';
      }

      // Urgency detection
      if (lowerContent.includes('urgent') || lowerContent.includes('emergency') || lowerContent.includes('asap')) {
        analysis.urgency = 'urgent';
      }
    }

    return analysis;
  }

  /**
   * Check if event matches a stage trigger
   */
  private eventMatchesTrigger(eventAnalysis: any, trigger: string): boolean {
    switch (trigger) {
      case 'first_message':
        return eventAnalysis.isFirstInteraction;
      case 'response_received':
        return eventAnalysis.isResponse;
      case 'question_asked':
        return eventAnalysis.isQuestion;
      case 'purchase_inquiry':
      case 'pricing_request':
        return eventAnalysis.isPurchaseRelated;
      case 'help_request':
      case 'issue_reported':
        return eventAnalysis.isSupport;
      case 'multiple_interactions':
        return !eventAnalysis.isFirstInteraction && eventAnalysis.isResponse;
      default:
        return false;
    }
  }

  /**
   * Update customer journey stage
   */
  private async updateJourneyStage(customerId: string, newStage: string, event: JourneyEvent): Promise<void> {
    const conversation = await prisma.conversation.findUnique({
      where: { conversationId: event.conversationId }
    });

    if (!conversation) return;

    const metadata = conversation.metadata as any || {};
    const journey = metadata.customerJourney || {};

    // Update current stage in journey
    const previousStage = journey.currentStage;
    journey.currentStage = newStage;

    // Close previous stage
    if (journey.stages && journey.stages.length > 0) {
      const lastStage = journey.stages[journey.stages.length - 1];
      if (!lastStage.exitedAt) {
        lastStage.exitedAt = new Date();
        lastStage.duration = lastStage.exitedAt.getTime() - lastStage.enteredAt.getTime();
      }
    }

    // Add new stage
    if (!journey.stages) journey.stages = [];
    journey.stages.push({
      stage: newStage,
      enteredAt: new Date(),
      channels: [event.channel],
      messageCount: 1,
      successRate: event.success ? 1 : 0
    });

    // Update conversation
    await prisma.conversation.update({
      where: { conversationId: event.conversationId },
      data: {
        journeyStage: newStage,
        metadata: {
          ...metadata,
          customerJourney: journey
        }
      }
    });

    console.log(`Customer ${customerId} progressed from ${previousStage} to ${newStage}`);
  }

  /**
   * Record touchpoint in customer journey
   */
  private async recordTouchpoint(customerId: string, event: JourneyEvent): Promise<void> {
    // This could be stored in a separate touchpoints table
    // For now, we'll log it for analytics
    console.log(`Touchpoint recorded: ${customerId} via ${event.channel} - ${event.messageType}`);
  }

  /**
   * Update engagement metrics
   */
  private async updateEngagementMetrics(customerId: string, event: JourneyEvent): Promise<void> {
    // Update channel preferences in customer preferences
    await this.updateChannelEngagement(customerId, event);

    // Update overall engagement score
    const conversation = await prisma.conversation.findUnique({
      where: { conversationId: event.conversationId }
    });

    if (conversation) {
      const metadata = conversation.metadata as any || {};
      const journey = metadata.customerJourney || {};

      // Simple engagement scoring
      let engagementDelta = 0;
      if (event.success) engagementDelta += 1;
      if (event.direction === 'inbound') engagementDelta += 2; // Customer initiated
      if (event.messageType !== 'text') engagementDelta += 1; // Rich content

      journey.engagementScore = (journey.engagementScore || 0) + engagementDelta;

      await prisma.conversation.update({
        where: { conversationId: event.conversationId },
        data: {
          metadata: {
            ...metadata,
            customerJourney: journey
          }
        }
      });
    }
  }

  /**
   * Update channel engagement preferences
   */
  private async updateChannelEngagement(customerId: string, event: JourneyEvent): Promise<void> {
    const conversation = await prisma.conversation.findUnique({
      where: { conversationId: event.conversationId }
    });

    if (!conversation) return;

    const channelPref = await prisma.channelPreference.findFirst({
      where: {
        projectId: conversation.projectId,
        customerId
      }
    });

    if (channelPref) {
      const responseRates = channelPref.responseRates as any || {};
      responseRates[event.channel] = (responseRates[event.channel] || 0) + (event.success ? 1 : 0);

      await prisma.channelPreference.update({
        where: { id: channelPref.id },
        data: {
          responseRates,
          lastChannelUsed: event.channel,
          engagementScore: (channelPref.engagementScore || 0) + (event.success ? 1 : 0)
        }
      });
    }
  }

  /**
   * Check for conversion events
   */
  private async checkConversionEvents(customerId: string, event: JourneyEvent): Promise<void> {
    // Analyze if this event represents a conversion
    const eventAnalysis = await this.analyzeEventCharacteristics(event);

    if (eventAnalysis.isPurchaseRelated && event.direction === 'inbound') {
      // Record potential conversion event
      console.log(`Potential conversion event detected for customer ${customerId}`);
      
      // This could trigger automated follow-up workflows
      await this.triggerConversionWorkflow(customerId, event);
    }
  }

  /**
   * Trigger conversion workflow
   */
  private async triggerConversionWorkflow(customerId: string, event: JourneyEvent): Promise<void> {
    // This would integrate with the automation system
    console.log(`Triggering conversion workflow for customer ${customerId}`);
    
    // Could create automated follow-up messages, assign to sales team, etc.
  }

  /**
   * Get customer journey analytics
   */
  async getCustomerJourneyAnalytics(projectId: string, customerId: string): Promise<CustomerJourney | null> {
    const conversation = await prisma.conversation.findFirst({
      where: {
        projectId,
        customerId,
        status: { in: ['active', 'paused', 'closed'] }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!conversation?.metadata) {
      return null;
    }

    const metadata = conversation.metadata as any;
    return metadata.customerJourney || null;
  }

  /**
   * Get journey analytics for multiple customers
   */
  async getJourneyAnalytics(projectId: string, filters?: {
    dateFrom?: Date;
    dateTo?: Date;
    stage?: string;
    channel?: string;
  }): Promise<{
    totalCustomers: number;
    stageDistribution: Record<string, number>;
    averageJourneyDuration: number;
    channelEffectiveness: Record<string, number>;
    conversionRate: number;
  }> {
    const conversations = await prisma.conversation.findMany({
      where: {
        projectId,
        ...(filters?.dateFrom && { createdAt: { gte: filters.dateFrom } }),
        ...(filters?.dateTo && { createdAt: { lte: filters.dateTo } }),
        ...(filters?.stage && { journeyStage: filters.stage })
      }
    });

    const analytics = {
      totalCustomers: conversations.length,
      stageDistribution: {} as Record<string, number>,
      averageJourneyDuration: 0,
      channelEffectiveness: {} as Record<string, number>,
      conversionRate: 0
    };

    let totalDuration = 0;
    let conversions = 0;

    for (const conv of conversations) {
      // Stage distribution
      const stage = conv.journeyStage || 'awareness';
      analytics.stageDistribution[stage] = (analytics.stageDistribution[stage] || 0) + 1;

      // Journey duration
      const duration = conv.updatedAt.getTime() - conv.createdAt.getTime();
      totalDuration += duration;

      // Channel effectiveness
      for (const channel of conv.activeChannels) {
        analytics.channelEffectiveness[channel] = (analytics.channelEffectiveness[channel] || 0) + 1;
      }

      // Conversion tracking
      if (['purchase', 'engagement', 'advocacy'].includes(stage)) {
        conversions++;
      }
    }

    analytics.averageJourneyDuration = conversations.length > 0 ? totalDuration / conversations.length : 0;
    analytics.conversionRate = conversations.length > 0 ? conversions / conversations.length : 0;

    return analytics;
  }

  /**
   * Predict next best action for customer
   */
  async predictNextBestAction(customerId: string, conversationId: string): Promise<{
    recommendedAction: string;
    recommendedChannel: string;
    confidence: number;
    reasoning: string;
  }> {
    const journey = await this.getCustomerJourneyAnalytics(
      (await prisma.conversation.findUnique({ where: { conversationId } }))?.projectId || '',
      customerId
    );

    if (!journey) {
      return {
        recommendedAction: 'send_welcome',
        recommendedChannel: 'sms',
        confidence: 0.5,
        reasoning: 'No journey data available, using default action'
      };
    }

    // Simple rule-based prediction (can be enhanced with ML)
    const currentStage = journey.currentStage;
    const channelPrefs = Object.keys(journey.channelPreferences)
      .sort((a, b) => journey.channelPreferences[b] - journey.channelPreferences[a]);

    let action = 'follow_up';
    let channel = channelPrefs[0] || 'sms';
    const confidence = 0.7;
    let reasoning = `Based on current stage: ${currentStage}`;

    switch (currentStage) {
      case 'awareness':
        action = 'send_educational_content';
        reasoning = 'Customer is in awareness stage, needs educational content';
        break;
      case 'interest':
        action = 'send_product_info';
        reasoning = 'Customer showed interest, provide product information';
        break;
      case 'consideration':
        action = 'offer_consultation';
        reasoning = 'Customer is considering, offer personalized consultation';
        break;
      case 'intent':
        action = 'send_pricing_offer';
        reasoning = 'Customer shows purchase intent, provide pricing';
        break;
      case 'support':
        action = 'escalate_to_agent';
        channel = 'whatsapp'; // Prefer rich channel for support
        reasoning = 'Customer needs support, escalate to human agent';
        break;
    }

    return {
      recommendedAction: action,
      recommendedChannel: channel,
      confidence,
      reasoning
    };
  }
}

export default CustomerJourneyTracker;
