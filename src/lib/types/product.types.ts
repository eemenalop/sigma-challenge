export interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    rating: number;
    stock: number;
    brand: string;
    images: string[];
}

export interface CreateProductDTO {
    title: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    brand: string;
    images: string[];
}

export interface UpdateProductDTO {
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    stock?: number;
    brand?: string;
    images?: string[];
}