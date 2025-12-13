import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';
import { getProductsByCategoryPaginated } from '@/lib/services/paginationService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!category || category.trim() === '') {
      return NextResponse.json(
        errorResponse('Category is required'),
        { status: 400 }
      );
    }

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        errorResponse('Page and limit must be greater than 0'),
        { status: 400 }
      );
    }

    const { products, totalPages, totalItems } = await getProductsByCategoryPaginated(category, page, limit);
    
    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    return NextResponse.json(
      errorResponse('Error fetching products by category'),
      { status: 500 }
    );
  }
}