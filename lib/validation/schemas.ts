/**
 * Validation schemas for all database models
 */

import { ModelValidationSchema, ValidationRule } from '../field-mapping/types';

// Common validation rules
const commonRules = {
  id: { field: 'id', type: 'string' as const, required: false },
  isActive: { field: 'is_active', type: 'boolean' as const, required: false },
  isArchived: { field: 'is_archived', type: 'boolean' as const, required: false },
  createdAt: { field: 'created_at', type: 'date' as const, required: false },
  updatedAt: { field: 'updated_at', type: 'date' as const, required: false }
};

export const VALIDATION_SCHEMAS: ModelValidationSchema = {
  user: {
    create: [
      { field: 'email', type: 'email', required: true, maxLength: 255 },
      { field: 'name', type: 'string', required: false, maxLength: 255 },
      { field: 'first_name', type: 'string', required: false, maxLength: 100 },
      { field: 'middle_name', type: 'string', required: false, maxLength: 100 },
      { field: 'last_name', type: 'string', required: false, maxLength: 100 },
      { field: 'mobile', type: 'phone', required: false },
      { field: 'about', type: 'string', required: false, maxLength: 1000 },
      { field: 'country', type: 'string', required: false, maxLength: 100 },
      commonRules.isActive,
      commonRules.isArchived
    ],
    update: [
      commonRules.id,
      { field: 'email', type: 'email', required: false, maxLength: 255 },
      { field: 'name', type: 'string', required: false, maxLength: 255 },
      { field: 'first_name', type: 'string', required: false, maxLength: 100 },
      { field: 'middle_name', type: 'string', required: false, maxLength: 100 },
      { field: 'last_name', type: 'string', required: false, maxLength: 100 },
      { field: 'mobile', type: 'phone', required: false },
      { field: 'about', type: 'string', required: false, maxLength: 1000 },
      { field: 'country', type: 'string', required: false, maxLength: 100 },
      commonRules.isActive,
      commonRules.isArchived
    ],
    query: [
      { field: 'email', type: 'string', required: false },
      { field: 'mobile', type: 'string', required: false },
      { field: 'is_active', type: 'boolean', required: false },
      { field: 'search', type: 'string', required: false, maxLength: 255 }
    ]
  },

  project: {
    create: [
      { field: 'name', type: 'string', required: true, minLength: 1, maxLength: 255 },
      { field: 'description', type: 'string', required: false, maxLength: 1000 },
      { field: 'code', type: 'string', required: false, maxLength: 50 },
      { field: 'type', type: 'enum', required: false, enumValues: ['transactional', 'marketing', 'notification'] },
      { field: 'timezone', type: 'string', required: false, maxLength: 100 },
      { field: 'currency', type: 'enum', required: false, enumValues: ['KES', 'USD', 'EUR', 'GBP'] },
      { field: 'default_sender_id', type: 'string', required: false, maxLength: 11 },
      { field: 'webhook_url', type: 'string', required: false, maxLength: 500 },
      { field: 'is_trial', type: 'boolean', required: false },
      { field: 'account_type', type: 'enum', required: false, enumValues: ['basic', 'premium', 'enterprise'] },
      commonRules.isActive,
      commonRules.isArchived
    ],
    update: [
      commonRules.id,
      { field: 'name', type: 'string', required: false, minLength: 1, maxLength: 255 },
      { field: 'description', type: 'string', required: false, maxLength: 1000 },
      { field: 'code', type: 'string', required: false, maxLength: 50 },
      { field: 'type', type: 'enum', required: false, enumValues: ['transactional', 'marketing', 'notification'] },
      { field: 'timezone', type: 'string', required: false, maxLength: 100 },
      { field: 'currency', type: 'enum', required: false, enumValues: ['KES', 'USD', 'EUR', 'GBP'] },
      { field: 'default_sender_id', type: 'string', required: false, maxLength: 11 },
      { field: 'webhook_url', type: 'string', required: false, maxLength: 500 },
      { field: 'is_trial', type: 'boolean', required: false },
      { field: 'account_type', type: 'enum', required: false, enumValues: ['basic', 'premium', 'enterprise'] },
      commonRules.isActive,
      commonRules.isArchived
    ],
    query: [
      { field: 'user_id', type: 'string', required: false },
      { field: 'is_trial', type: 'boolean', required: false },
      { field: 'account_type', type: 'string', required: false },
      { field: 'is_active', type: 'boolean', required: false },
      { field: 'search', type: 'string', required: false, maxLength: 255 }
    ]
  },

  campaign: {
    create: [
      { field: 'project_id', type: 'string', required: true },
      { field: 'name', type: 'string', required: true, minLength: 1, maxLength: 255 },
      { field: 'description', type: 'string', required: false, maxLength: 1000 },
      { field: 'channel', type: 'enum', required: false, enumValues: ['sms', 'whatsapp', 'voice', 'email'] },
      { field: 'goal', type: 'enum', required: false, enumValues: ['awareness', 'conversion', 'retention'] },
      { field: 'audience', type: 'enum', required: false, enumValues: ['all', 'list', 'segment', 'custom'] },
      { field: 'contact_list_ids', type: 'array', required: false },
      { field: 'max_budget', type: 'number', required: false, min: 0 },
      { field: 'max_messages', type: 'number', required: false, min: 1 },
      { field: 'daily_limit', type: 'number', required: false, min: 1 },
      { field: 'scheduled_at', type: 'date', required: false },
      { field: 'timezone', type: 'string', required: false, maxLength: 100 },
      { field: 'status', type: 'enum', required: false, enumValues: ['draft', 'scheduled', 'running', 'paused', 'completed', 'cancelled'] },
      commonRules.isActive,
      commonRules.isArchived
    ],
    update: [
      commonRules.id,
      { field: 'name', type: 'string', required: false, minLength: 1, maxLength: 255 },
      { field: 'description', type: 'string', required: false, maxLength: 1000 },
      { field: 'channel', type: 'enum', required: false, enumValues: ['sms', 'whatsapp', 'voice', 'email'] },
      { field: 'goal', type: 'enum', required: false, enumValues: ['awareness', 'conversion', 'retention'] },
      { field: 'audience', type: 'enum', required: false, enumValues: ['all', 'list', 'segment', 'custom'] },
      { field: 'contact_list_ids', type: 'array', required: false },
      { field: 'max_budget', type: 'number', required: false, min: 0 },
      { field: 'max_messages', type: 'number', required: false, min: 1 },
      { field: 'daily_limit', type: 'number', required: false, min: 1 },
      { field: 'scheduled_at', type: 'date', required: false },
      { field: 'timezone', type: 'string', required: false, maxLength: 100 },
      { field: 'status', type: 'enum', required: false, enumValues: ['draft', 'scheduled', 'running', 'paused', 'completed', 'cancelled'] },
      commonRules.isActive,
      commonRules.isArchived
    ],
    query: [
      { field: 'project_id', type: 'string', required: false },
      { field: 'status', type: 'string', required: false },
      { field: 'channel', type: 'string', required: false },
      { field: 'search', type: 'string', required: false, maxLength: 255 }
    ]
  },

  template: {
    create: [
      { field: 'project_id', type: 'string', required: true },
      { field: 'name', type: 'string', required: true, minLength: 1, maxLength: 255 },
      { field: 'description', type: 'string', required: false, maxLength: 1000 },
      { field: 'channel', type: 'enum', required: false, enumValues: ['sms', 'whatsapp', 'email'] },
      { field: 'subject', type: 'string', required: false, maxLength: 255 },
      { field: 'content', type: 'string', required: true, minLength: 1, maxLength: 5000 },
      { field: 'variables', type: 'array', required: false },
      { field: 'type', type: 'enum', required: false, enumValues: ['marketing', 'transactional', 'notification'] },
      { field: 'language', type: 'string', required: false, maxLength: 10 },
      { field: 'is_validated', type: 'boolean', required: false },
      { field: 'validation_errors', type: 'array', required: false },
      commonRules.isActive,
      commonRules.isArchived
    ],
    update: [
      commonRules.id,
      { field: 'name', type: 'string', required: false, minLength: 1, maxLength: 255 },
      { field: 'description', type: 'string', required: false, maxLength: 1000 },
      { field: 'channel', type: 'enum', required: false, enumValues: ['sms', 'whatsapp', 'email'] },
      { field: 'subject', type: 'string', required: false, maxLength: 255 },
      { field: 'content', type: 'string', required: false, minLength: 1, maxLength: 5000 },
      { field: 'variables', type: 'array', required: false },
      { field: 'type', type: 'enum', required: false, enumValues: ['marketing', 'transactional', 'notification'] },
      { field: 'language', type: 'string', required: false, maxLength: 10 },
      { field: 'is_validated', type: 'boolean', required: false },
      { field: 'validation_errors', type: 'array', required: false },
      commonRules.isActive,
      commonRules.isArchived
    ],
    query: [
      { field: 'project_id', type: 'string', required: false },
      { field: 'channel', type: 'string', required: false },
      { field: 'type', type: 'string', required: false },
      { field: 'search', type: 'string', required: false, maxLength: 255 }
    ]
  },

  contact: {
    create: [
      { field: 'project_id', type: 'string', required: true },
      { field: 'user_id', type: 'string', required: true },
      { field: 'mobile', type: 'phone', required: true },
      { field: 'email', type: 'email', required: false, maxLength: 255 },
      { field: 'first_name', type: 'string', required: false, maxLength: 100 },
      { field: 'middle_name', type: 'string', required: false, maxLength: 100 },
      { field: 'last_name', type: 'string', required: false, maxLength: 100 },
      { field: 'full_name', type: 'string', required: false, maxLength: 255 },
      { field: 'job_title', type: 'string', required: false, maxLength: 100 },
      { field: 'company', type: 'string', required: false, maxLength: 255 },
      { field: 'department', type: 'string', required: false, maxLength: 100 },
      { field: 'city', type: 'string', required: false, maxLength: 100 },
      { field: 'state', type: 'string', required: false, maxLength: 100 },
      { field: 'country', type: 'string', required: false, maxLength: 100 },
      { field: 'address', type: 'string', required: false, maxLength: 500 },
      { field: 'postal_code', type: 'string', required: false, maxLength: 20 },
      { field: 'preferred_language', type: 'string', required: false, maxLength: 10 },
      { field: 'timezone', type: 'string', required: false, maxLength: 100 },
      { field: 'tags', type: 'array', required: false },
      { field: 'notes', type: 'string', required: false, maxLength: 1000 },
      { field: 'source', type: 'enum', required: false, enumValues: ['import', 'api', 'manual', 'web'] },
      commonRules.isActive,
      commonRules.isArchived
    ],
    update: [
      commonRules.id,
      { field: 'mobile', type: 'phone', required: false },
      { field: 'email', type: 'email', required: false, maxLength: 255 },
      { field: 'first_name', type: 'string', required: false, maxLength: 100 },
      { field: 'middle_name', type: 'string', required: false, maxLength: 100 },
      { field: 'last_name', type: 'string', required: false, maxLength: 100 },
      { field: 'full_name', type: 'string', required: false, maxLength: 255 },
      { field: 'job_title', type: 'string', required: false, maxLength: 100 },
      { field: 'company', type: 'string', required: false, maxLength: 255 },
      { field: 'department', type: 'string', required: false, maxLength: 100 },
      { field: 'city', type: 'string', required: false, maxLength: 100 },
      { field: 'state', type: 'string', required: false, maxLength: 100 },
      { field: 'country', type: 'string', required: false, maxLength: 100 },
      { field: 'address', type: 'string', required: false, maxLength: 500 },
      { field: 'postal_code', type: 'string', required: false, maxLength: 20 },
      { field: 'preferred_language', type: 'string', required: false, maxLength: 10 },
      { field: 'timezone', type: 'string', required: false, maxLength: 100 },
      { field: 'tags', type: 'array', required: false },
      { field: 'notes', type: 'string', required: false, maxLength: 1000 },
      { field: 'source', type: 'enum', required: false, enumValues: ['import', 'api', 'manual', 'web'] },
      { field: 'is_opted_out', type: 'boolean', required: false },
      { field: 'is_starred', type: 'boolean', required: false },
      { field: 'is_spam', type: 'boolean', required: false },
      { field: 'is_hidden', type: 'boolean', required: false },
      { field: 'is_excluded', type: 'boolean', required: false },
      commonRules.isActive,
      commonRules.isArchived
    ],
    query: [
      { field: 'project_id', type: 'string', required: false },
      { field: 'mobile', type: 'string', required: false },
      { field: 'email', type: 'string', required: false },
      { field: 'is_opted_out', type: 'boolean', required: false },
      { field: 'is_active', type: 'boolean', required: false },
      { field: 'search', type: 'string', required: false, maxLength: 255 }
    ]
  },

  smsMessage: {
    create: [
      { field: 'project_id', type: 'string', required: true },
      { field: 'from', type: 'string', required: true, maxLength: 20 },
      { field: 'to', type: 'phone', required: true },
      { field: 'message', type: 'string', required: true, minLength: 1, maxLength: 1600 },
      { field: 'message_type', type: 'enum', required: false, enumValues: ['text', 'unicode', 'binary'] },
      { field: 'provider', type: 'enum', required: false, enumValues: ['safaricom', 'airtel', 'telkom', 'international'] },
      { field: 'scheduled_at', type: 'date', required: false }
    ],
    update: [
      commonRules.id,
      { field: 'status', type: 'enum', required: false, enumValues: ['pending', 'sent', 'delivered', 'failed', 'expired'] },
      { field: 'delivery_status', type: 'string', required: false },
      { field: 'failure_reason', type: 'string', required: false }
    ],
    query: [
      { field: 'project_id', type: 'string', required: false },
      { field: 'status', type: 'string', required: false },
      { field: 'provider', type: 'string', required: false },
      { field: 'to', type: 'string', required: false },
      { field: 'from', type: 'string', required: false }
    ]
  },

  whatsappMessage: {
    create: [
      { field: 'project_id', type: 'string', required: true },
      { field: 'whatsapp_account_id', type: 'string', required: true },
      { field: 'phone_number_id', type: 'string', required: true },
      { field: 'from', type: 'string', required: true },
      { field: 'to', type: 'phone', required: true },
      { field: 'message_type', type: 'enum', required: true, enumValues: ['text', 'image', 'video', 'audio', 'document', 'location', 'contacts', 'template', 'interactive'] },
      { field: 'content', type: 'object', required: true }
    ],
    update: [
      commonRules.id,
      { field: 'status', type: 'enum', required: false, enumValues: ['pending', 'sent', 'delivered', 'read', 'failed'] },
      { field: 'status_description', type: 'string', required: false }
    ],
    query: [
      { field: 'project_id', type: 'string', required: false },
      { field: 'whatsapp_account_id', type: 'string', required: false },
      { field: 'status', type: 'string', required: false },
      { field: 'message_type', type: 'string', required: false },
      { field: 'to', type: 'string', required: false },
      { field: 'from', type: 'string', required: false }
    ]
  },

  paymentMethod: {
    create: [
      { field: 'name', type: 'string', required: true, minLength: 1, maxLength: 255 },
      { field: 'type', type: 'enum', required: true, enumValues: ['mpesa', 'card', 'bank', 'airtel_money', 'tkash'] },
      { field: 'provider', type: 'enum', required: true, enumValues: ['safaricom', 'airtel', 'telkom', 'flutterwave'] },
      { field: 'configuration', type: 'object', required: false },
      { field: 'is_active', type: 'boolean', required: false }
    ],
    update: [
      commonRules.id,
      { field: 'name', type: 'string', required: false, minLength: 1, maxLength: 255 },
      { field: 'configuration', type: 'object', required: false },
      { field: 'is_active', type: 'boolean', required: false }
    ],
    query: [
      { field: 'type', type: 'string', required: false },
      { field: 'provider', type: 'string', required: false },
      { field: 'is_active', type: 'boolean', required: false }
    ]
  },

  role: {
    create: [
      { field: 'name', type: 'string', required: true, minLength: 1, maxLength: 100 },
      { field: 'description', type: 'string', required: false, maxLength: 500 },
      { field: 'is_active', type: 'boolean', required: false },
      { field: 'is_archived', type: 'boolean', required: false }
    ],
    update: [
      commonRules.id,
      { field: 'name', type: 'string', required: false, minLength: 1, maxLength: 100 },
      { field: 'description', type: 'string', required: false, maxLength: 500 },
      { field: 'is_active', type: 'boolean', required: false },
      { field: 'is_archived', type: 'boolean', required: false }
    ],
    query: [
      { field: 'is_active', type: 'boolean', required: false },
      { field: 'search', type: 'string', required: false, maxLength: 255 }
    ]
  },

  permission: {
    create: [
      { field: 'name', type: 'string', required: true, minLength: 1, maxLength: 100 },
      { field: 'description', type: 'string', required: false, maxLength: 500 },
      { field: 'resource', type: 'string', required: true, maxLength: 50 },
      { field: 'action', type: 'enum', required: true, enumValues: ['create', 'read', 'update', 'delete', 'manage'] }
    ],
    update: [
      commonRules.id,
      { field: 'name', type: 'string', required: false, minLength: 1, maxLength: 100 },
      { field: 'description', type: 'string', required: false, maxLength: 500 },
      { field: 'resource', type: 'string', required: false, maxLength: 50 },
      { field: 'action', type: 'enum', required: false, enumValues: ['create', 'read', 'update', 'delete', 'manage'] }
    ],
    query: [
      { field: 'resource', type: 'string', required: false },
      { field: 'action', type: 'string', required: false },
      { field: 'search', type: 'string', required: false, maxLength: 255 }
    ]
  }
};