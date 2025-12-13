'use client';

import { Product } from '@/lib/types/product.types';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${product.id}`);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-400' };
    if (stock < 10) return { text: `Low Stock (${stock})`, color: 'text-yellow-400' };
    return { text: `In Stock (${stock})`, color: 'text-green-400' };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer group"
    >
      {/* Image Container */}
      <div className="aspect-[14/13] w-full rounded-2xl overflow-hidden bg-gray-800 mb-6">
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center group-hover:from-gray-600 group-hover:to-gray-800 transition-colors">
          <span className="text-gray-500">No image</span>
        </div>
      </div>

      {/* Product Info */}
      <h3 className="text-lg font-semibold tracking-tight text-white line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors">
        {product.title}
      </h3>

      {/* Price */}
      <p className="text-base font-bold text-indigo-400 mb-2">
        ${product.price.toFixed(2)}
      </p>

      {/* Stock Status */}
      <p className={`text-sm ${stockStatus.color} mb-2`}>
        {stockStatus.text}
      </p>

      {/* Rating */}
      <p className="text-sm text-gray-300">
        ⭐ {product.rating.toFixed(1)}
      </p>
    </div>
  );
}