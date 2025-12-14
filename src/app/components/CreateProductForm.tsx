'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';
import { validateCreateProduct } from '@/lib/validators/productValidator';
import { CreateProductDTO } from '@/lib/types/product.types';
import { useNotification } from '../contexts/NotificationContext';

interface ValidationError {
  [key: string]: string;
}

export default function CreateProductForm() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  
  const [formData, setFormData] = useState<CreateProductDTO>({
    title: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    brand: '',
    images: [],
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/products/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
    
    // Clear error for this field when user starts typing
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
      images: url.trim() ? [url] : []
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form data
    const errors = validateCreateProduct(formData);
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
      const response = await fetch('/api/products', {
        method: 'POST',
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
          setValidationErrors({ form: data.error || 'Error creating product' });
        }
        return;
      }

      showNotification('success', 'Product created successfully!', 'Redirecting to home...');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      showNotification('error', 'Error creating product', 'Please try again later.');
      setValidationErrors({ form: 'Error creating product. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* General Errors */}
      {validationErrors.form && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg">
          {validationErrors.form}
        </div>
      )}

      {/* Product Information */}
      <div className="border-b border-white/10 pb-12">
        <h2 className="text-base/7 font-semibold text-white">Product Information</h2>
        <p className="mt-1 text-sm/6 text-gray-400">Enter the details of your product.</p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {/* Title */}
          <div className="sm:col-span-3">
            <label htmlFor="title" className="block text-sm/6 font-medium text-white">
              Title
            </label>
            <div className="mt-2">
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.title}</p>
            )}
          </div>

          {/* Brand */}
          <div className="sm:col-span-3">
            <label htmlFor="brand" className="block text-sm/6 font-medium text-white">
              Brand
            </label>
            <div className="mt-2">
              <input
                id="brand"
                name="brand"
                type="text"
                value={formData.brand}
                onChange={handleInputChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
            {validationErrors.brand && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.brand}</p>
            )}
          </div>

          {/* Price */}
          <div className="sm:col-span-2">
            <label htmlFor="price" className="block text-sm/6 font-medium text-white">
              Price
            </label>
            <div className="mt-2">
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price || ''}
                onChange={handleInputChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
            {validationErrors.price && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.price}</p>
            )}
          </div>

          {/* Stock */}
          <div className="sm:col-span-2">
            <label htmlFor="stock" className="block text-sm/6 font-medium text-white">
              Stock
            </label>
            <div className="mt-2">
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock || ''}
                onChange={handleInputChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
            {validationErrors.stock && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.stock}</p>
            )}
          </div>

          {/* Category */}
          <div className="sm:col-span-2">
            <label htmlFor="category" className="block text-sm/6 font-medium text-white">
              Category
            </label>
            <div className="mt-2">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={categoriesLoading}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                </option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {validationErrors.category && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.category}</p>
            )}
          </div>

          {/* Description */}
          <div className="col-span-full">
            <label htmlFor="description" className="block text-sm/6 font-medium text-white">
              Description
            </label>
            <div className="mt-2">
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
            {validationErrors.description && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="border-b border-white/10 pb-12">
        <h2 className="text-base/7 font-semibold text-white">Product Image</h2>
        <p className="mt-1 text-sm/6 text-gray-400">Add the image URL for your product.</p>

        <div className="mt-10">
          {/* Image URL Input */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm/6 font-medium text-white">
              Image URL
            </label>
            <div className="mt-2">
              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={handleImageChange}
                placeholder="https://example.com/image.jpg"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
            {validationErrors.images && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.images}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-x-6">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}