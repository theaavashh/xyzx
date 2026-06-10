import Link from 'next/link';
import type { Product } from '@/data/products';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="py-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        You Might Also Like
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={`related-${product.id}`}
            href={`/product/${product.id}`}
            className="group"
          >
            <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-3">
              {/* Main Image */}
              <img
                src={product.images[0]}
                alt={`${product.name} - main view`}
                className="w-full h-64 object-cover transition-opacity duration-300 group-hover:opacity-0"
              />

              {/* Hover Image */}
              {product.images[1] && (
                <img
                  src={product.images[1]}
                  alt={`${product.name} - alternate view`}
                  className="w-full h-64 object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              )}

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-2 left-2">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded ${
                      product.badge === 'Best Seller'
                        ? 'bg-black text-white'
                        : product.badge === 'New'
                          ? 'bg-green-600 text-white'
                          : product.badge === 'Sale'
                            ? 'bg-red-600 text-white'
                            : product.badge === 'Sustainable'
                              ? 'bg-green-700 text-white'
                              : 'bg-gray-800 text-white'
                    }`}
                  >
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Quick Actions */}
              <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button
                  type="button"
                  className="bg-white rounded-full p-2 mb-2 shadow-md hover:bg-gray-100"
                  aria-label="Add to favorites"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-900 group-hover:underline">
                {product.name}
              </h3>
              <p className="text-xs text-gray-600">{product.category}</p>

              {/* Price */}
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => { e.preventDefault(); }}
                className="w-full py-2 text-sm font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </button>

              {/* Colors */}
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-600">
                  {product.colors} Colors
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, starIndex) => (
                    <svg
                      key={`star-${product.id}-${starIndex}`}
                      className={`w-3 h-3 ${starIndex < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  ({product.reviews})
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Products Button */}
      <div className="mt-8 text-center">
        <Link
          href="/products"
          className="inline-block border border-gray-300 text-gray-700 py-2 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
}
