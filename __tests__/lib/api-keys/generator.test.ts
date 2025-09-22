import { 
  generateApiKey, 
  hashApiKey, 
  verifyApiKey, 
  getApiKeyEnvironment,
  isValidApiKeyFormat,
  maskApiKey,
  ApiKeyRotation
} from '@/lib/api-keys/generator';

describe('API Key Generator', () => {
  describe('generateApiKey', () => {
    it('should generate a live API key by default', () => {
      const result = generateApiKey();
      
      expect(result.key).toMatch(/^ak_live_[A-Za-z0-9_-]{43}$/);
      expect(result.keyPrefix).toBe(result.key.substring(0, 8));
      expect(result.keyHash).toHaveLength(64); // SHA-256 hex string
    });

    it('should generate a test API key when specified', () => {
      const result = generateApiKey('test');
      
      expect(result.key).toMatch(/^ak_test_[A-Za-z0-9_-]{43}$/);
      expect(result.keyPrefix).toBe('ak_test_');
    });

    it('should generate unique keys', () => {
      const key1 = generateApiKey();
      const key2 = generateApiKey();
      
      expect(key1.key).not.toBe(key2.key);
      expect(key1.keyHash).not.toBe(key2.keyHash);
    });
  });

  describe('hashApiKey', () => {
    it('should generate consistent hashes', () => {
      const key = 'ak_live_test123456789012345678901234567890123';
      const hash1 = hashApiKey(key);
      const hash2 = hashApiKey(key);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
    });

    it('should generate different hashes for different keys', () => {
      const key1 = 'ak_live_test123456789012345678901234567890123';
      const key2 = 'ak_live_test123456789012345678901234567890124';
      
      const hash1 = hashApiKey(key1);
      const hash2 = hashApiKey(key2);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyApiKey', () => {
    it('should verify correct API key', () => {
      const key = 'ak_live_test123456789012345678901234567890123';
      const hash = hashApiKey(key);
      
      expect(verifyApiKey(key, hash)).toBe(true);
    });

    it('should reject incorrect API key', () => {
      const key1 = 'ak_live_test123456789012345678901234567890123';
      const key2 = 'ak_live_test123456789012345678901234567890124';
      const hash = hashApiKey(key1);
      
      expect(verifyApiKey(key2, hash)).toBe(false);
    });
  });

  describe('getApiKeyEnvironment', () => {
    it('should detect live environment', () => {
      const key = 'ak_live_test123456789012345678901234567890123';
      expect(getApiKeyEnvironment(key)).toBe('live');
    });

    it('should detect test environment', () => {
      const key = 'ak_test_test123456789012345678901234567890123';
      expect(getApiKeyEnvironment(key)).toBe('test');
    });

    it('should return unknown for invalid format', () => {
      const key = 'invalid_key_format';
      expect(getApiKeyEnvironment(key)).toBe('unknown');
    });
  });

  describe('isValidApiKeyFormat', () => {
    it('should validate correct live key format', () => {
      const key = 'ak_live_ceIkX6Df_gRrQMyznI2rtlHj7C_Oo9TcewultAyvfYY';
      expect(isValidApiKeyFormat(key)).toBe(true);
    });

    it('should validate correct test key format', () => {
      const key = 'ak_test_ceIkX6Df_gRrQMyznI2rtlHj7C_Oo9TcewultAyvfYY';
      expect(isValidApiKeyFormat(key)).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(isValidApiKeyFormat('invalid')).toBe(false);
      expect(isValidApiKeyFormat('ak_live_short')).toBe(false);
      expect(isValidApiKeyFormat('wrong_prefix_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklm')).toBe(false);
    });
  });

  describe('maskApiKey', () => {
    it('should mask API key correctly', () => {
      const key = 'ak_live_ceIkX6Df_gRrQMyznI2rtlHj7C_Oo9TcewultAyvfYY';
      const masked = maskApiKey(key);
      
      expect(masked).toMatch(/^ak_live_•+vfYY$/);
      expect(masked.length).toBe(key.length);
    });

    it('should handle short keys', () => {
      const key = 'short';
      expect(maskApiKey(key)).toBe('short');
    });
  });
});

describe('ApiKeyRotation', () => {
  const mockApiKey = {
    id: 'test-id',
    projectId: 'test-project',
    name: 'Test Key',
    keyHash: 'hash',
    keyPrefix: 'ak_live_',
    permissions: [],
    scopes: [],
    usageCount: 0,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  describe('generateRotationKey', () => {
    it('should generate new key with same environment', () => {
      const currentKey = 'ak_live_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklm';
      const newKey = ApiKeyRotation.generateRotationKey(currentKey);
      
      expect(newKey.key).toMatch(/^ak_live_/);
      expect(newKey.key).not.toBe(currentKey);
    });
  });

  describe('shouldRotate', () => {
    it('should rotate old keys', () => {
      const oldKey = {
        ...mockApiKey,
        createdAt: new Date('2023-01-01') // Over 90 days old
      };
      
      expect(ApiKeyRotation.shouldRotate(oldKey)).toBe(true);
    });

    it('should rotate high-usage keys', () => {
      const highUsageKey = {
        ...mockApiKey,
        usageCount: 2000000
      };
      
      expect(ApiKeyRotation.shouldRotate(highUsageKey)).toBe(true);
    });

    it('should not rotate recent keys', () => {
      const recentKey = {
        ...mockApiKey,
        createdAt: new Date() // Today
      };
      
      expect(ApiKeyRotation.shouldRotate(recentKey)).toBe(false);
    });
  });

  describe('getRotationSchedule', () => {
    it('should calculate rotation schedule correctly', () => {
      const schedule = ApiKeyRotation.getRotationSchedule(mockApiKey);
      
      expect(schedule.nextRotation).toBeInstanceOf(Date);
      expect(typeof schedule.isOverdue).toBe('boolean');
      expect(typeof schedule.daysUntilRotation).toBe('number');
    });
  });
});