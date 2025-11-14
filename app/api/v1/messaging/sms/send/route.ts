/**
 * SMS sending API endpoint
 * POST /api/v1/messaging/sms/send - Send individual SMS
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fieldMapping, validation, errorHandling } from '@/lib/field-mapping';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * POST /api/v1/messaging/sms/send
 * Send individual SMS message
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorHandling.auth();
    }

    const body = await request.json().catch(() => ({}));

    // Transform API data to database format
    const dbData = fieldMapping.toDb('smsMessage', body);

    // Validate required fields
    const validationResult = validation.create('smsMessage', dbData);
    if (!validationResult.isValid) {
      return errorHandling.validation(validationResult.errors);
    }

    // Sanitize data
    const sanitizedData = validation.sanitize('smsMessage', 'create', dbData);

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: sanitizedData.projectId,
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

    // Check SMS credits (basic check - actual cost calculation would be more complex)
    const estimatedCost = Math.ceil(sanitizedData.message.length / 160); // Basic SMS part calculation
    if (Number(project.smsCredits) < estimatedCost) {
      return errorHandling.businessError(
        'INSUFFICIENT_CREDITS',
        'Insufficient SMS credits'
      );
    }

    // Generate unique message ID
    const messageId = uuidv4();

    // Set defaults
    const smsData = {
      ...sanitizedData,
      messageId,
      from: sanitizedData.from || project.defaultSenderId || 'SOZURI',
      messageType: sanitizedData.messageType || 'text',
      messageParts: Math.ceil(sanitizedData.message.length / 160),
      channel: 'sms',
      provider: sanitizedData.provider || 'safaricom', // Default provider
      status: 'pending',
      direction: 'outbound',
      retryCount: 0,
      priceUnit: 'KES'
    };

    // Create SMS message record
    const smsMessage = await prisma.smsMessage.create({
      data: smsData,
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
        createdAt: true
      }
    });

    // Transform to API format
    const transformedMessage = fieldMapping.toApi('smsMessage', smsMessage);

    // TODO: Add to message queue for actual sending
    // This would typically involve:
    // 1. Adding to a job queue (Redis/Bull)
    // 2. Processing by background workers
    // 3. Calling SMS provider APIs
    // 4. Updating message status based on provider response

    return errorHandling.success(
      transformedMessage,
      'SMS message queued for sending',
      201
    );

  } catch (error) {
    console.error('SMS send error:', error);
    return errorHandling.prisma(error);
  }
}