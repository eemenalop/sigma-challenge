import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';
import { getAllCategories } from '@/lib/services/productService';

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(successResponse(categories));
  } catch (error) {
    return NextResponse.json(
      errorResponse('Error fetching categories'),
      { status: 500 }
    );
  }
}