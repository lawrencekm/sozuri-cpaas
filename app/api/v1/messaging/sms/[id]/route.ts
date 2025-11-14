/**
 * Individual SMS message API endpoint
 * GET /api/v1/messaging/sms/[id] - Get SMS message details
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fieldMapping, validation, errorHandling } from '@/lib/field-mapping';

const prisma = new PrismaClient();

/**
 * GET /api/v1/messaging/sms/[id]
 * Get SMS message details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorHandling.auth();
    }

    const { id } = params;

    if (!id) {
      return errorHandling.validation([
        { field: 'id', message: 'SMS message ID is required' }
      ]);
    }

    // Get user's projects for authorization
    const userProjects = await prisma.project.findMany({
      where: { userId: session.user.id },
      select: { id: true }
    });

    const projectIds = userProjects.map(p => p.id);
    if (projectIds.length === 0) {
      return errorHandling.notFound('SMS message');
    }

    // Find SMS message with project ownership check
    const smsMessage = await prisma.smsMessage.findFirst({
      where: {
        id,
        projectId: { in: projectIds }
      },
      select: {
        id: true,
        messageId: true,
        projectId: true,
        campaignId: true,
        templateId: true,
        alphanumericId: true,
        shortCodeId: true,
        from: true,
        to: true,
        message: true,
        messageType: true,
        messageParts: true,
        channel: true,
        provider: true,
        telco: true,
        networkCode: true,
        status: true,
        statusCode: true,
        deliveryStatus: true,
        deliveryDescription: true,
        direction: true,
        providerMessageId: true,
        providerResponse: true,
        providerTimestamp: true,
        deliveredAt: true,
        failureReason: true,
        retryCount: true,
        cost: true,
        price: true,
        priceUnit: true,
        scheduledAt: true,
        sentAt: true,
        bulkId: true,
        groupId: true,
        correlationId: true,
        traceId: true,
        apiVersion: true,
        userAgent: true,
        sourceIp: true,
        createdAt: true,
        updatedAt: true,
        // Include related data
        project: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        campaign: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        template: {
          select: {
            id: true,
            name: true,
            messageType: true
          }
        },
        alphanumeric: {
          select: {
            id: true,
            senderId: true,
            provider: true
          }
        },
        shortCode: {
          select: {
            id: true,
            code: true,
            provider: true
          }
        },
        callbacks: {
          select: {
            id: true,
            callbackType: true,
            status: true,
            statusCode: true,
            description: true,
            receivedAt: true
          },
          orderBy: { receivedAt: 'desc' }
        }
      }
    });

    if (!smsMessage) {
      return errorHandling.notFound('SMS message');
    }

    // Transform to API format
    const transformedMessage = fieldMapping.toApi('smsMessage', smsMessage);

    // Add related data in API format
    const responseData = {
      ...transformedMessage,
      project: smsMessage.project,
      campaign: smsMessage.campaign ? {
        ...smsMessage.campaign,
        channel: smsMessage.campaign.type // Map type -> channel
      } : null,
      template: smsMessage.template ? {
        ...smsMessage.template,
        channel: smsMessage.template.messageType // Map messageType -> channel
      } : null,
      sender_id: smsMessage.alphanumeric ? {
        id: smsMessage.alphanumeric.id,
        sender_id: smsMessage.alphanumeric.senderId,
        provider: smsMessage.alphanumeric.provider
      } : null,
      short_code: smsMessage.shortCode ? {
        id: smsMessage.shortCode.id,
        code: smsMessage.shortCode.code,
        provider: smsMessage.shortCode.provider
      } : null,
      delivery_callbacks: smsMessage.callbacks.map(callback => ({
        id: callback.id,
        callback_type: callback.callbackType,
        status: callback.status,
        status_code: callback.statusCode,
        description: callback.description,
        received_at: callback.receivedAt
      }))
    };

    return errorHandling.success(responseData);

  } catch (error) {
    console.error('SMS message details error:', error);
    return errorHandling.prisma(error);
  }
}

/**
 * PUT /api/v1/messaging/sms/[id]
 * Update SMS message (limited fields for status updates)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorHandling.auth();
    }

    const { id } = params;
    const body = await request.json().catch(() => ({}));

    if (!id) {
      return errorHandling.validation([
        { field: 'id', message: 'SMS message ID is required' }
      ]);
    }

    // Transform API data to database format
    const dbData = fieldMapping.toDb('smsMessage', body);

    // Validate update data
    const validationResult = validation.update('smsMessage', dbData);
    if (!validationResult.isValid) {
      return errorHandling.validation(validationResult.errors);
    }

    // Sanitize data (only allow specific fields to be updated)
    const allowedUpdateFields = ['status', 'deliveryStatus', 'failureReason'];
    const sanitizedData = validation.sanitize('smsMessage', 'update', dbData);
    const updateData: any = {};
    
    for (const field of allowedUpdateFields) {
      if (sanitizedData[field] !== undefined) {
        updateData[field] = sanitizedData[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return errorHandling.validation([
        { field: 'data', message: 'No valid fields to update' }
      ]);
    }

    // Get user's projects for authorization
    const userProjects = await prisma.project.findMany({
      where: { userId: session.user.id },
      select: { id: true }
    });

    const projectIds = userProjects.map(p => p.id);

    // Update SMS message with project ownership check
    const updatedMessage = await prisma.smsMessage.updateMany({
      where: {
        id,
        projectId: { in: projectIds }
      },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    if (updatedMessage.count === 0) {
      return errorHandling.notFound('SMS message');
    }

    // Get updated message
    const smsMessage = await prisma.smsMessage.findUnique({
      where: { id },
      select: {
        id: true,
        messageId: true,
        projectId: true,
        from: true,
        to: true,
        message: true,
        status: true,
        deliveryStatus: true,
        failureReason: true,
        updatedAt: true
      }
    });

    // Transform to API format
    const transformedMessage = fieldMapping.toApi('smsMessage', smsMessage);

    return errorHandling.success(transformedMessage, 'SMS message updated successfully');

  } catch (error) {
    console.error('SMS message update error:', error);
    return errorHandling.prisma(error);
  }
}