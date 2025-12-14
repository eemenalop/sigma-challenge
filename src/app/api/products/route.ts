import { NextRequest, NextResponse } from 'next/server';
import { createProduct } from '@/lib/services/productService';
import { getAllProductsPaginated } from '@/lib/services/paginationService';
import { validateCreateProduct } from '@/lib/validators/productValidator';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

//Get all products with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        errorResponse('Page and limit must be greater than 0'),
        { status: 400 }
      );
    }

    const { products, totalPages, totalItems } = await getAllProductsPaginated(page, limit);
    
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
      errorResponse('Failed to get products'),
      { status: 500 }
    );
  }
}

//Create a new product
export async function POST(request: NextRequest){
  try {
      const body = await request.json();
      const errors = validateCreateProduct(body);
      if(errors.length > 0){
          return NextResponse.json(errorResponse('Validation errors', errors), { status: 400 });
      }
      const newProduct = await createProduct(body);
      
      const orderedProduct = {
          id: newProduct.id,
          title: newProduct.title,
          description: newProduct.description,
          category: newProduct.category,
          price: newProduct.price,
          rating: newProduct.rating,
          stock: newProduct.stock,
          brand: newProduct.brand,
          images: newProduct.images,
      };
      
      return NextResponse.json({
          success: true,
          data: orderedProduct
      }, { status: 201 });
  }catch(error){
      console.error('POST error:', error);
      return NextResponse.json(errorResponse('Failed to create product'), { status: 500 });
  }
}