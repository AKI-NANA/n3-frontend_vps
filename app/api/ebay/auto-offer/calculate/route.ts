/**
 * eBay Auto Offer API - Calculate Offer
 * POST /api/ebay/auto-offer/calculate
 *
 * Purpose: Calculate optimal offer price with loss prevention
 * Integrates with AutoOfferService for profit margin enforcement
 */

import { NextRequest, NextResponse } from 'next/server';
import { autoOfferService } from '@/lib/services/offers/auto-offer-service';

/**
 * POST /api/ebay/auto-offer/calculate
 *
 * Body:
 * {
 *   "productId": "uuid-123",
 *   "requestedOfferPrice": 95.00  // Optional: buyer's requested price
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "offerPrice": 101.00,
 *   "isProfitable": true,
 *   "breakEvenPrice": 95.50,
 *   "minimumOfferPrice": 100.00,
 *   "calculationDetails": {
 *     "purchasePrice": 70.00,
 *     "fixedCosts": 0,
 *     "ebayFees": 13.32,
 *     "paypalFees": 4.74,
 *     "shippingCost": 0,
 *     "minProfitMargin": 10.00,
 *     "discountFromListing": 14.00,
 *     "maxAllowedDiscount": 15.00
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, requestedOfferPrice } = body;

    // Validation
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId is required' },
        { status: 400 }
      );
    }

    console.log('Calculating optimal offer:', { productId, requestedOfferPrice });

    // Call AutoOfferService to calculate optimal offer
    const calculation = await autoOfferService.calculateOptimalOffer(
      productId,
      requestedOfferPrice
    );

    // Check if calculation was successful
    if (!calculation.offerPrice) {
      console.warn('No offer price calculated - auto-offer may be disabled or product not found');
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot calculate offer',
          reason: 'Auto-offer may be disabled for this product or product not found',
        },
        { status: 404 }
      );
    }

    // Check profitability
    if (!calculation.isProfitable) {
      console.warn('Calculated offer is not profitable:', calculation);
      return NextResponse.json(
        {
          success: false,
          error: 'Offer would result in loss',
          offerPrice: calculation.offerPrice,
          breakEvenPrice: calculation.breakEvenPrice,
          minimumOfferPrice: calculation.minimumOfferPrice,
          calculationDetails: calculation.calculationDetails,
        },
        { status: 400 }
      );
    }

    // Return successful calculation
    console.log('Optimal offer calculated successfully:', calculation.offerPrice);

    return NextResponse.json(
      {
        success: true,
        ...calculation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in auto-offer calculate API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate offer',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
