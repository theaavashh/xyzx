'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronRight,
  Crown,
  Gift,
  Percent,
  Sparkles,
  Star,
} from 'lucide-react';
import Link from 'next/link';

const benefits = [
  {
    icon: Gift,
    title: 'Welcome Gift',
    description: 'Get 15% off your first order when you join',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Percent,
    title: 'Member Discounts',
    description: 'Exclusive sales & discounts up to 30% off',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    icon: Crown,
    title: 'Early Access',
    description: 'Be the first to shop new drops & collections',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    icon: Star,
    title: 'Bonus Points',
    description: 'Earn points on every purchase for rewards',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
];

export default function RewardsSection() {
  return (
    <section className="bg-[#F2EBCC] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
              Rapharch
            </span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Rewards
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
            Join our exclusive membership program and unlock amazing perks,
            discounts, and early access to new collections.
          </p>

          {/* Learn More Link */}
          <Link
            href="/rewards"
            className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:text-amber-600 transition-colors group"
          >
            Learn More
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Already a member?{' '}
            <Link
               href="/login"
              className="text-gray-900 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
