import { CreateProductDTO, UpdateProductDTO } from "../types/product.types";

export function validateCreateProduct(product: CreateProductDTO): string[] {
    const errors: string[] = [];
    if (!product.title || product.title.trim() === '') {
        errors.push("Title is required");
    }else if(product.title.length < 3 || product.title.length > 60){
        errors.push("Title must be between 3 and 60 characters long");
    }

    if (!product.description) {
        errors.push("Description is required");
    }else if(product.description.length > 500){
        errors.push("Description must be less than 500 characters long");
    }

    if (!product.category) {
        errors.push("Category is required");
    }

    if (product.price === undefined || product.price === null) {
        errors.push("Price is required");
    }else if(product.price <= 0){
        errors.push("Price must be greater than 0");
    }

    if (product.stock === undefined || product.stock === null) {
        errors.push("Stock is required");
    }else if(product.stock <= 0){
        errors.push("Stock must be greater than 0");
    } else if(!Number.isInteger(product.stock)){
        errors.push("Stock must be an integer");
    }

    if (!product.brand) {
        errors.push("Brand is required");
    }else if(product.brand.length > 60){
        errors.push("Brand must be less than 60 characters long");
    }

    if (!product.images) {
        errors.push("Images are required");
    }else if(!Array.isArray(product.images) || product.images.length === 0){
        errors.push("Images must be a non-empty array of strings");
    }
    return errors;
}

export function validateUpdateProduct(product: UpdateProductDTO): string[] {
    const errors: string[] = [];

    if(product.title !== undefined &&(product.title.length < 3 || product.title.length > 60)){
        errors.push("Title must be between 3 and 60 characters long");
    }

    if(product.description !== undefined && product.description.length > 500){
        errors.push("Description must be less than 500 characters long");
    }

    if(product.category !== undefined && product.category.length > 60){
        errors.push("Category must be less than 60 characters long");
    }

    if(product.price !== undefined && product.price <= 0){
        errors.push("Price must be greater than 0");
    }

    if(product.stock !== undefined){
        if(product.stock <= 0){
            errors.push("Stock must be greater than 0");
        }else if(!Number.isInteger(product.stock)){
            errors.push("Stock must be an integer");
        }
    }
    if(product.brand !== undefined && product.brand.length > 60){
        errors.push("Brand must be less than 60 characters long");
    }
    if(product.images !== undefined && (!Array.isArray(product.images) || product.images.length === 0)){
        errors.push("Images must be a non-empty array of strings");
    }
    return errors;
}

export function validateProductId(id: string): string[] {
    const errors: string[] = [];
    const productId = parseInt(id);

    if(isNaN(productId)){ 
        errors.push("ID must be a valid number");
    }else if(productId <= 0){
        errors.push("ID must be greater than 0");
    }
    return errors;
}