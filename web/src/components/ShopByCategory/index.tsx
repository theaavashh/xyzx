"use client";

import { memo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fetchCategories } from "./utils/api";
import type { Category } from "./types";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

interface CollectionCardProps {
  category: Category;
}

function CollectionCard({ category }: CollectionCardProps) {
  return (
    <Link
      href={category.link}
      className="group relative block w-full h-full overflow-hidden bg-neutral-100 cursor-pointer"
    >
      <div className="absolute -inset-2 overflow-hidden">
        <Image
          src={category.image}
          alt={category.title}
          fill
          className="object-cover transition-all duration-700 ease-out scale-100 group-hover:scale-110"
          unoptimized
          sizes="(max-width: 768px) 85vw, 25vw"
        />
      </div>

      <div className="absolute inset-0 bg-black/25 transition-colors duration-700 group-hover:bg-black/40" />

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <ArrowUpRight className="w-4 h-4 text-zinc-900" />
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-left px-5 transition-transform duration-500 ease-out group-hover:-translate-y-1">
          <h3 className="bound-regular text-base md:text-lg lg:text-xl text-white leading-tight font-medium">
          {category.title}
        </h3>
        <span className="inline-flex items-center gap-1.5 mt-1 text-sm text-white/70 tracking-wider uppercase group-hover:text-white transition-colors duration-300">
          More
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default memo(function ShopByCategory() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  if (!categories.length) return null;

  const displayCategories = categories.slice(0, 6);

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-6 md:mb-10"
        >
          <h2 className="bound-regular text-xl md:text-2xl lg:text-3xl font-medium text-zinc-900 tracking-wide">
            Shop By Category
          </h2>
          <p className="mt-1 text-lg text-zinc-600 tracking-wide">
            Browse our curated collections
          </p>
        </motion.div>

        <div
          className="flex gap-2 md:gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayCategories.map((category) => (
            <div key={category.id} className="flex-shrink-0 w-[75vw] sm:w-[50vw] md:w-[30vw] lg:w-[22vw] snap-start aspect-[3/4]">
              <CollectionCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
