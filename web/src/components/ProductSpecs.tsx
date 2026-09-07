import type { Product } from '@/data/products';

interface ProductSpecsProps {
  product: Product;
}

export default function ProductSpecs({ product }: ProductSpecsProps) {
  return (
    <div className="py-12 border-t border-gray-200">
      <h2 className="swansea text-2xl font-bold text-zinc-600 mb-8">Specifications</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Specifications Table */}
        <div>
          <h3 className="text-lg font-medium text-zinc-600 mb-4">
            Product Details
          </h3>
          <div className="space-y-3">
            {product.specifications &&
              Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={`spec-${product.id}-${key}`}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-sm font-medium text-zinc-600">
                    {key}
                  </span>
                  <span className="text-sm text-zinc-600">{value}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-6">
          {product.material && (
            <div>
              <h3 className="text-lg font-medium text-zinc-600 mb-2">
                Material
              </h3>
              <p className="text-sm text-zinc-600">{product.material}</p>
            </div>
          )}

          {product.care && (
            <div>
              <h3 className="text-lg font-medium text-zinc-600 mb-2">
                Care Instructions
              </h3>
              <p className="text-sm text-zinc-600">{product.care}</p>
            </div>
          )}

          {product.origin && (
            <div>
              <h3 className="text-lg font-medium text-zinc-600 mb-2">Origin</h3>
              <p className="text-sm text-zinc-600">{product.origin}</p>
            </div>
          )}

          {/* Size Guide */}
          <div>
            <h3 className="text-lg font-medium text-zinc-600 mb-2">
              Size Guide
            </h3>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 underline"
              onClick={() => {}}
            >
              View Size Guide
            </button>
          </div>
        </div>
      </div>

      {/* Features List */}
      {product.features && product.features.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-zinc-600 mb-4">
            Features & Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.features.map((feature, index) => (
              <div
                key={`feature-detail-${product.id}-${index}`}
                className="flex items-start space-x-3"
              >
                <svg
                  className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-zinc-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
