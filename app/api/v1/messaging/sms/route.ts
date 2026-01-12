/**
 * SMS messaging API endpoints
 * GET /api/v1/messaging/sms - List SMS messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fieldMapping, validation, errorHandling } from '@/lib/field-mapping';

const prisma = new PrismaClient();

/**
 * GET /api/v1/messaging/sms
 * List SMS messages with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorHandling.auth();
    }

    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const projectId = searchParams.get('project_id') || searchParams.get('projectId');
    const status = searchParams.get('status');
    const provider = searchParams.get('provider');
    const to = searchParams.get('to');
    const from = searchParams.get('from');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const search = searchParams.get('search');

    // Validate query parameters
    const queryData = {
      project_id: projectId,
      status,
      provider,
      to,
      from,
      page,
      limit,
      search
    };

    const validationResult = validation.query('smsMessage', queryData);
    if (!validationResult.isValid) {
      return errorHandling.validation(validationResult.errors);
    }

    // Get user's projects for authorization
    const userProjects = await prisma.project.findMany({
      where: { userId: session.user.id },
      select: { id: true }
    });

    const projectIds = userProjects.map(p => p.id);
    if (projectIds.length === 0) {
      return errorHandling.success([], 'No SMS messages found');
    }

    // Build where clause
    const whereClause: any = {
      projectId: projectId ? projectId : { in: projectIds }
    };

    // Add filters
    if (status) whereClause.status = status;
    if (provider) whereClause.provider = provider;
    if (to) whereClause.to = { contains: to };
    if (from) whereClause.from = { contains: from };
    if (search) {
      whereClause.OR = [
        { message: { contains: search, mode: 'insensitive' } },
        { to: { contains: search } },
        { from: { contains: search } }
      ];
    }

    // Verify project access if specific project requested
    if (projectId && !projectIds.includes(projectId)) {
      return errorHandling.forbidden('Access denied to this project');
    }

    // Get total count for pagination
    const total = await prisma.smsMessage.count({ where: whereClause });

    // Get SMS messages
    const smsMessages = await prisma.smsMessage.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        messageId: true,
        projectId: true,
        campaignId: true,
        templateId: true,
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
        deliveredAt: true,
        failureReason: true,
        retryCount: true,
        cost: true,
        price: true,
        priceUnit: true,
        scheduledAt: true,
        sentAt: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Transform to API format
    const transformedMessages = fieldMapping.toApiArray('smsMessage', smsMessages);

    return errorHandling.paginated(transformedMessages, total, page, limit);

  } catch (error) {
    console.error('SMS messages list error:', error);
    return errorHandling.prisma(error);
  }
}