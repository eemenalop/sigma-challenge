import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/services/productService';
import { validateProductId, validateUpdateProduct } from '@/lib/validators/productValidator';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const errors = validateProductId(id);
    
    if (errors.length > 0) {
      return NextResponse.json(
        errorResponse('Invalid product ID', errors),
        { status: 400 }
      );
    }

    const product = await getProductById(parseInt(id));
    
    if (!product) {
      return NextResponse.json(
        errorResponse('Product not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(product));
  } catch (error) {
    return NextResponse.json(
      errorResponse('Error fetching product'),
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const idErrors = validateProductId(id);
    if (idErrors.length > 0) {
      return NextResponse.json(
        errorResponse('Invalid product ID', idErrors),
        { status: 400 }
      );
    }

    const updateErrors = validateUpdateProduct(body);
    if (updateErrors.length > 0) {
      return NextResponse.json(
        errorResponse('Validation errors', updateErrors),
        { status: 400 }
      );
    }

    const product = await updateProduct(parseInt(id), body);
    
    if (!product) {
      return NextResponse.json(
        errorResponse('Product not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(product));
  } catch (error) {
    return NextResponse.json(
      errorResponse('Error updating product'),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const errors = validateProductId(id);
    
    if (errors.length > 0) {
      return NextResponse.json(
        errorResponse('Invalid product ID', errors),
        { status: 400 }
      );
    }

    const deleted = await deleteProduct(parseInt(id));
    
    if (!deleted) {
      return NextResponse.json(
        errorResponse('Product not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse({ message: 'Product deleted' }));
  } catch (error) {
    return NextResponse.json(
      errorResponse('Error deleting product'),
      { status: 500 }
    );
  }
}