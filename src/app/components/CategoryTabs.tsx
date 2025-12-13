'use client';

import { ChevronDownIcon } from '@heroicons/react/16/solid';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export default function CategoryTabs({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryTabsProps) {
  const tabs = [
    { name: 'All', value: null },
    ...categories.map(cat => ({ name: cat, value: cat }))
  ];

  return (
    <div>
      {/* Mobile: Select Dropdown */}
      <div className="grid grid-cols-1 sm:hidden">
        <select
          value={selectedCategory || 'all'}
          onChange={(e) => onCategorySelect(e.target.value === 'all' ? null : e.target.value)}
          aria-label="Select a category"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-gray-800/50 py-2 pl-3 pr-8 text-base text-gray-100 outline outline-1 -outline-offset-1 outline-white/10 *:bg-gray-800 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.value || 'all'}>
              {tab.name}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-400"
        />
      </div>

      {/* Desktop: Horizontal Scroll Tabs */}
      <div className="hidden sm:block overflow-x-auto">
        <nav aria-label="Categories" className="flex space-x-4 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => onCategorySelect(tab.value)}
              className={`rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition ${
                selectedCategory === tab.value
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}