# N3 Empire OS - Phase 4: SaaS Productization

## 📋 Overview

Phase 4 transforms N3 Empire OS from a personal automation tool into a **world-scale SaaS OS**.

### Completion Criteria
- ✅ Multi-user support
- ✅ Multi-organization management
- ✅ Billing/Plan controls
- ✅ Usage limits & quotas
- ✅ Self-service onboarding
- ✅ Security hardening

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ N3 Empire OS - SaaS Layer                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ TenantContext   │  │ OrganizationSwitcher │              │
│  │ (React)         │  │ (UI Component)  │                  │
│  └────────┬────────┘  └────────┬────────┘                  │
│           │                    │                            │
│           ▼                    ▼                            │
│  ┌─────────────────────────────────────────┐               │
│  │        Tenant API Layer                  │               │
│  │  /api/tenant/organizations              │               │
│  │  /api/tenant/usage                      │               │
│  │  /api/tenant/role                       │               │
│  └────────────────────┬────────────────────┘               │
│                       │                                     │
│                       ▼                                     │
│  ┌─────────────────────────────────────────┐               │
│  │        Guards Layer                      │               │
│  │  • BillingGuard                         │               │
│  │  • WebhookFirewall                      │               │
│  │  • APIKeyManager                        │               │
│  │  • RateLimiter                          │               │
│  │  • RBAC                                 │               │
│  └────────────────────┬────────────────────┘               │
│                       │                                     │
│                       ▼                                     │
│  ┌─────────────────────────────────────────┐               │
│  │        Supabase (PostgreSQL)            │               │
│  │  • organizations                        │               │
│  │  • organization_members                 │               │
│  │  • plans                                │               │
│  │  • usage_records                        │               │
│  │  • api_keys                             │               │
│  │  • audit_logs                           │               │
│  └─────────────────────────────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 File Structure

```
lib/
├── tenant/
│   ├── index.ts              # Export & constants
│   ├── tenant-service.ts     # Core tenant operations
│   └── schema.sql            # Database schema
│
├── guards/
│   ├── index.ts              # Guard exports
│   ├── billing-guard.ts      # Plan/quota checks
│   ├── webhook-firewall.ts   # Webhook security
│   ├── api-key-manager.ts    # API key rotation
│   ├── rate-limiter.ts       # Rate limiting
│   └── rbac.ts               # Role-based access

contexts/
├── TenantContext.tsx         # Tenant React context

components/
├── tenant/
│   ├── index.ts
│   ├── OrganizationSwitcher.tsx
│   └── UsageDashboard.tsx

app/
├── onboarding/
│   ├── page.tsx
│   └── components/
│       └── onboarding-wizard.tsx
│
├── api/
│   └── tenant/
│       ├── organizations/route.ts
│       ├── usage/route.ts
│       └── role/route.ts
```

---

## 🔧 Phase 4A: Tenant Layer

### TenantContext
- Organization state management
- Organization switching
- Plan/limits tracking
- Usage statistics

### Key Components
```tsx
// Usage in any component
import { useTenant, useTenantDispatch } from '@/contexts/TenantContext';

function MyComponent() {
  const { organization, plan, hasFeature } = useTenant();
  const { dispatch, canDispatch } = useTenantDispatch();
  
  // Check feature access
  if (!hasFeature('listing-auto')) {
    return <UpgradePrompt />;
  }
  
  // Dispatch with tenant context
  const result = await dispatch('inventory-sync', 'execute', {});
}
```

### OrganizationSwitcher
- Dropdown for switching organizations
- Plan badge display
- Current organization indicator

---

## 💰 Phase 4B: Plan & Billing Guard

### Plan Types
| Plan | Dispatch/mo | Concurrent | API/day | Features |
|------|-------------|------------|---------|----------|
| Free | 500 | 1 | 100 | Basic |
| Pro | 5,000 | 5 | 1,000 | +Auto, Sync |
| Empire | ∞ | 20 | ∞ | All features |

