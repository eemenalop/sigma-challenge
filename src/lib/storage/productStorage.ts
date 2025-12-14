import { Product } from '../types/product.types';
import fs from 'fs/promises';
import path from 'path';

class ProductStorage {
  private products: Product[] = [];
  private nextId: number = 1000;
  private dataPath = path.join(process.cwd(), 'data', 'products.json');
  private initialized = false;

  // Inicializar: cargar desde archivo si existe
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      const data = await fs.readFile(this.dataPath, 'utf-8');
      const loadedProducts = JSON.parse(data) as Product[];
      this.products = loadedProducts;
      
      // Actualizar nextId al máximo ID existente + 1
      if (loadedProducts.length > 0) {
        const maxId = Math.max(...loadedProducts.map(p => p.id));
        this.nextId = maxId >= 1000 ? maxId + 1 : 1000;
      }
      
      this.initialized = true;
    } catch (error) {
      // Si el archivo no existe, inicializa vacío
      this.products = [];
      this.initialized = true;
    }
  }

  // Guardar al archivo JSON
  private async saveToFile(): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.dataPath), { recursive: true });
      await fs.writeFile(this.dataPath, JSON.stringify(this.products, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving to file:', error);
    }
  }

  // Agregar producto
  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    await this.initialize();
    
    const newProduct: Product = {
      ...product,
      id: this.nextId++,
    };
    this.products.push(newProduct);
    
    await this.saveToFile();
    return newProduct;
  }

  // Obtener todos
  async getAllProducts(): Promise<Product[]> {
    await this.initialize();
    return [...this.products];
  }

  // Obtener por ID
  async getProductById(id: number): Promise<Product | null> {
    await this.initialize();
    return this.products.find(p => p.id === id) || null;
  }

  // Actualizar
  async updateProduct(id: number, updates: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
    await this.initialize();
    
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.products[index] = { ...this.products[index], ...updates };
    
    await this.saveToFile();
    return this.products[index];
  }

  // Eliminar
  async deleteProduct(id: number): Promise<boolean> {
    await this.initialize();
    
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    
    await this.saveToFile();
    return true;
  }
}

export const productStorage = new ProductStorage();