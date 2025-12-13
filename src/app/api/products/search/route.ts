import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';
import { searchProducts } from '@/lib/services/productService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('q');

    if (!reference || reference.trim() === '') {
      return NextResponse.json(
        errorResponse('Search reference is required'),
        { status: 400 }
      );
    }

    const products = await searchProducts(reference);
    return NextResponse.json(successResponse(products));
  } catch (error) {
    return NextResponse.json(
      errorResponse('Error searching products'),
      { status: 500 }
    );
  }
}