### Billing Check Flow
```typescript
import { checkDispatchBilling } from '@/lib/guards';

const result = await checkDispatchBilling({
  context: tenantContext,
  toolId: 'research-agent',
});

if (!result.allowed) {
  // 402 Payment Required
  return { error: result.reason, code: result.code };
}
```

---

## 📊 Phase 4C: Usage Metering

### Usage Tracking
- Dispatch count per month
- Concurrent job tracking
- API call counting
- Storage usage

### UsageDashboard
- Real-time usage display
- Progress bars with limits
- Tool breakdown
- 7-day activity graph

---

## 🚀 Phase 4D: Self Onboarding

### Onboarding Flow
1. **Welcome** - Feature overview
2. **Organization** - Create org name
3. **Plan** - Select plan (Free/Pro/Empire)
4. **Integrations** - Connect services (optional)
5. **Complete** - Launch dashboard

### API
```typescript
// Create organization during onboarding
POST /api/tenant/organizations
{
  "name": "My Company",
  "plan": "pro"
}
```

---

## 🔒 Phase 4E: Security Hardening

### API Key Management
```typescript
import { generateApiKey, rotateApiKey, revokeApiKey } from '@/lib/guards';

// Generate new key
const { apiKey, fullKey } = await generateApiKey(
  organizationId,
  'Production Key',
  { scopes: ['dispatch', 'read'] }
);

// Rotate with grace period
await rotateApiKey(keyId, organizationId, {
  gracePeriodHours: 24,
});

// Revoke immediately
await revokeApiKey(keyId, organizationId);
```

### Webhook Firewall
- IP whitelist (VPS n8n: 160.16.120.186)
- HMAC signature verification
- Rate limiting per IP

---

## 🗄️ Database Schema

### Core Tables

```sql
-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  slug VARCHAR(100) UNIQUE,
  plan VARCHAR(50) DEFAULT 'free',
  plan_expires_at TIMESTAMP,
  settings JSONB,
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Organization Members
CREATE TABLE organization_members (
  organization_id UUID,
  user_id UUID,
  role VARCHAR(50),  -- admin, operator, viewer
  accepted_at TIMESTAMP
);

-- Plans
CREATE TABLE plans (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  price_monthly DECIMAL,
  limits JSONB,
  features JSONB
);

-- Usage Records
CREATE TABLE usage_records (
  organization_id UUID,
  user_id UUID,
  tool_id VARCHAR(100),
  action VARCHAR(100),
  quantity INTEGER,
  cost_estimate DECIMAL,
  tokens_used INTEGER,
  api_calls INTEGER,
  recorded_at TIMESTAMP
);

-- API Keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  organization_id UUID,
  name VARCHAR(255),
  key_hash VARCHAR(255),
  key_prefix VARCHAR(20),
  scopes JSONB,
  is_active BOOLEAN,
  expires_at TIMESTAMP,
  last_used_at TIMESTAMP
);
```

---

## ✅ Acceptance Checklist

- [x] Organization switching works
- [x] Plan controls active
- [x] Free tier blocks on limit exceeded
- [x] Usage dashboard displays correctly
- [x] New users can self-onboard
- [x] API keys can be generated/rotated
- [x] Webhook firewall validates signatures
- [x] No breaking changes to Phase 2-3

---

## 🔄 Migration Guide

### From Single-Tenant to Multi-Tenant

1. Run `lib/tenant/schema.sql` in Supabase
2. Create default organization for existing data
3. Update `dispatch_jobs` with organization_id
4. Add TenantProvider to app layout

```tsx
// app/layout.tsx
import { TenantProvider } from '@/contexts/TenantContext';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <TenantProvider>
        {children}
      </TenantProvider>
    </AuthProvider>
  );
}
```

---

## 📈 Next Steps (Phase 5: Scale)

- [ ] Multi-region deployment
- [ ] Horizontal scaling
- [ ] Advanced analytics
- [ ] White-label support
- [ ] Enterprise SSO

---

## 📚 Related Documentation

- [Phase 2 README](/lib/empire-os/PHASE2_README.md)
- [Tenant Schema](/lib/tenant/schema.sql)
- [Guards Index](/lib/guards/index.ts)
