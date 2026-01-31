-- N3 Empire OS Phase 4: SaaS Tenant Schema
-- Supabase PostgreSQL Migration

-- ============================================================
-- Organizations Table
-- ============================================================

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  plan VARCHAR(50) NOT NULL DEFAULT 'free',
  plan_expires_at TIMESTAMP WITH TIME ZONE,
  settings JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for slug lookup
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_plan ON organizations(plan);

-- ============================================================
-- Users Table Extension
-- ============================================================

-- Add organization_id to existing users if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE users ADD COLUMN organization_id UUID REFERENCES organizations(id);
    ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'viewer';
    ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
    ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);

-- ============================================================
-- Organization Members (Many-to-Many for future multi-org)
-- ============================================================

CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',
  invited_by UUID,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id);

-- ============================================================
-- Plan Definitions
-- ============================================================

CREATE TABLE IF NOT EXISTS plans (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10, 2) DEFAULT 0,
  price_yearly DECIMAL(10, 2) DEFAULT 0,
  limits JSONB NOT NULL DEFAULT '{}',
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default plans
INSERT INTO plans (id, name, description, price_monthly, price_yearly, limits, features, sort_order) 
VALUES 
  ('free', 'Free', 'Get started with basic features', 0, 0, 
   '{"dispatch_per_month": 500, "concurrent_jobs": 1, "storage_gb": 1, "api_calls_per_day": 100}',
   '["Basic Research", "Manual Listing", "Job Monitor"]', 0),
  ('pro', 'Pro', 'For growing businesses', 29, 290,
   '{"dispatch_per_month": 5000, "concurrent_jobs": 5, "storage_gb": 10, "api_calls_per_day": 1000}',
   '["All Research Features", "Auto Listing", "Inventory Sync", "Priority Support"]', 1),
  ('empire', 'Empire', 'Unlimited power for enterprises', 99, 990,
   '{"dispatch_per_month": -1, "concurrent_jobs": 20, "storage_gb": 100, "api_calls_per_day": -1}',
   '["Unlimited Everything", "Media Generation", "Multi-Region", "Dedicated Support", "Custom Integrations"]', 2)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  limits = EXCLUDED.limits,
  features = EXCLUDED.features;

-- ============================================================
-- Usage Tracking
-- ============================================================

CREATE TABLE IF NOT EXISTS usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID,
  tool_id VARCHAR(100) NOT NULL,
  action VARCHAR(100),
  quantity INTEGER DEFAULT 1,
  cost_estimate DECIMAL(10, 4) DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_org ON usage_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_usage_org_date ON usage_records(organization_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_usage_tool ON usage_records(tool_id);

-- Monthly aggregation view
CREATE OR REPLACE VIEW usage_monthly AS
SELECT 
  organization_id,
  DATE_TRUNC('month', recorded_at) AS month,
  tool_id,
  COUNT(*) AS total_count,
  SUM(quantity) AS total_quantity,
  SUM(cost_estimate) AS total_cost,
  SUM(tokens_used) AS total_tokens,
  SUM(api_calls) AS total_api_calls
FROM usage_records
GROUP BY organization_id, DATE_TRUNC('month', recorded_at), tool_id;

-- ============================================================
-- API Keys
-- ============================================================

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  key_prefix VARCHAR(20) NOT NULL,
  scopes JSONB DEFAULT '["dispatch"]',
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_org ON api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON api_keys(key_prefix);

-- ============================================================
-- Audit Logs
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  user_id UUID,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  details JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_date ON audit_logs(created_at);

-- ============================================================
-- Update dispatch_jobs to include tenant info
-- ============================================================

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dispatch_jobs' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE dispatch_jobs ADD COLUMN organization_id UUID REFERENCES organizations(id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_dispatch_jobs_org ON dispatch_jobs(organization_id);

-- ============================================================
-- RLS Policies (Row Level Security)
-- ============================================================

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Organization access policy
CREATE POLICY org_member_access ON organizations
  FOR ALL USING (
    id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
  );

-- Usage records policy
CREATE POLICY usage_org_access ON usage_records
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
  );

-- API Keys policy
CREATE POLICY api_keys_org_access ON api_keys
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
  );
