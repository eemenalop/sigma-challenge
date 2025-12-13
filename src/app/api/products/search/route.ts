import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';
import { searchProductsPaginated } from '@/lib/services/paginationService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!reference || reference.trim() === '') {
      return NextResponse.json(
        errorResponse('Search reference is required'),
        { status: 400 }
      );
    }

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        errorResponse('Page and limit must be greater than 0'),
        { status: 400 }
      );
    }


    const {products, totalPages, totalItems} = await searchProductsPaginated(reference, page, limit);
    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      errorResponse('Error searching products'),
      { status: 500 }
    );
  }
}