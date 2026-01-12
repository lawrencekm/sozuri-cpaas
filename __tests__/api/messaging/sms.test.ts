/**
 * SMS messaging API endpoints tests
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/v1/messaging/sms/route';
import { POST as SendSMS } from '@/app/api/v1/messaging/sms/send/route';
import { POST as BulkSMS } from '@/app/api/v1/messaging/sms/bulk/route';
import { GET as GetSMS } from '@/app/api/v1/messaging/sms/[id]/route';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}));

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    smsMessage: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      updateMany: jest.fn()
    },
    project: {
      findMany: jest.fn(),
      findFirst: jest.fn()
    },
    $transaction: jest.fn()
  }))
}));

jest.mock('@/lib/field-mapping', () => ({
  fieldMapping: {
    toApi: jest.fn((model, data) => data),
    toDb: jest.fn((model, data) => data),
    toApiArray: jest.fn((model, data) => data)
  },
  validation: {
    query: jest.fn(() => ({ isValid: true, errors: [] })),
    create: jest.fn(() => ({ isValid: true, errors: [] })),
    update: jest.fn(() => ({ isValid: true, errors: [] })),
    sanitize: jest.fn((model, operation, data) => data)
  },
  errorHandling: {
    auth: jest.fn(() => new Response('Unauthorized', { status: 401 })),
    forbidden: jest.fn(() => new Response('Forbidden', { status: 403 })),
    validation: jest.fn(() => new Response('Validation Error', { status: 400 })),
    success: jest.fn((data, message, status = 200) => 
      new Response(JSON.stringify({ success: true, data, message }), { status })
    ),
    paginated: jest.fn((items, total, page, limit) => 
      new Response(JSON.stringify({ 
        success: true, 
        data: items, 
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      }))
    ),
    prisma: jest.fn(() => new Response('Database Error', { status: 500 })),
    businessError: jest.fn(() => new Response('Business Error', { status: 400 })),
    notFound: jest.fn(() => new Response('Not Found', { status: 404 }))
  }
}));

const { getServerSession } = require('next-auth');
const { PrismaClient } = require('@prisma/client');

describe('SMS Messaging API', () => {
  let mockPrisma: any;
  let mockSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com'
      }
    };
    
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/messaging/sms', () => {
    it('should return SMS messages list', async () => {
      const mockProjects = [{ id: 'project-123' }];
      const mockSmsMessages = [
        {
          id: 'sms-1',
          messageId: 'msg-1',
          projectId: 'project-123',
          from: 'SOZURI',
          to: '+254700000000',
          message: 'Test message',
          status: 'sent',
          createdAt: new Date()
        }
      ];

      mockPrisma.project.findMany.mockResolvedValue(mockProjects);
      mockPrisma.smsMessage.count.mockResolvedValue(1);
      mockPrisma.smsMessage.findMany.mockResolvedValue(mockSmsMessages);

      const request = new NextRequest('http://localhost/api/v1/messaging/sms');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        select: { id: true }
      });
      expect(mockPrisma.smsMessage.findMany).toHaveBeenCalled();
    });

    it('should handle unauthorized access', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/v1/messaging/sms');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/messaging/sms/send', () => {
    it('should send SMS message', async () => {
      const mockProject = {
        id: 'project-123',
        smsCredits: 100,
        isSuspended: false,
        isActive: true,
        defaultSenderId: 'SOZURI'
      };

      const mockSmsMessage = {
        id: 'sms-1',
        messageId: 'msg-1',
        projectId: 'project-123',
        from: 'SOZURI',
        to: '+254700000000',
        message: 'Test message',
        status: 'pending',
        createdAt: new Date()
      };

      mockPrisma.project.findFirst.mockResolvedValue(mockProject);
      mockPrisma.smsMessage.create.mockResolvedValue(mockSmsMessage);

      const requestBody = {
        project_id: 'project-123',
        to: '+254700000000',
        message: 'Test message'
      };

      const request = new NextRequest('http://localhost/api/v1/messaging/sms/send', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const response = await SendSMS(request);

      expect(response.status).toBe(201);
      expect(mockPrisma.project.findFirst).toHaveBeenCalled();
      expect(mockPrisma.smsMessage.create).toHaveBeenCalled();
    });

    it('should handle insufficient credits', async () => {
      const mockProject = {
        id: 'project-123',
        smsCredits: 0, // No credits
        isSuspended: false,
        isActive: true,
        defaultSenderId: 'SOZURI'
      };

      mockPrisma.project.findFirst.mockResolvedValue(mockProject);

      const requestBody = {
        project_id: 'project-123',
        to: '+254700000000',
        message: 'Test message'
      };

      const request = new NextRequest('http://localhost/api/v1/messaging/sms/send', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const response = await SendSMS(request);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/messaging/sms/bulk', () => {
    it('should send bulk SMS messages', async () => {
      const mockProject = {
        id: 'project-123',
        smsCredits: 100,
        isSuspended: false,
        isActive: true,
        defaultSenderId: 'SOZURI'
      };

      const mockResult = {
        count: 2,
        messages: [
          {
            id: 'sms-1',
            messageId: 'msg-1',
            projectId: 'project-123',
            from: 'SOZURI',
            to: '+254700000001',
            message: 'Bulk message',
            status: 'pending',
            bulkId: 'bulk-123',
            createdAt: new Date()
          },
          {
            id: 'sms-2',
            messageId: 'msg-2',
            projectId: 'project-123',
            from: 'SOZURI',
            to: '+254700000002',
            message: 'Bulk message',
            status: 'pending',
            bulkId: 'bulk-123',
            createdAt: new Date()
          }
        ]
      };

      mockPrisma.project.findFirst.mockResolvedValue(mockProject);
      mockPrisma.$transaction.mockResolvedValue(mockResult);

      const requestBody = {
        project_id: 'project-123',
        message: 'Bulk message',
        recipients: ['+254700000001', '+254700000002']
      };

      const request = new NextRequest('http://localhost/api/v1/messaging/sms/bulk', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const response = await BulkSMS(request);

      expect(response.status).toBe(201);
      expect(mockPrisma.project.findFirst).toHaveBeenCalled();
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('should validate recipients array', async () => {
      const requestBody = {
        project_id: 'project-123',
        message: 'Bulk message',
        recipients: [] // Empty recipients
      };

      const request = new NextRequest('http://localhost/api/v1/messaging/sms/bulk', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const response = await BulkSMS(request);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/messaging/sms/[id]', () => {
    it('should return SMS message details', async () => {
      const mockProjects = [{ id: 'project-123' }];
      const mockSmsMessage = {
        id: 'sms-1',
        messageId: 'msg-1',
        projectId: 'project-123',
        from: 'SOZURI',
        to: '+254700000000',
        message: 'Test message',
        status: 'delivered',
        createdAt: new Date(),
        project: { id: 'project-123', name: 'Test Project', code: 'TEST' },
        campaign: null,
        template: null,
        alphanumeric: null,
        shortCode: null,
        callbacks: []
      };

      mockPrisma.project.findMany.mockResolvedValue(mockProjects);
      mockPrisma.smsMessage.findFirst.mockResolvedValue(mockSmsMessage);

      const request = new NextRequest('http://localhost/api/v1/messaging/sms/sms-1');
      const response = await GetSMS(request, { params: { id: 'sms-1' } });

      expect(response.status).toBe(200);
      expect(mockPrisma.smsMessage.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'sms-1',
          projectId: { in: ['project-123'] }
        },
        select: expect.any(Object)
      });
    });

    it('should handle SMS message not found', async () => {
      const mockProjects = [{ id: 'project-123' }];

      mockPrisma.project.findMany.mockResolvedValue(mockProjects);
      mockPrisma.smsMessage.findFirst.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/v1/messaging/sms/nonexistent');
      const response = await GetSMS(request, { params: { id: 'nonexistent' } });

      expect(response.status).toBe(404);
    });
  });
});