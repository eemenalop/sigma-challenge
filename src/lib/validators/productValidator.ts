import { CreateProductDTO, UpdateProductDTO } from "../types/product.types";

export function validateCreateProduct(product: CreateProductDTO): string[] {
    const errors: string[] = [];
    if (!product.title || typeof product.title !== 'string' || product.title.trim() === '') {
        errors.push("Title is required");
    } else if (product.title.length < 3 || product.title.length > 60) {
        errors.push("Title must be between 3 and 60 characters long");
    }

    if (!product.description || typeof product.description !== 'string') {
        errors.push("Description is required");
    } else if (product.description.length > 500) {
        errors.push("Description must be less than 500 characters long");
    }

    if (!product.category || typeof product.category !== 'string') {
        errors.push("Category is required");
    }

    if (product.price === undefined || product.price === null || typeof product.price !== 'number') {
        errors.push("Price is required");
    } else if (product.price <= 0) {
        errors.push("Price must be greater than 0");
    }

    if (product.stock === undefined || product.stock === null || typeof product.stock !== 'number') {
        errors.push("Stock is required");
    } else if (product.stock <= 0) {
        errors.push("Stock must be greater than 0");
    } else if (!Number.isInteger(product.stock)) {
        errors.push("Stock must be an integer");
    }

    if (!product.brand || typeof product.brand !== 'string') {
        errors.push("Brand is required");
    } else if (product.brand.length > 60) {
        errors.push("Brand must be less than 60 characters long");
    }

    if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
        errors.push("Images are required");
    }
    return errors;
}

export function validateUpdateProduct(product: UpdateProductDTO): string[] {
    const errors: string[] = [];

    if (product.title !== undefined && (typeof product.title !== 'string' || product.title.trim() === '' || product.title.length < 3 || product.title.length > 60)) {
        errors.push("Title must be between 3 and 60 characters long");
    }

    if (product.description !== undefined && (typeof product.description !== 'string' || product.description.trim() === '' || product.description.length > 500)) {
        errors.push("Description must be less than 500 characters long");
    }

    if (product.category !== undefined && (typeof product.category !== 'string' || product.category.trim() === '' || product.category.length > 60)) {
        errors.push("Category must be less than 60 characters long");
    }

    if (product.price !== undefined && (typeof product.price !== 'number' || product.price <= 0)) {
        errors.push("Price must be greater than 0");
    }

    if (product.stock !== undefined) {
        if (typeof product.stock !== 'number' || product.stock <= 0) {
            errors.push("Stock must be greater than 0");
        } else if (!Number.isInteger(product.stock)) {
            errors.push("Stock must be an integer");
        }
    }

    if (product.brand !== undefined && (typeof product.brand !== 'string' || product.brand.trim() === '' || product.brand.length > 60)) {
        errors.push("Brand must be less than 60 characters long");
    }

    if (product.images !== undefined && (!Array.isArray(product.images) || product.images.length === 0)) {
        errors.push("Images must be a non-empty array of strings");
    }
    return errors;
}

export function validateProductId(id: string): string[] {
    const errors: string[] = [];
    
    if (typeof id !== 'string') {
        errors.push("ID must be a valid number");
        return errors;
    }

    const productId = parseInt(id);

    if (isNaN(productId)) {
        errors.push("ID must be a valid number");
    } else if (productId <= 0) {
        errors.push("ID must be greater than 0");
    }
    return errors;
}