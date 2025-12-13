import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/services/productService';
import { validateCreateProduct } from '@/lib/validators/productValidator';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

//Get all products
export async function GET(){
    try {
        const products = await getAllProducts();
        return NextResponse.json(successResponse(products));
    } catch (error) {
        return NextResponse.json(errorResponse('Failed to get products'), { status: 500 });
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
        return NextResponse.json(successResponse(newProduct), { status: 201 });
    }catch(error){
        return NextResponse.json(errorResponse('Failed to create product'), { status: 500 });
    }
}