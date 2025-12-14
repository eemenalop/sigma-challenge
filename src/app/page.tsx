'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/lib/types/product.types';
import CategoryTabs from './components/CategoryTabs';
import SearchBar from './components/SearchBar';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';
import { useRouter } from 'next/navigation';
import Button from './components/Button';

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/products/categories');
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      let url = `/api/products?page=${currentPage}&limit=20`;
      
      if (selectedCategory) {
        url = `/api/products/category/${selectedCategory}?page=${currentPage}&limit=20`;
      } else if (searchQuery) {
        url = `/api/products/search?q=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=20`;
      }

      const res = await fetch(url);
      const json = await res.json();
      
      if (json.success) {
        setProducts(json.data);
        setPagination(json.pagination);
      } else {
        setError(json.error || 'Error fetching products');
      }
    } catch (err) {
      setError('Error fetching products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleCreateProduct = () => {
    router.push('/products/create');
  };

  return (
    <div className="min-h-screen bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-pretty text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Products
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Browse our collection of products
          </p>
        </div>

        {/* Search and Create Button */}
        <div className="mt-10 flex gap-4">
          <SearchBar value={searchQuery} onChange={handleSearch} />
          <Button
            onClick={handleCreateProduct}
            variant="primary"
            size="md"
          >
            Create Product
        </Button>
        </div>

        {/* Category Tabs */}
        <div className="mt-8">
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Products Grid */}
        <ProductGrid products={products} isLoading={loading} />

        {/* Pagination */}
        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}