import { Product, CreateProductDTO, UpdateProductDTO } from "../types/product.types";

const DUMMYJSON_PRODUCTS_URL = "https://dummyjson.com/products";

interface DUMMYJSONProduct {
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
//Transform the DUMMYJSON product to the Product type
function transformDUMMYJSON(apiProduct: DUMMYJSONProduct): Product {
    return {
        id: apiProduct.id,
        title: apiProduct.title,
        description: apiProduct.description,
        category: apiProduct.category,
        price: apiProduct.price,
        rating: apiProduct.rating,
        stock: apiProduct.stock,
        brand: apiProduct.brand,
        images: apiProduct.images,
    }
}
    //get all products
    export async function getAllProducts(): Promise<Product[]> {
        const response = await fetch(DUMMYJSON_PRODUCTS_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} cannot fetch products`);
        }

        const data = await response.json();
        return data.products.map(transformDUMMYJSON);
    }
    //get product by id
    export async function getProductById(id: number): Promise<Product | null>{
        const response = await fetch(`${DUMMYJSON_PRODUCTS_URL}/${id}`);
        if(response.status === 404){
            return null;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} cannot fetch product by id`);
        }

        const data = await response.json();
        return transformDUMMYJSON(data);
    }

    //Search product by reference
    export async function searchProducts(reference: string): Promise<Product[]> {
        if(!reference || reference.trim() === ''){
            throw new Error('reference is required and cannot be empty');
        }

        const response = await fetch(`${DUMMYJSON_PRODUCTS_URL}/search?q=${encodeURIComponent(reference)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} cannot search products by reference`);
        }

        const data = await response.json();
        return data.products.map(transformDUMMYJSON);
    }

    //get products by category
    export async function getProductsByCategory(category: string): Promise<Product[]> {
        if(!category || category.trim() === ''){
            throw new Error('category is required and cannot be empty');
        }

        const response = await fetch(`${DUMMYJSON_PRODUCTS_URL}/category/${encodeURIComponent(category)}`);

        if(response.status === 404){
            return [];
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} cannot fetch products by category`);
        }

        const data = await response.json();
        return data.products.map(transformDUMMYJSON);
    }

    //create product
    export async function createProduct(data: CreateProductDTO): Promise<Product> {
        const response = await fetch(`${DUMMYJSON_PRODUCTS_URL}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} cannot create product`);
        }

        const createdProduct = await response.json();
        return {
            id: createdProduct.id,
            title: createdProduct.title,
            description: createdProduct.description,
            category: createdProduct.category,
            price: createdProduct.price,
            rating: 0,
            stock: createdProduct.stock,
            brand: createdProduct.brand,
            images: createdProduct.images,
        }
    }
    //update product
    export async function updateProduct(
        id: number,
        data: UpdateProductDTO
    ): Promise<Product | null> {
        const currentProduct = await getProductById(id);
        if(!currentProduct){
            return null;
        }
        const response = await fetch(`${DUMMYJSON_PRODUCTS_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if(response.status === 404){
            return null;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} cannot update product`);
        }
        return {
            ...currentProduct,
            title: data.title !== undefined ? data.title : currentProduct.title,
            description: data.description !== undefined ? data.description : currentProduct.description,
            category: data.category !== undefined ? data.category : currentProduct.category,
            price: data.price !== undefined ? data.price : currentProduct.price,
            stock: data.stock !== undefined ? data.stock : currentProduct.stock,
            brand: data.brand !== undefined ? data.brand : currentProduct.brand,
            images: data.images !== undefined ? data.images : currentProduct.images,
        }
    }
    //delete product
    export async function deleteProduct(id: number): Promise<boolean> {
        const response = await fetch(`${DUMMYJSON_PRODUCTS_URL}/${id}`, {
          method: 'DELETE',
        });
        if (response.status === 404) {
          return false;
        }
      
        if (!response.ok) {
          throw new Error(
            `Error HTTP ${response.status}: No se pudo eliminar el producto ${id}`
          );
        }
      
        return true;
      }

      //get all categories
    export async function getAllCategories(): Promise<string[]> {
    const response = await fetch(`${DUMMYJSON_PRODUCTS_URL}/category-list`);
    
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} cannot fetch categories`
      );
    }
  
    const categories: string[] = await response.json();
    return categories;
  }
