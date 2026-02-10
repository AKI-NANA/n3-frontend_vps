// components/n3/n3-ebay-listing-badge.tsx
/**
 * eBay Listing Status Badge Component
 * 
 * Shows listing status in product list:
 * - Green: Active (listed)
 * - Red: Error
 * - Gray: None (not listed)
 * - Orange: Pending
 */

'use client';

import React, { memo } from 'react';

// Supported marketplaces
const MARKETPLACES = {
  US: { flag: '🇺🇸', name: 'United States' },
  UK: { flag: '🇬🇧', name: 'United Kingdom' },
  DE: { flag: '🇩🇪', name: 'Germany' },
  AU: { flag: '🇦🇺', name: 'Australia' },
  CA: { flag: '🇨🇦', name: 'Canada' },
  FR: { flag: '🇫🇷', name: 'France' },
  IT: { flag: '🇮🇹', name: 'Italy' },
  ES: { flag: '🇪🇸', name: 'Spain' },
} as const;

type MarketplaceCode = keyof typeof MARKETPLACES;

// Status colors
const STATUS_COLORS = {
  active: '#22c55e',
  error: '#ef4444',
  pending: '#f59e0b',
  none: '#6b7280',
} as const;

type StatusType = keyof typeof STATUS_COLORS;

// Site listing status
export interface SiteListingStatus {
  status: StatusType;
  itemId?: string;
  url?: string;
  listedAt?: string;
  error?: string;
}

// Component Props
export interface EbayListingBadgeProps {
  listingStatus?: Record<string, SiteListingStatus>;
  ebayItemId?: string;
  ebayListingUrl?: string;
  compact?: boolean;
  onClick?: () => void;
}

/**
 * eBay Icon
 */
const EbayIcon = memo(function EbayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path 
        d="M5.4 7.2c-1.3 0-2.4.6-2.4 2.4 0 1.2.6 1.8 1.8 2.1l1.2.3c.6.15.9.45.9.9 0 .6-.45 1.05-1.35 1.05-1.05 0-1.5-.6-1.5-1.35H3c0 1.35 1.05 2.4 2.55 2.4 1.65 0 2.55-.9 2.55-2.1 0-1.05-.6-1.65-1.8-1.95l-1.2-.3c-.6-.15-.9-.45-.9-.9 0-.6.45-.9 1.2-.9.9 0 1.2.45 1.2 1.05h1.2c0-1.2-.9-2.1-2.4-2.1zm3.6 0v7.5h1.2v-2.85h.15l2.1 2.85h1.5l-2.4-3.15 2.25-3h-1.5l-1.95 2.7H10.2V7.8h-1.2v-.6zm6 0v7.5h4.5v-1.05h-3.3v-2.25h2.85v-1.05H16.2V8.25h3.3V7.2H15zm5.4 0v7.5H21V7.2h-.6z" 
        fill="currentColor"
      />
    </svg>
  );
});

/**
 * Status Dot
 */
const StatusDot = memo(function StatusDot({ 
  status, 
  size = 8 
}: { 
  status: StatusType; 
  size?: number;
}) {
  const color = STATUS_COLORS[status];
  
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        flexShrink: 0,
      }}
      title={status}
    />
  );
});

/**
 * eBay Listing Badge (Compact)
 */
