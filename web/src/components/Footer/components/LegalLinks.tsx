import { memo } from 'react';
import Link from 'next/link';
import { LEGAL_LINKS } from '../constants';

export const LegalLinks = memo(function LegalLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mt-2 md:mt-0">
      {LEGAL_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm sm:text-base md:text-md text-black hover:opacity-60 transition-opacity whitespace-nowrap"
          prefetch
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
});
