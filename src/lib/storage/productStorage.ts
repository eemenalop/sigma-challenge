import { Product } from '../types/product.types';

class ProductStorage {
  private products: Product[] = [];
  private nextId: number = 1000;

  constructor() {
    this.nextId = 1000;
  }

  // Agregar producto
  addProduct(product: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...product,
      id: this.nextId++,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  // Obtener todos
  getAllProducts(): Product[] {
    return [...this.products];
  }

  // Obtener por ID
  getProductById(id: number): Product | null {
    return this.products.find(p => p.id === id) || null;
  }

  // Actualizar
  updateProduct(id: number, updates: Partial<Omit<Product, 'id'>>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  // Eliminar
  deleteProduct(id: number): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    return true;
  }
}
export const productStorage = new ProductStorage();