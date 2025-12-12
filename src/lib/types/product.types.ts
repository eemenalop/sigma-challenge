export interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    rating: number;
    stock: number;
    tags: string[];
    brand: string;
    reviews: {
        rating: number;
        comment: string;
        date: string;
    }[];
    images: string[];
}

export interface CreateProductDTO {
    title: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    tags: string[];
    brand: string;
    images: string[];
}

export interface UpdateProductDTO {
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    stock?: number;
    tags?: string[];
    brand?: string;
    images?: string[];
}