/**
 * eBay Listing Rotation API - Execute Rotation
 * POST /api/ebay/rotation/execute
 *
 * Purpose: Execute listing rotation by ending low-score items and preparing for new listings
 * Integrates with ListingRotationService and CategoryLimitService
 */

import { NextRequest, NextResponse } from 'next/server';
import { listingRotationService } from '@/lib/services/listing/listing-rotation-service';
import { categoryLimitService } from '@/lib/services/listing/category-limit-service';

/**
 * POST /api/ebay/rotation/execute
 *
 * Body:
 * {
 *   "accountId": "account_123",
 *   "categoryId": "183454",
 *   "itemIdToEnd": "ebay_item_456",  // Optional: specific item to end
 *   "reason": "NotAvailable"         // Optional: reason for ending
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "endedItemId": "ebay_item_456",
 *   "categoryId": "183454",
 *   "newListingCapacity": {
 *     "canList": true,
 *     "remaining": 5235
 *   },
 *   "message": "Listing rotation executed successfully"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId, categoryId, itemIdToEnd, reason = 'NotAvailable' } = body;

    // Validation
    if (!accountId || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'accountId and categoryId are required' },
        { status: 400 }
      );
    }

    console.log('Executing listing rotation:', { accountId, categoryId, itemIdToEnd, reason });

    let targetItemId = itemIdToEnd;

    // If no specific item provided, find the lowest score item
    if (!targetItemId) {
      console.log('No specific item provided, finding lowest score item...');
      const lowScoreItems = await listingRotationService.identifyLowScoreItems(
        50, // threshold
        1,  // limit: only need the worst one
        categoryId
      );

      if (lowScoreItems.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'No low-score items found for rotation',
            categoryId,
          },
          { status: 404 }
        );
      }

      // Note: ebay_item_id not yet in schema, using sku as fallback
      targetItemId = lowScoreItems[0].ebay_item_id || lowScoreItems[0].id;
      console.log('Selected item for rotation:', lowScoreItems[0]);
    }

    // End the listing
    const endResult = await listingRotationService.endListing(targetItemId, reason);

    if (!endResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to end listing',
          details: endResult.errorMessage,
        },
        { status: 500 }
      );
    }

    console.log('Listing ended successfully:', targetItemId);

    // Decrement category count
    const decrementResult = await categoryLimitService.decrementListingCount(
      accountId,
      categoryId
    );

    if (!decrementResult.success) {
      console.warn('Failed to decrement category count, but listing was ended');
    }

    // Check new capacity
    const capacityCheck = await categoryLimitService.canListInCategory(
      accountId,
      categoryId
    );

    console.log('Rotation executed, new capacity:', capacityCheck);

    return NextResponse.json(
      {
        success: true,
        endedItemId: endResult.endedItemId,
        categoryId,
        newListingCapacity: {
          canList: capacityCheck.canList,
          remaining: capacityCheck.remaining,
          currentCount: capacityCheck.currentCount,
          maxLimit: capacityCheck.maxLimit,
        },
        message: 'Listing rotation executed successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in rotation execute API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to execute rotation',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
