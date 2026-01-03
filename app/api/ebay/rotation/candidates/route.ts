/**
 * eBay Listing Rotation API - Get Rotation Candidates
 * GET /api/ebay/rotation/candidates
 *
 * Purpose: Identify low-score items that are candidates for rotation
 * Integrates with ListingRotationService
 */

import { NextRequest, NextResponse } from 'next/server';
import { listingRotationService } from '@/lib/services/listing/listing-rotation-service';

/**
 * GET /api/ebay/rotation/candidates
 *
 * Query Params:
 * - threshold: number (default: 50) - Score threshold
 * - limit: number (default: 10) - Maximum results
 * - categoryId: string (optional) - Filter by category
 *
 * Response:
 * {
 *   "success": true,
 *   "candidates": [
 *     {
 *       "id": "uuid-123",
 *       "sku": "PROD-001",
 *       "title": "Product Title",
 *       "listing_score": 25.5,
 *       "category_id": "183454"
 *     }
 *   ],
 *   "count": 1,
 *   "threshold": 50
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const threshold = parseInt(searchParams.get('threshold') || '50');
    const limit = parseInt(searchParams.get('limit') || '10');
    const categoryId = searchParams.get('categoryId') || undefined;

    // Validation
    if (threshold < 0 || threshold > 100) {
      return NextResponse.json(
        { success: false, error: 'threshold must be between 0 and 100' },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, error: 'limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    console.log('Getting rotation candidates:', { threshold, limit, categoryId });

    // Call ListingRotationService to identify low-score items
    const candidates = await listingRotationService.identifyLowScoreItems(
      threshold,
      limit,
      categoryId
    );

    console.log(`Found ${candidates.length} rotation candidates`);

    return NextResponse.json(
      {
        success: true,
        candidates,
        count: candidates.length,
        threshold,
        limit,
        categoryId: categoryId || 'all',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in rotation candidates API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get rotation candidates',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
