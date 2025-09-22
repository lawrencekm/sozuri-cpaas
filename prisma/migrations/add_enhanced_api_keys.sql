-- Enhanced API Key Management System
-- This migration adds the ApiKeyV2 model and related tables for enhanced API key management

-- API Versions table
CREATE TABLE api_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  deprecated_at TIMESTAMP,
  sunset_at TIMESTAMP,
  migration_guide TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default API versions
INSERT INTO api_versions (version, status) VALUES 
  ('v1', 'active'),
  ('v2', 'active');

-- Enhanced API Keys table (ApiKeyV2)
CREATE TABLE api_keys_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  user_id UUID,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  key_prefix VARCHAR(20) NOT NULL,
  permissions JSONB NOT NULL DEFAULT '[]',
  scopes JSONB NOT NULL DEFAULT '[]',
  rate_limit JSONB,
  expires_at TIMESTAMP,
  last_used_at TIMESTAMP,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT fk_api_keys_v2_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_api_keys_v2_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- API Usage Analytics table
CREATE TABLE api_usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  api_key_id UUID,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER,
  request_size_bytes INTEGER,
  response_size_bytes INTEGER,
  user_agent TEXT,
  ip_address INET,
  api_version VARCHAR(10),
  timestamp TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT fk_api_usage_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_api_usage_api_key FOREIGN KEY (api_key_id) REFERENCES api_keys_v2(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX idx_api_keys_v2_project_id ON api_keys_v2(project_id);
CREATE INDEX idx_api_keys_v2_user_id ON api_keys_v2(user_id);
CREATE INDEX idx_api_keys_v2_key_hash ON api_keys_v2(key_hash);
CREATE INDEX idx_api_keys_v2_is_active ON api_keys_v2(is_active);
CREATE INDEX idx_api_keys_v2_expires_at ON api_keys_v2(expires_at);
CREATE INDEX idx_api_keys_v2_last_used_at ON api_keys_v2(last_used_at);

CREATE INDEX idx_api_usage_project_id ON api_usage_analytics(project_id);
CREATE INDEX idx_api_usage_api_key_id ON api_usage_analytics(api_key_id);
CREATE INDEX idx_api_usage_timestamp ON api_usage_analytics(timestamp);
CREATE INDEX idx_api_usage_endpoint ON api_usage_analytics(endpoint);
CREATE INDEX idx_api_usage_status_code ON api_usage_analytics(status_code);

CREATE INDEX idx_api_versions_version ON api_versions(version);
CREATE INDEX idx_api_versions_status ON api_versions(status);