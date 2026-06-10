'use client';

import { FooterLinks, FooterBottom, FooterNewsletter } from './components';
import type { FooterProps } from './types';

export default function Footer({ sections }: FooterProps) {
  return (
    <footer className="bg-[#fbf9ef]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
        <FooterNewsletter />
        <FooterLinks sections={sections} />
        <FooterBottom />
      </div>
    </footer>
  );
}
