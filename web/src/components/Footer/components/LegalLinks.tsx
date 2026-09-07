import { memo } from 'react';
import Link from 'next/link';
import { LEGAL_LINKS } from '../constants';

export const LegalLinks = memo(function LegalLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-2 md:mt-0">
      {LEGAL_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-xs sm:text-sm md:text-base text-zinc-600 hover:opacity-60 transition-opacity whitespace-nowrap underline"
          prefetch
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
});
