import { CreateProductDTO, UpdateProductDTO } from "../types/product.types";

export function validateCreateProduct(product: CreateProductDTO): string[] {
    const errors: string[] = [];
    if (!product.title) {
        errors.push("Title is required");
    }
    if(product.title.length < 3 || product.title.length > 60){
        errors.push("Title must be between 3 and 60 characters long");
    }
    if (!product.description) {
        errors.push("Description is required");
    }
    if(product.description.length > 500){
        errors.push("Description must be less than 500 characters long");
    }
    if (!product.category) {
        errors.push("Category is required");
    }
    if (!product.price) {
        errors.push("Price is required");
    }
    if(product.price <= 0){
        errors.push("Price must be greater than 0");
    }
    if (!product.stock) {
        errors.push("Stock is required");
    }
    if(product.stock <= 0){
        errors.push("Stock must be greater than 0");
    }
    if (!product.brand) {
        errors.push("Brand is required");
    }
    if(product.brand.length > 60){
        errors.push("Brand must be less than 60 characters long");
    }
    if (!product.images) {
        errors.push("Images are required");
    }
    if(product.images.length === 0){
        errors.push("Images must be an array of strings");
    }
    return errors;
}

export function validateUpdateProduct(product: UpdateProductDTO): string[] {
    const errors: string[] = [];
    if(product.title && (product.title.length < 3 || product.title.length > 60)){
        errors.push("Title must be between 3 and 60 characters long");
    }
    if(product.description && product.description.length > 500){
        errors.push("Description must be less than 500 characters long");
    }
    if(product.category && product.category.length > 60){
        errors.push("Category must be less than 60 characters long");
    }
    if(product.price && product.price <= 0){
        errors.push("Price must be greater than 0");
    }
    if(product.stock && product.stock <= 0){
        errors.push("Stock must be greater than 0");
    }
    if(product.brand && product.brand.length > 60){
        errors.push("Brand must be less than 60 characters long");
    }
    if(product.images && product.images.length === 0){
        errors.push("Images must be an array of strings");
    }
    return errors;
}

export function validateProductId(id: string): string[] {
    const errors: string[] = [];
    const productId = parseInt(id);

    if (!productId) {
        errors.push("ID is required");
    }
    if(isNaN(productId)){
        errors.push("ID must be a number");
    }
    if(productId <= 0){
        errors.push("ID must be greater than 0");
    }
    return errors;
}