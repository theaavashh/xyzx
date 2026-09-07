'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Gift,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContextTanStack';
import { apiRequest } from '@/lib/api';

interface RewardSettings {
  amountUnit: number;
  rewardValue: number;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function RewardsPage() {
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<RewardSettings | null>(null);

  useEffect(() => {
    apiRequest<{ success: boolean; data: RewardSettings }>('/api/v1/user-rewards/settings')
      .then((res) => setSettings(res.data))
      .catch(() => setSettings({ amountUnit: 100, rewardValue: 1 }));
  }, []);

  const unit = settings?.amountUnit ?? 100;
  const value = settings?.rewardValue ?? 1;

  const howItWorks = [
    {
      icon: ShoppingBag,
      title: 'Shop',
      desc: `Spend $${unit} and earn ${value} reward point${value > 1 ? 's' : ''}`,
    },
    {
      icon: Star,
      title: 'Earn',
      desc: 'Points are added automatically after your order is confirmed',
    },
    {
      icon: Gift,
      title: 'Redeem',
      desc: 'Use your points at checkout for discounts on future orders',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pt-20 md:pt-28 pb-16 md:pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
          className="swansea text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-zinc-600 font-extrabold mb-6 leading-tight"
        >
          Rapharch Rewards
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: 'easeOut' }}
          className="text-zinc-600 text-base md:text-lg max-w-xl leading-relaxed tracking-wide"
        >
          Shop, earn points, and unlock exclusive perks. The more you shop, the more you save.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-start gap-4 mt-10"
        >
          {isAuthenticated ? (
            <Link
              href="/rewards/dashboard"
              className="group inline-flex items-center gap-3 px-6 py-3 bg-black text-white text-sm font-medium hover:bg-black/80 transition-all duration-300"
            >
              My Rewards Dashboard
              <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </Link>
          ) : (
            <>
              <Link
                href="/auth?mode=signup"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-black text-white text-sm font-medium hover:bg-black/80 transition-all duration-300"
              >
                Join Now
                <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </Link>
              <Link
                href="/auth?mode=login"
                className="inline-flex items-center gap-3 px-6 py-3 border border-black/20 text-zinc-600 text-sm font-medium hover:bg-black/5 transition-all duration-300"
              >
                Sign In
              </Link>
            </>
          )}
        </motion.div>
      </div>

      {/* How It Works */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-8 md:py-12 border-t border-black/10"
      >
        
        <h2 className="swansea text-3xl md:text-4xl lg:text-5xl text-zinc-600 mb-12 text-center font-extrabold">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 mt-12">
          {howItWorks.map((step, i) => (
            <div key={step.title} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
                className="text-center px-6 md:px-10"
              >
                <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-5 mx-auto">
                  <step.icon className="w-5 h-5 text-zinc-600" />
                </div>
                <span className="text-xs font-semibold text-zinc-600/30 tracking-wider uppercase">Step {i + 1}</span>
                <h3 className="swansea text-xl text-zinc-600 mt-1 mb-3">{step.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed max-w-[220px] mx-auto">{step.desc}</p>
              </motion.div>
              {i < howItWorks.length - 1 && (
                <svg
                  className="hidden md:block w-16 h-8 text-zinc-600/20 shrink-0 -mx-2"
                  viewBox="0 0 64 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 16 C20 16, 20 4, 32 4 S44 16, 60 16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M54 12 L60 16 L54 20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeInUp}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-8 md:py-12 border-t border-black/10"
      >
        <h2 className="swansea font-extrabold text-3xl md:text-4xl lg:text-5xl text-zinc-600 mb-12">
          Frequently Asked
        </h2>
        <div className="space-y-6">
          {[
            {
              q: 'How do I earn reward points?',
              a: `Every time you make a purchase, you earn ${value} point${value > 1 ? 's' : ''} for every $${unit} spent. Points are automatically added to your account after your order is confirmed.`,
            },
            {
              q: 'How do I redeem my points?',
              a: 'You can redeem your points at checkout. The discount will be applied automatically based on your available balance.',
            },
            {
              q: 'Do points expire?',
              a: 'Points are valid for 12 months from the date they were earned. Make sure to use them before they expire!',
            },
            {
              q: 'How do I check my points balance?',
              a: 'Sign in to your account and visit the Rewards Dashboard to see your current balance, earning history, and tier status.',
            },
          ].map((faq, i) => (
            <div key={i} className="border-b border-black/10 pb-6">
              <h4 className="text-sm font-semibold text-zinc-600 mb-2">{faq.q}</h4>
              <p className="text-sm text-zinc-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Bottom CTA */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-8 md:py-12 border-t border-black/10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            
            <h2 className="swansea text-3xl md:text-4xl lg:text-5xl text-zinc-600 mb-6 font-extrabold">
              Ready to Start Earning 
            </h2>
            <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-8 max-w-md">
              Join Rapharch Rewards today and start earning points with your very first purchase.
            </p>
            {isAuthenticated ? (
              <Link
                href="/rewards/dashboard"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-black text-white text-sm font-medium hover:bg-black/80 transition-all duration-300"
              >
                Go to Dashboard
                <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </Link>
            ) : (
              <Link
                href="/auth?mode=signup"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-black text-white text-sm font-medium hover:bg-black/80 transition-all duration-300"
              >
                Join Now &mdash; It&apos;s Free
                <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </Link>
            )}
          </div>
          <div className="bg-black/5 p-8 md:p-10">
            <h3 className="swansea text-2xl text-zinc-600 mb-3">Already a Member?</h3>
            <p className="text-zinc-600 text-sm leading-relaxed mb-6">
              Sign in to check your reward balance, view your history, and redeem your points.
            </p>
            <Link
              href="/rewards/dashboard"
              className="group inline-flex items-center gap-3 px-6 py-3 border border-black/20 text-zinc-600 text-sm font-medium hover:bg-black/5 transition-all duration-300"
            >
              View Dashboard
              <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
