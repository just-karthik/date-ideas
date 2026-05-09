import React from 'react';
import { Search } from 'lucide-react';
import { CATEGORIES, CATEGORIES_WITH_SUBS } from '@/data/date-ideas';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedSubcategory: string | null;
  setSelectedSubcategory: (subcategory: string | null) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory
}) => {
  const subcategories = selectedCategory
    ? CATEGORIES_WITH_SUBS[selectedCategory as keyof typeof CATEGORIES_WITH_SUBS]
    : [];

  const handleCategoryClick = (category: string | null) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(category);
      setSelectedSubcategory(null);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 pt-4 px-4">
      <div className="max-w-[480px] mx-auto space-y-2.5">

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
            <Search size={18} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Search date ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A1D96]/30 focus:border-[#4A1D96]/40 transition-all shadow-sm"
          />
        </div>

        {/* Category Chips — outline default, filled active */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-0.5">
          <button
            onClick={() => handleCategoryClick(null)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200",
              selectedCategory === null
                ? "bg-[#4A1D96] text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#4A1D96]/30 hover:text-[#4A1D96]"
            )}
          >
            All
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200",
                selectedCategory === category
                  ? "bg-[#4A1D96] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#4A1D96]/30 hover:text-[#4A1D96]"
              )}
            >
              {category.replace(" Dates", "")}
            </button>
          ))}
        </div>

        {/* Subcategory Chips — visible background for readability */}
        {selectedCategory && subcategories.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar animate-fade-slide-down bg-white/90 backdrop-blur-sm rounded-xl px-2 py-2 shadow-sm border border-gray-100">
            <button
              onClick={() => setSelectedSubcategory(null)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-200",
                selectedSubcategory === null
                  ? "bg-[#4A1D96] text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              )}
            >
              All
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? null : sub)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-200",
                  selectedSubcategory === sub
                    ? "bg-[#4A1D96] text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                )}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
