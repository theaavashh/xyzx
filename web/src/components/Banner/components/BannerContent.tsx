import { memo, type ReactNode } from 'react';

interface BannerContentProps {
  children?: ReactNode;
}

export const BannerContent = memo(function BannerContent({
  children,
}: BannerContentProps) {
  if (!children) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      {children}
    </div>
  );
});
