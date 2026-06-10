import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getProductById, PRODUCTS_DATA, type Product } from '@/data/products';
import ProductReviews from '@/components/ProductReviews';

export const dynamic = 'force-static';
export const revalidate = 300;

export async function generateStaticParams() {
  return PRODUCTS_DATA.map((product) => ({
    id: product.id.toString(),
  }));
}

const fetchProductById = cache(async (id: number) => {
  return getProductById(id);
});

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  // Handle the params.id Promise properly for Next.js 16.1.1
  const resolvedParams = await Promise.resolve(params);
  const productId = parseInt(resolvedParams.id);
  const product = getProductById(productId);

  if (!product) {
    return notFound();
  }

  // Get related products (same category, excluding current product)
  const relatedProducts = PRODUCTS_DATA.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-gray-700">
                Products
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer hover:opacity-75 border-2 border-transparent hover:border-gray-300"
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details and Actions */}
          <div className="space-y-8">
            {/* Product Header */}
            <div>
              <span className="text-sm text-gray-500">{product.category}</span>
              <h1 className="text-4xl font-bold text-gray-900 mt-2">
                {product.name}
              </h1>

              {/* Rating and Reviews */}
              <div className="flex items-center mt-4 space-x-4">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={`star-${product.id}-${i}`}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                {product.sku && (
                  <span className="text-sm text-gray-500">
                    SKU: {product.sku}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Color Options */}
            {product.colorOptions && product.colorOptions.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Color: Black
                </h3>
                <div className="flex space-x-3">
                  {product.colorOptions.map((color, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-full border-2 ${index === 0 ? 'border-gray-900' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
                      style={{ backgroundColor: color }}
                      aria-label={`Color option ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Size</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className="py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                <Link href="#" className="underline hover:no-underline">
                  Size Guide
                </Link>
              </p>
            </div>

            {/* Add to Cart and Buy Now Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Add to Cart
              </button>
              <Link
                href="/checkout"
                className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Buy Now
              </Link>
            </div>

            {/* Product Description */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Product Details
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li
                      key={`feature-${product.id}-${index}`}
                      className="flex items-start text-sm text-gray-600"
                    >
                      <svg
                        className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Product Badges */}
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  product.badge === 'Best Seller'
                    ? 'bg-yellow-100 text-yellow-800'
                    : product.badge === 'New'
                      ? 'bg-green-100 text-green-800'
                      : product.badge === 'Sale'
                        ? 'bg-red-100 text-red-800'
                        : product.badge === 'Sustainable'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                }`}
              >
                {product.badge}
              </span>
              {product.isNew && (
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                  NEW ARRIVAL
                </span>
              )}
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span className="text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="text-gray-600">Easy Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-600">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        {product.specifications &&
          Object.keys(product.specifications).length > 0 && (
            <div className="mb-16">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Product Details
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-2 border-b border-gray-200"
                      >
                        <dt className="text-sm font-medium text-gray-500">
                          {key}
                        </dt>
                        <dd className="text-sm text-gray-900">{value}</dd>
                      </div>
                    ),
                  )}
                </dl>
              </div>
            </div>
          )}

        {/* Reviews Section */}
        <ProductReviews product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={`related-${relatedProduct.id}`}
                  href={`/product/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-3">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-60 object-cover transition-opacity duration-300 group-hover:opacity-0"
                    />
                    <img
                      src={relatedProduct.images[1] || relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-60 object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 group-hover:underline">
                      {relatedProduct.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {relatedProduct.category}
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
