'use client';

import { useState, useEffect } from 'react';
import { Product, UpdateProductDTO } from '@/lib/types/product.types';
import Button from './Button';
import { validateUpdateProduct } from '@/lib/validators/productValidator';

interface UpdateProductModalProps {
  product: Product;
  onClose: () => void;
  onUpdate: (updatedProduct: Product) => void;
}

interface ValidationError {
  [key: string]: string;
}

export default function UpdateProductModal({ product, onClose, onUpdate }: UpdateProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  
  const [formData, setFormData] = useState<UpdateProductDTO>({
    title: product.title,
    description: product.description,
    category: product.category,
    price: product.price,
    stock: product.stock,
    brand: product.brand,
    images: product.images,
  });

  useEffect(() => {
    fetchCategories();
    if (product.images && product.images.length > 0) {
      setImageUrl(product.images[0]);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setFormData(prev => ({
      ...prev,
      images: url.trim() ? [url] : product.images
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const errors = validateUpdateProduct(formData);
    if (errors.length > 0) {
      const errorMap: ValidationError = {};
      errors.forEach(error => {
        const fieldMatch = error.match(/^(\w+)/);
        if (fieldMatch) {
          errorMap[fieldMatch[1].toLowerCase()] = error;
        } else {
          errorMap['form'] = error;
        }
      });
      setValidationErrors(errorMap);
      return;
    }

    setIsLoading(true);
    setValidationErrors({});
    
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          const errorMap: ValidationError = {};
          data.details.forEach((error: string) => {
            const fieldMatch = error.match(/^(\w+)/);
            if (fieldMatch) {
              errorMap[fieldMatch[1].toLowerCase()] = error;
            }
          });
          setValidationErrors(errorMap);
        } else {
          setValidationErrors({ form: data.error || 'Error updating product' });
        }
        return;
      }

      onUpdate(data.data);
    } catch (error) {
      setValidationErrors({ form: 'Error updating product. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-white mb-6">Update Product</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {validationErrors.form && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg">
              {validationErrors.form}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
            />
            {validationErrors.description && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-white mb-2">
                Brand
              </label>
              <input
                id="brand"
                name="brand"
                type="text"
                value={formData.brand}
                onChange={handleInputChange}
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
              />
              {validationErrors.brand && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.brand}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {validationErrors.category && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.category}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-white mb-2">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price || ''}
                onChange={handleInputChange}
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
              />
              {validationErrors.price && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.price}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-white mb-2">
                Stock
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock || ''}
                onChange={handleInputChange}
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
              />
              {validationErrors.stock && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.stock}</p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-white mb-2">
              Image URL
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={handleImageChange}
              placeholder="https://example.com/image.jpg"
              className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
            />
            {validationErrors.images && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.images}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Updating...' : 'Update Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
