'use client';

import {
  DollarSign,
  Facebook,
  Gift,
  Heart,
  Instagram,
  MessageCircle,
  Share2,
  ShoppingBag,
  Smartphone,
  Star,
} from 'lucide-react';
import { useState } from 'react';

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'join'>('login');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-medium text-gray-600 mb-2">WELCOME TO</p>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
            PRINCESS POLLY
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            REWARDS
          </h2>

          {/* Login/Join Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`px-8 py-3 font-semibold text-sm transition-colors ${
                activeTab === 'login'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border-2 border-black hover:bg-gray-100'
              }`}
            >
              LOG IN
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`px-8 py-3 font-semibold text-sm transition-colors ${
                activeTab === 'join'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border-2 border-black hover:bg-gray-100'
              }`}
            >
              JOIN NOW
            </button>
          </div>

          <p className="text-xs text-gray-600 max-w-3xl mx-auto">
            BE A PRINCESS POLLY REWARDS MEMBER. POLLY GET ACCESS TO EXCLUSIVE
            OFFERS, SALES DISCOUNTS + EARN POINTS TO CELEBRATE AND CHECKOUT
            FASTER!
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            HOW IT WORKS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center border-2 border-gray-900">
                <Star className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">JOIN</h4>
              <p className="text-sm text-gray-600">TO START EARNING POINTS</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center border-2 border-gray-900">
                <DollarSign className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">EARN POINTS</h4>
              <p className="text-sm text-gray-600">FROM YOUR PURCHASES</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center border-2 border-gray-900">
                <Gift className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">REDEEM PERKS</h4>
              <p className="text-sm text-gray-600">
                INCL. FREE DELIVERY PERKS,
                <br />
                BONUS & DISCOUNTS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Earn Points Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            WAYS TO EARN POINTS
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Make a Purchase */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                MAKE A
              </h4>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                PURCHASE
              </h4>
            </div>

            {/* Create Account */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                CREATE AN ACCOUNT
              </h4>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                WHEN YOU JOIN POLLY REWARDS!
              </h4>
              <p className="text-xs text-gray-600">+25</p>
            </div>

            {/* Celebrate Birthday */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                CELEBRATE
              </h4>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                WITH YOUR BIRTHDAY REWARD!
              </h4>
            </div>

            {/* Write a Review */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                WRITE A
              </h4>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                REVIEW ON A PURCHASED ITEM
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Follow on Facebook */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Facebook className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                FOLLOW US
              </h4>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                ON FACEBOOK OR INSTAGRAM
              </h4>
            </div>

            {/* Follow on Instagram */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Instagram className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                FOLLOW US
              </h4>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                ON INSTAGRAM
              </h4>
            </div>

            {/* Follow on TikTok */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Share2 className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                FOLLOW US
              </h4>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                ON TIKTOK
              </h4>
            </div>

            {/* Get the App */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                GET THE
              </h4>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                POLLY APP
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-2xl mx-auto">
            {/* Add Photo */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                ADD PHOTO TO
              </h4>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                YOUR REVIEW
              </h4>
            </div>

            {/* Add to Wishlist */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                ADD TO YOUR
              </h4>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                WISHLIST/SAVE ITEMS
              </h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
