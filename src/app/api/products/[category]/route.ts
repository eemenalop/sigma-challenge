import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';
import { getProductsByCategory } from '@/lib/services/productService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    if (!category || category.trim() === '') {
      return NextResponse.json(
        errorResponse('Category is required'),
        { status: 400 }
      );
    }

    const products = await getProductsByCategory(category);
    return NextResponse.json(successResponse(products));
  } catch (error) {
    return NextResponse.json(
      errorResponse('Error fetching products by category'),
      { status: 500 }
    );
  }
}