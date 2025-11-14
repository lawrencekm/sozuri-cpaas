/**
 * Bulk SMS sending API endpoint
 * POST /api/v1/messaging/sms/bulk - Send bulk SMS messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fieldMapping, validation, errorHandling } from '@/lib/field-mapping';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

interface BulkSmsRequest {
  project_id: string;
  from?: string;
  message: string;
  recipients: string[]; // Array of phone numbers
  message_type?: 'text' | 'unicode' | 'binary';
  provider?: string;
  scheduled_at?: string;
  campaign_id?: string;
  template_id?: string;
}

/**
 * POST /api/v1/messaging/sms/bulk
 * Send bulk SMS messages
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorHandling.auth();
    }

    const body: BulkSmsRequest = await request.json().catch(() => ({}));

    // Basic validation
    if (!body.project_id || !body.message || !body.recipients || !Array.isArray(body.recipients)) {
      return errorHandling.validation([
        { field: 'project_id', message: 'Project ID is required' },
        { field: 'message', message: 'Message content is required' },
        { field: 'recipients', message: 'Recipients array is required' }
      ]);
    }

    if (body.recipients.length === 0) {
      return errorHandling.validation([
        { field: 'recipients', message: 'At least one recipient is required' }
      ]);
    }

    if (body.recipients.length > 1000) {
      return errorHandling.validation([
        { field: 'recipients', message: 'Maximum 1000 recipients allowed per bulk request' }
      ]);
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: body.project_id,
        userId: session.user.id
      },
      select: {
        id: true,
        smsCredits: true,
        isSuspended: true,
        isActive: true,
        defaultSenderId: true
      }
    });

    if (!project) {
      return errorHandling.forbidden('Project not found or access denied');
    }

    if (project.isSuspended) {
      return errorHandling.businessError(
        'PROJECT_SUSPENDED',
        'Project is suspended and cannot send messages'
      );
    }

    if (!project.isActive) {
      return errorHandling.businessError(
        'PROJECT_INACTIVE',
        'Project is inactive'
      );
    }

    // Calculate estimated cost for all messages
    const messageParts = Math.ceil(body.message.length / 160);
    const totalEstimatedCost = body.recipients.length * messageParts;

    if (Number(project.smsCredits) < totalEstimatedCost) {
      return errorHandling.businessError(
        'INSUFFICIENT_CREDITS',
        `Insufficient SMS credits. Required: ${totalEstimatedCost}, Available: ${project.smsCredits}`
      );
    }

    // Generate bulk ID for grouping
    const bulkId = uuidv4();

    // Prepare SMS messages data
    const smsMessagesData = body.recipients.map(recipient => {
      const messageId = uuidv4();
      
      return {
        messageId,
        projectId: body.project_id,
        campaignId: body.campaign_id || null,
        templateId: body.template_id || null,
        from: body.from || project.defaultSenderId || 'SOZURI',
        to: recipient.trim(),
        message: body.message,
        messageType: body.message_type || 'text',
        messageParts,
        channel: 'sms',
        provider: body.provider || 'safaricom',
        status: 'pending',
        direction: 'outbound',
        retryCount: 0,
        priceUnit: 'KES',
        bulkId,
        scheduledAt: body.scheduled_at ? new Date(body.scheduled_at) : null
      };
    });

    // Create all SMS messages in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create SMS messages
      const createdMessages = await tx.smsMessage.createMany({
        data: smsMessagesData,
        skipDuplicates: true
      });

      // Get the created messages for response
      const messages = await tx.smsMessage.findMany({
        where: { bulkId },
        select: {
          id: true,
          messageId: true,
          projectId: true,
          from: true,
          to: true,
          message: true,
          messageType: true,
          messageParts: true,
          provider: true,
          status: true,
          bulkId: true,
          scheduledAt: true,
          createdAt: true
        },
        orderBy: { createdAt: 'asc' }
      });

      return {
        count: createdMessages.count,
        messages
      };
    });

    // Transform to API format
    const transformedMessages = fieldMapping.toApiArray('smsMessage', result.messages);

    // TODO: Add to message queue for actual sending
    // This would typically involve:
    // 1. Adding bulk job to queue with bulkId
    // 2. Processing by background workers in batches
    // 3. Rate limiting and provider API calls
    // 4. Updating message statuses based on provider responses

    return errorHandling.success(
      {
        bulk_id: bulkId,
        total_messages: result.count,
        estimated_cost: totalEstimatedCost,
        messages: transformedMessages
      },
      `${result.count} SMS messages queued for sending`,
      201
    );

  } catch (error) {
    console.error('Bulk SMS send error:', error);
    return errorHandling.prisma(error);
  }
}