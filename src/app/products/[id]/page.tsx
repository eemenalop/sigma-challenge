'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/lib/types/product.types';
import Button from '@/app/components/Button';
import UpdateProductModal from '@/app/components/UpdateProductModal';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { useNotification } from '@/app/contexts/NotificationContext';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { showNotification } = useNotification();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.data);
      } else {
        setError(data.error || 'Product not found');
      }
    } catch (err) {
      setError('Error fetching product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        showNotification('success', 'Product deleted successfully!', 'Redirecting to home...');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        showNotification('error', 'Error deleting product', data.error);
      }
    } catch (error) {
      showNotification('error', 'Error deleting product', 'Please try again later.');
    }
  };

  const handleUpdate = (updatedProduct: Product) => {
    setProduct(updatedProduct);
    setShowUpdateModal(false);
    showNotification('success', 'Product updated successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <Button onClick={() => router.push('/')} variant="primary">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <div className="min-h-screen bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            onClick={() => router.push('/')}
            variant="secondary"
            size="sm"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2 inline" />
            Back to Home
          </Button>
        </div>

        {/* Product Details */}
        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg outline outline-1 -outline-offset-1 outline-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="aspect-square w-full bg-gray-700 relative">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-white mb-4">{product.title}</h1>
              
              <div className="space-y-4 mb-8">
                <div>
                  <span className="text-gray-400 text-sm">Description</span>
                  <p className="text-white">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm">Price</span>
                    <p className="text-2xl font-bold text-indigo-400">${product.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Stock</span>
                    <p className="text-white font-semibold">{product.stock} units</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm">Brand</span>
                    <p className="text-white">{product.brand}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Category</span>
                    <p className="text-white capitalize">{product.category}</p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">Rating</span>
                  <p className="text-white">⭐ {product.rating.toFixed(1)} / 5.0</p>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">Product ID</span>
                  <p className="text-white">#{product.id}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowUpdateModal(true)}
                  variant="primary"
                  size="md"
                  className="flex-1"
                >
                  Update Product
                </Button>
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  variant="danger"
                  size="md"
                  className="flex-1"
                >
                  Delete Product
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-semibold text-white">{product.title}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="secondary"
                size="md"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                size="md"
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && product && (
        <UpdateProductModal
          product={product}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
