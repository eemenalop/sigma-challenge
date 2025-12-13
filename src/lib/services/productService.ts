import { Product, CreateProductDTO, UpdateProductDTO } from "../types/product.types";
import { productStorage } from "../storage/productStorage";

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
        if(productStorage.getAllProducts().length === 0){
            const response = await fetch(`${DUMMYJSON_PRODUCTS_URL}?limit=0&skip=0`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} cannot fetch products`);
            }
            const data = await response.json();
            const products = data.products.map(transformDUMMYJSON);
            products.forEach((p: Product) => productStorage.addProduct(p));
        }
        return productStorage.getAllProducts();
    }

    //get product by id
    export async function getProductById(id: number): Promise<Product | null>{
        let product = productStorage.getProductById(id);
        if(product) return product;
        
        // If not in storage, fetch from DummyJSON
        const response = await fetch(`${DUMMYJSON_PRODUCTS_URL}/${id}`);
        if(response.status === 404){
            return null;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} cannot fetch product by id`);
        }
    
        const data = await response.json();
        const transformed = transformDUMMYJSON(data);
        productStorage.addProduct(transformed);
        return transformed;
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
        const dummyResults = data.products.map(transformDUMMYJSON);
        
        const allStorageProducts = productStorage.getAllProducts();
        const storageResults = allStorageProducts.filter(p =>
            p.title.toLowerCase().includes(reference.toLowerCase()) ||
            p.description.toLowerCase().includes(reference.toLowerCase())
        );

        //remove duplicates
        const combined = [...dummyResults];
        storageResults.forEach(p => {
            if(!combined.find(item => item.id === p.id)) {
                combined.push(p);
            }
        });
    
        return combined;
    }

    //get products by category
    export async function getProductsByCategory(category: string): Promise<Product[]> {
    if(!category || category.trim() === ''){
        throw new Error('category is required and cannot be empty');
    }

    const response = await fetch(`${DUMMYJSON_PRODUCTS_URL}/category/${encodeURIComponent(category)}`);
    
    let dummyResults: Product[] = [];
    if(response.status !== 404){
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} cannot fetch products by category`);
        }
        const data = await response.json();
        dummyResults = data.products.map(transformDUMMYJSON);
    }

    const allStorageProducts = productStorage.getAllProducts();
    const storageResults = allStorageProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
    );

    //remove duplicates
    const combined = [...dummyResults];
    storageResults.forEach(p => {
        if(!combined.find(item => item.id === p.id)) {
            combined.push(p);
        }
    });

    return combined;
}

    //create product
    export async function createProduct(data: CreateProductDTO): Promise<Product> {
        const newProduct: Product = {
            id: 1000 + Math.random() * 9000,
            title: data.title,
            description: data.description,
            category: data.category,
            price: data.price,
            rating: 0,
            stock: data.stock,
            brand: data.brand,
            images: data.images,
        };
        
        productStorage.addProduct(newProduct);
        return newProduct;
    }
    //update product
    export async function updateProduct(
        id: number,
        data: UpdateProductDTO
    ): Promise<Product | null> {
        const updated = productStorage.updateProduct(id, data);
        return updated;
    }
    //delete product
    export async function deleteProduct(id: number): Promise<boolean> {
        const deleted = productStorage.deleteProduct(id);
        return deleted;
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