export const EbayListingBadgeCompact = memo(function EbayListingBadgeCompact({
  listingStatus,
  ebayItemId,
  onClick,
}: EbayListingBadgeProps) {
  // Multi-site listing
  if (listingStatus && Object.keys(listingStatus).length > 0) {
    const sites = Object.entries(listingStatus) as [MarketplaceCode, SiteListingStatus][];
    const activeSites = sites.filter(([_, s]) => s.status === 'active');
    const errorSites = sites.filter(([_, s]) => s.status === 'error');
    
    let displayStatus: StatusType = 'none';
    if (activeSites.length > 0) displayStatus = 'active';
    else if (errorSites.length > 0) displayStatus = 'error';
    
    return (
      <div
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 6px',
          borderRadius: 4,
          backgroundColor: 'var(--panel, #f5f5f5)',
          border: '1px solid var(--panel-border, #e5e5e5)',
          cursor: onClick ? 'pointer' : 'default',
          fontSize: '11px',
        }}
        title={`eBay: ${activeSites.length} sites active`}
      >
        <EbayIcon size={14} />
        <StatusDot status={displayStatus} size={6} />
        {activeSites.length > 0 && (
          <span style={{ color: STATUS_COLORS.active, fontWeight: 500 }}>
            {activeSites.length}
          </span>
        )}
        {errorSites.length > 0 && (
          <span style={{ color: STATUS_COLORS.error, fontWeight: 500 }}>
            !{errorSites.length}
          </span>
        )}
      </div>
    );
  }
  
  // Single site (US only)
  if (ebayItemId) {
    return (
      <div
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 6px',
          borderRadius: 4,
          backgroundColor: 'var(--panel, #f5f5f5)',
          border: '1px solid var(--panel-border, #e5e5e5)',
          cursor: onClick ? 'pointer' : 'default',
        }}
        title={`eBay US: ${ebayItemId}`}
      >
        <EbayIcon size={14} />
        <span style={{ fontSize: '12px' }}>🇺🇸</span>
        <StatusDot status="active" size={6} />
      </div>
    );
  }
  
  // Not listed
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 6px',
        borderRadius: 4,
        backgroundColor: 'transparent',
        border: '1px solid var(--panel-border, #e5e5e5)',
        opacity: 0.5,
        cursor: onClick ? 'pointer' : 'default',
      }}
      title="eBay: Not listed"
    >
      <EbayIcon size={14} />
      <StatusDot status="none" size={6} />
    </div>
  );
});

/**
 * eBay Listing Badge (Detail)
 */
export const EbayListingBadgeDetail = memo(function EbayListingBadgeDetail({
  listingStatus,
  ebayItemId,
  ebayListingUrl,
}: EbayListingBadgeProps) {
  // Multi-site
  if (listingStatus && Object.keys(listingStatus).length > 0) {
    const sites = Object.entries(listingStatus) as [MarketplaceCode, SiteListingStatus][];
    
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: 12,
          borderRadius: 8,
          backgroundColor: 'var(--panel, #f5f5f5)',
          border: '1px solid var(--panel-border, #e5e5e5)',
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
          marginBottom: 4,
        }}>
          <EbayIcon size={20} />
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Listing Status</span>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {sites.map(([site, status]) => (
            <a
              key={site}
              href={status.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: status.status === 'active' 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : status.status === 'error'
                  ? 'rgba(239, 68, 68, 0.1)'
                  : 'transparent',
                border: `1px solid ${STATUS_COLORS[status.status]}40`,
                textDecoration: 'none',
                color: 'inherit',
                fontSize: '12px',
              }}
            >
              <span style={{ fontSize: '16px' }}>{MARKETPLACES[site]?.flag || '🌐'}</span>
              <span style={{ fontWeight: 500 }}>{site}</span>
              <StatusDot status={status.status} size={8} />
            </a>
          ))}
        </div>
        
        {sites.some(([_, s]) => s.error) && (
          <div style={{ 
            marginTop: 8,
            padding: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fontSize: '11px',
            color: STATUS_COLORS.error,
          }}>
            {sites
              .filter(([_, s]) => s.error)
              .map(([site, s]) => (
                <div key={site}>
                  <strong>{site}:</strong> {s.error}
                </div>
              ))
            }
          </div>
        )}
      </div>
    );
  }
  
  // Single site (US only)
  if (ebayItemId) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: 12,
          borderRadius: 8,
          backgroundColor: 'var(--panel, #f5f5f5)',
          border: '1px solid var(--panel-border, #e5e5e5)',
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
        }}>
          <EbayIcon size={20} />
          <span style={{ fontWeight: 600, fontSize: '14px' }}>eBay US Listed</span>
          <StatusDot status="active" size={8} />
        </div>
        
        <div style={{ fontSize: '12px', color: 'var(--text-muted, #666)' }}>
          <div>Item ID: {ebayItemId}</div>
          {ebayListingUrl && (
            <a 
              href={ebayListingUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent, #0066cc)', textDecoration: 'underline' }}
            >
              View on eBay
            </a>
          )}
        </div>
      </div>
    );
  }
  
  // Not listed
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 8,
        backgroundColor: 'var(--panel, #f5f5f5)',
        border: '1px solid var(--panel-border, #e5e5e5)',
        opacity: 0.6,
      }}
    >
      <EbayIcon size={20} />
      <span style={{ fontSize: '14px', color: 'var(--text-muted, #666)' }}>Not listed on eBay</span>
    </div>
  );
});

/**
 * Default export (Compact version)
 */
export const N3EbayListingBadge = EbayListingBadgeCompact;

export default N3EbayListingBadge;
