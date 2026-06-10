import { memo } from 'react';

interface ShopByCategoryHeaderProps {
  title?: string;
  subtitle?: string;
}

export const ShopByCategoryHeader = memo(function ShopByCategoryHeader({
  title = 'Shop by Category',
  subtitle = "Browse our diverse collection of categories to find exactly what you're looking for",
}: ShopByCategoryHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h2 className={`text-3xl sm:text-4xl font-bold text-gray-900 mb-4 lastik uppercase`}>
        {title}
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
});
