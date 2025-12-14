// src/app/products/create/page.tsx
import CreateProductForm from '@/app/components/CreateProductForm';

export default function CreateProductPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-pretty text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Create New Product
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Fill in the details below to create a new product.
          </p>
        </div>

        <CreateProductForm />
      </div>
    </div>
  );
}