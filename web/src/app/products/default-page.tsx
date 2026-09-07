import Link from 'next/link';
import { PRODUCTS_DATA, type Product } from '@/data/products';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-600">
            Women's Sweatshirts & Hoodies
          </h1>
          <p className="text-zinc-600 mt-2">
            Stay comfortable and stylish with our collection of women's hoodies
            and sweatshirts.
          </p>
        </div>

        {/* Filters and Products Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="space-y-6">
              {/* Product Type */}
              <div>
                <h3 className="font-medium text-zinc-600 mb-3">Product Type</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      defaultChecked
                      aria-label="Hoodies filter"
                    />
                    <span className="text-sm text-zinc-600">Hoodies</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Crew Neck filter"
                    />
                    <span className="text-sm text-zinc-600">Crew Neck</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Full Zip filter"
                    />
                    <span className="text-sm text-zinc-600">Full Zip</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Sweatshirts filter"
                    />
                    <span className="text-sm text-zinc-600">Sweatshirts</span>
                  </label>
                </div>
              </div>

              {/* Sports */}
              <div>
                <h3 className="font-medium text-zinc-600 mb-3">Sports</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Lifestyle filter"
                    />
                    <span className="text-sm text-zinc-600">Lifestyle</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Running filter"
                    />
                    <span className="text-sm text-zinc-600">Running</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Training & Gym filter"
                    />
                    <span className="text-sm text-zinc-600">
                      Training & Gym
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Basketball filter"
                    />
                    <span className="text-sm text-zinc-600">Basketball</span>
                  </label>
                </div>
              </div>

              {/* Fit */}
              <div>
                <h3 className="font-medium text-zinc-600 mb-3">Fit</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Oversized filter"
                    />
                    <span className="text-sm text-zinc-600">Oversized</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Standard filter"
                    />
                    <span className="text-sm text-zinc-600">Standard</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Slim filter"
                    />
                    <span className="text-sm text-zinc-600">Slim</span>
                  </label>
                </div>
              </div>

              {/* Size */}
              <div>
                <h3 className="font-medium text-zinc-600 mb-3">Size</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="XS size filter"
                    />
                    <span className="text-sm text-zinc-600">XS (0-2)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="S size filter"
                    />
                    <span className="text-sm text-zinc-600">S (4-6)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="M size filter"
                    />
                    <span className="text-sm text-zinc-600">M (8-10)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="L size filter"
                    />
                    <span className="text-sm text-zinc-600">L (12-14)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="XL size filter"
                    />
                    <span className="text-sm text-zinc-600">XL (16-18)</span>
                  </label>
                </div>
              </div>

              {/* Color */}
              <div>
                <h3 className="font-medium text-zinc-600 mb-3">Color</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Black color filter"
                    />
                    <span className="text-sm text-zinc-600">Black</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="White color filter"
                    />
                    <span className="text-sm text-zinc-600">White</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Grey color filter"
                    />
                    <span className="text-sm text-zinc-600">Grey</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Pink color filter"
                    />
                    <span className="text-sm text-zinc-600">Pink</span>
                  </label>
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="font-medium text-zinc-600 mb-3">
                  Shop by Price
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Price 0-50 filter"
                    />
                    <span className="text-sm text-zinc-600">$0 - $50</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Price 50-100 filter"
                    />
                    <span className="text-sm text-zinc-600">$50 - $100</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      aria-label="Price 100-150 filter"
                    />
                    <span className="text-sm text-zinc-600">$100 - $150</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count and Sort */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-zinc-600">
                Showing {PRODUCTS_DATA.length} results
              </p>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                aria-label="Sort products"
              >
                <option>Featured</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {PRODUCTS_DATA.map((product) => (
                <Link
                  key={`product-${product.id}`}
                  href={`/product/${product.id}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-3">
                    {/* Main Image */}
                    <img
                      src={product.images[0]}
                      alt={`${product.name} - main view`}
                      className="w-full h-80 object-cover transition-opacity duration-300 group-hover:opacity-0"
                    />

                    {/* Hover Image */}
                    <img
                      src={product.images[1] || product.images[0]}
                      alt={`${product.name} - alternate view`}
                      className="w-full h-80 object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />

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
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-label="Heart icon"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                        aria-label="Share product"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-label="Share icon"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-zinc-600 group-hover:underline">
                      {product.name}
                    </h3>
                    <p className="text-xs text-zinc-600">{product.category}</p>

                    {/* Price */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-zinc-600">
                        ${product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-zinc-600 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Colors */}
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-zinc-600">
                        {product.colors} Colors
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, starIndex) => (
                          <svg
                            key={`star-${product.id}-${starIndex}`}
                            className={`w-3 h-3 ${starIndex < Math.floor(product.rating) ? 'text-yellow-400' : 'text-zinc-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-label={`${starIndex < Math.floor(product.rating) ? 'Filled' : 'Empty'} star ${starIndex + 1}`}
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-zinc-600">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <button
                type="button"
                className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Load More
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
