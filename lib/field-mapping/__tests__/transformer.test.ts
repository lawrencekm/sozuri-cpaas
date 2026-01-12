/**
 * Tests for field transformation utilities
 */

import { FieldTransformer } from '../transformer';

describe('FieldTransformer', () => {
  describe('toApiFormat', () => {
    it('should transform user database fields to API format', () => {
      const dbUser = {
        id: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date('2023-01-01'),
        isActive: true
      };

      const apiUser = FieldTransformer.toApiFormat('user', dbUser);

      expect(apiUser).toEqual({
        id: 'user123',
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date('2023-01-01'),
        is_active: true
      });
    });

    it('should transform campaign database fields to API format', () => {
      const dbCampaign = {
        id: 'campaign123',
        projectId: 'project123',
        type: 'sms',
        createdAt: new Date('2023-01-01'),
        totalSent: 100
      };

      const apiCampaign = FieldTransformer.toApiFormat('campaign', dbCampaign);

      expect(apiCampaign).toEqual({
        id: 'campaign123',
        project_id: 'project123',
        channel: 'sms', // type -> channel
        created_at: new Date('2023-01-01'),
        total_sent: 100
      });
    });

    it('should preserve unmapped fields', () => {
      const dbRecord = {
        id: 'test123',
        firstName: 'John',
        customField: 'custom value',
        nestedObject: { key: 'value' }
      };

      const apiRecord = FieldTransformer.toApiFormat('user', dbRecord);

      expect(apiRecord.customField).toBe('custom value');
      expect(apiRecord.nestedObject).toEqual({ key: 'value' });
    });
  });

  describe('toDbFormat', () => {
    it('should transform API fields to database format', () => {
      const apiUser = {
        id: 'user123',
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date('2023-01-01'),
        is_active: true
      };

      const dbUser = FieldTransformer.toDbFormat('user', apiUser);

      expect(dbUser).toEqual({
        id: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date('2023-01-01'),
        isActive: true
      });
    });

    it('should transform campaign API fields to database format', () => {
      const apiCampaign = {
        id: 'campaign123',
        project_id: 'project123',
        channel: 'sms',
        created_at: new Date('2023-01-01'),
        total_sent: 100
      };

      const dbCampaign = FieldTransformer.toDbFormat('campaign', apiCampaign);

      expect(dbCampaign).toEqual({
        id: 'campaign123',
        projectId: 'project123',
        type: 'sms', // channel -> type
        createdAt: new Date('2023-01-01'),
        totalSent: 100
      });
    });
  });

  describe('toApiFormatArray', () => {
    it('should transform array of database records to API format', () => {
      const dbUsers = [
        { id: 'user1', firstName: 'John', isActive: true },
        { id: 'user2', firstName: 'Jane', isActive: false }
      ];

      const apiUsers = FieldTransformer.toApiFormatArray('user', dbUsers);

      expect(apiUsers).toEqual([
        { id: 'user1', first_name: 'John', is_active: true },
        { id: 'user2', first_name: 'Jane', is_active: false }
      ]);
    });
  });

  describe('transformQueryParams', () => {
    it('should transform API query parameters to database field names', () => {
      const apiParams = {
        first_name: 'John',
        is_active: true,
        created_at: '2023-01-01'
      };

      const dbParams = FieldTransformer.transformQueryParams('user', apiParams);

      expect(dbParams).toEqual({
        firstName: 'John',
        isActive: true,
        createdAt: '2023-01-01'
      });
    });
  });

  describe('getApiFieldName', () => {
    it('should return API field name for database field', () => {
      expect(FieldTransformer.getApiFieldName('user', 'firstName')).toBe('first_name');
      expect(FieldTransformer.getApiFieldName('campaign', 'type')).toBe('channel');
    });

    it('should return original field name if no mapping exists', () => {
      expect(FieldTransformer.getApiFieldName('user', 'unknownField')).toBe('unknownField');
    });
  });

  describe('getDbFieldName', () => {
    it('should return database field name for API field', () => {
      expect(FieldTransformer.getDbFieldName('user', 'first_name')).toBe('firstName');
      expect(FieldTransformer.getDbFieldName('campaign', 'channel')).toBe('type');
    });

    it('should return original field name if no mapping exists', () => {
      expect(FieldTransformer.getDbFieldName('user', 'unknownField')).toBe('unknownField');
    });
  });

  describe('hasMapping', () => {
    it('should return true for models with mappings', () => {
      expect(FieldTransformer.hasMapping('user')).toBe(true);
      expect(FieldTransformer.hasMapping('campaign')).toBe(true);
      expect(FieldTransformer.hasMapping('template')).toBe(true);
    });

    it('should return false for models without mappings', () => {
      expect(FieldTransformer.hasMapping('unknownModel')).toBe(false);
    });
  });
});