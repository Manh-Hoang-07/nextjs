"use client";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      {/* Product Image Skeleton */}
      <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden">
        <div className="h-64 w-full bg-gray-200" />
      </div>

      {/* Product Info Skeleton */}
      <div className="p-4">
        {/* Product Name Skeleton */}
        <div className="h-6 bg-gray-200 rounded mb-2" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />

        {/* Categories Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />

        {/* Price Skeleton */}
        <div className="flex items-baseline space-x-2 mb-3">
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>

        {/* Stock Status Skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="px-4 pb-4">
        <div className="h-10 bg-gray-200 rounded-lg w-full" />
      </div>
    </div>
  );
}

