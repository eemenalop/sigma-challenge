import { Product } from '../types/product.types';
import {
  getAllProducts,
  searchProducts,
  getProductsByCategory,
} from './productService';

function paginate<T>(
  items: T[],
  page: number,
  limit: number
): { items: T[]; totalPages: number; totalItems: number } {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);

  if (page < 1) page = 1;
  if (page > totalPages && totalPages > 0) page = totalPages;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);

  return { items: paginatedItems, totalPages, totalItems };
}

export async function getAllProductsPaginated(
  page: number = 1,
  limit: number = 20
): Promise<{ products: Product[]; totalPages: number; totalItems: number }> {
  const allProducts = await getAllProducts();
  const { items, totalPages, totalItems } = paginate(allProducts, page, limit);
  return { products: items, totalPages, totalItems };
}

export async function searchProductsPaginated(
  reference: string,
  page: number = 1,
  limit: number = 20
): Promise<{ products: Product[]; totalPages: number; totalItems: number }> {
  const allProducts = await searchProducts(reference);
  const { items, totalPages, totalItems } = paginate(allProducts, page, limit);
  return { products: items, totalPages, totalItems };
}

export async function getProductsByCategoryPaginated(
  category: string,
  page: number = 1,
  limit: number = 20
): Promise<{ products: Product[]; totalPages: number; totalItems: number }> {
  const allProducts = await getProductsByCategory(category);
  const { items, totalPages, totalItems } = paginate(allProducts, page, limit);
  return { products: items, totalPages, totalItems };
}