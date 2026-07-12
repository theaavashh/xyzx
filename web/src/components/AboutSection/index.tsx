'use client';

import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

interface AboutData {
  quote: string;
  ctaText: string;
  ctaUrl: string;
  isActive: boolean;
}

async function fetchAboutSection(): Promise<AboutData | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/public/about/active`);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data) return null;
    return json.data;
  } catch {
    return null;
  }
}

function AboutSectionContent() {
  const [data, setData] = useState<AboutData | null>(null);

  useEffect(() => {
    fetchAboutSection().then(setData);
  }, []);

  if (!data || !data.isActive) return null;

  return (
    <section className="py-20 md:py-32 px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-lg md:text-2xl leading-relaxed text-neutral-800 font-light"
        >
          &ldquo;{data.quote}&rdquo;
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          <a
            href={data.ctaUrl}
            className="inline-block mt-10 px-8 py-3 border-2 border-black text-black text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300"
          >
            {data.ctaText}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(function AboutSection() {
  return <AboutSectionContent />;
});
