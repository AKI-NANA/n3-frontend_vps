/**
 * eBay Category Limit API - Get All Category Limits
 * GET /api/ebay/category-limit
 *
 * Purpose: Retrieve all category limits for an account
 * Integrates with CategoryLimitService
 */

import { NextRequest, NextResponse } from 'next/server';
import { categoryLimitService } from '@/lib/services/listing/category-limit-service';

/**
 * GET /api/ebay/category-limit
 *
 * Query Params:
 * - accountId: string (required) - eBay account ID
 *
 * Response:
 * {
 *   "success": true,
 *   "accountId": "account_123",
 *   "categories": [
 *     {
 *       "id": "uuid-123",
 *       "categoryId": "183454",
 *       "limitType": "10000",
 *       "currentListingCount": 4766,
 *       "maxLimit": 10000,
 *       "utilizationRate": 47.7,
 *       "lastUpdated": "2025-11-22T10:30:00Z"
 *     }
 *   ],
 *   "summary": {
 *     "totalCategories": 1,
 *     "totalListings": 4766,
 *     "totalCapacity": 10000,
 *     "overallUtilization": 47.7
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');

    // Validation
    if (!accountId) {
      return NextResponse.json(
        { success: false, error: 'accountId query parameter is required' },
        { status: 400 }
      );
    }

    console.log('Getting all category limits for account:', accountId);

    // Call CategoryLimitService to get all limits
    // Note: This method (getAllCategoryLimits) is not yet implemented in Phase 3
    // For Phase 4, we'll query the database directly as a workaround

    // Workaround: Query specific categories or return empty
    // In production, implement categoryLimitService.getAllCategoryLimits()

    // Simulated response for now
    const simulatedCategories = [
      {
        id: 'limit-uuid-1',
        ebayAccountId: accountId,
        categoryId: '183454',
        limitType: '10000' as const,
        currentListingCount: 4766,
        maxLimit: 10000,
        lastUpdated: new Date(),
      },
    ];

    // Calculate utilization rates
    const categoriesWithUtilization = simulatedCategories.map((cat) => ({
      ...cat,
      utilizationRate: (cat.currentListingCount / cat.maxLimit) * 100,
    }));

    // Calculate summary
    const summary = {
      totalCategories: categoriesWithUtilization.length,
      totalListings: categoriesWithUtilization.reduce((sum, cat) => sum + cat.currentListingCount, 0),
      totalCapacity: categoriesWithUtilization.reduce((sum, cat) => sum + cat.maxLimit, 0),
      overallUtilization: 0,
    };

    summary.overallUtilization = (summary.totalListings / summary.totalCapacity) * 100;

    console.log(`Retrieved ${categoriesWithUtilization.length} category limits (simulated)`);

    return NextResponse.json(
      {
        success: true,
        accountId,
        categories: categoriesWithUtilization,
        summary,
        note: 'Simulated response. CategoryLimitService.getAllCategoryLimits() needs implementation.',
      },
      { status: 200 }
    );

    /*
    // Production implementation (to be completed):
    const categories = await categoryLimitService.getAllCategoryLimits(accountId);

    if (!categories || categories.length === 0) {
      return NextResponse.json(
        {
          success: true,
          accountId,
          categories: [],
          summary: {
            totalCategories: 0,
            totalListings: 0,
            totalCapacity: 0,
            overallUtilization: 0,
          },
          message: 'No category limits configured for this account',
        },
        { status: 200 }
      );
    }

    // Calculate utilization and summary
    const categoriesWithUtilization = categories.map((cat) => ({
      ...cat,
      utilizationRate: (cat.currentListingCount / cat.maxLimit) * 100,
    }));

    const summary = {
      totalCategories: categories.length,
      totalListings: categories.reduce((sum, cat) => sum + cat.currentListingCount, 0),
      totalCapacity: categories.reduce((sum, cat) => sum + cat.maxLimit, 0),
      overallUtilization: 0,
    };

    summary.overallUtilization = (summary.totalListings / summary.totalCapacity) * 100;

    return NextResponse.json(
      {
        success: true,
        accountId,
        categories: categoriesWithUtilization,
        summary,
      },
      { status: 200 }
    );
    */
  } catch (error) {
    console.error('Error in category limit GET API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get category limits',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
