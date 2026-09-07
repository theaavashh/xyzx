import {
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/SEO';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Returns & Exchanges',
  description:
    'Learn about RaphArch return and exchange policy. Easy returns within 30 days. Find out how to return or exchange your items.',
  keywords: [
    'returns',
    'exchanges',
    'return policy',
    'exchange policy',
    'refunds',
    'return items',
  ],
  url: `${process.env.NEXT_PUBLIC_SITE_URL}/returns-exchanges`,
});

export default function ReturnsExchangesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Returns & Exchanges
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Hassle-free returns and exchanges within 30 days
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Policy Highlights */}
          <section className="mb-16">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">30-Day Returns</h3>
                <p className="text-zinc-600">
                  Return or exchange any item within 30 days of delivery
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Free Returns</h3>
                <p className="text-zinc-600">
                  Free return shipping on all orders within the US
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Easy Exchanges</h3>
                <p className="text-zinc-600">
                  Exchange for a different size or color at no extra cost
                </p>
              </div>
            </div>
          </section>

          {/* How to Return */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              How to Return or Exchange
            </h2>
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Initiate Your Return
                  </h3>
                  <p className="text-zinc-600">
                    Log into your account and go to your order history. Select
                    the order you want to return and click "Return Items."
                    Alternatively, contact our customer service team with your
                    order number.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Package Your Items</h3>
                  <p className="text-zinc-600">
                    Pack the items securely in the original packaging if
                    possible. Include all tags, accessories, and documentation.
                    Items must be unworn, unwashed, and in original condition.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Ship Your Return</h3>
                  <p className="text-zinc-600">
                    Print and attach the prepaid return label (for US orders).
                    Drop off your package at any authorized shipping location.
                    For exchanges, we'll ship your new item once we receive your
                    return.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Receive Your Refund or Exchange
                  </h3>
                  <p className="text-zinc-600">
                    Once we receive and inspect your return, we'll process your
                    refund or send your exchange. Refunds are issued to the
                    original payment method within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Return Conditions */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Return Conditions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Items We Accept
                </h3>
                <ul className="space-y-2 text-zinc-600">
                  <li>• Unworn and unwashed items</li>
                  <li>• Items with original tags attached</li>
                  <li>• Items in original packaging</li>
                  <li>• Items within 30 days of delivery</li>
                  <li>• Defective or damaged items</li>
                  <li>• Wrong items shipped</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  Items We Cannot Accept
                </h3>
                <ul className="space-y-2 text-zinc-600">
                  <li>• Worn, washed, or altered items</li>
                  <li>• Items without original tags</li>
                  <li>• Items damaged due to customer misuse</li>
                  <li>• Final sale or clearance items</li>
                  <li>• Underwear and swimwear (hygiene reasons)</li>
                  <li>• Gift cards and downloadable products</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Refund Information */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Refund Information</h2>
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Refund Method</h3>
                  <p className="text-zinc-600">
                    Refunds will be issued to the original payment method used
                    for the purchase. If you paid with a credit card, the refund
                    will appear on your statement within 5-10 business days
                    depending on your bank.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Refund Timing</h3>
                  <p className="text-zinc-600">
                    Once we receive your return, please allow 2-3 business days
                    for inspection and processing. After approval, refunds are
                    processed within 5-7 business days. You will receive an
                    email confirmation once your refund has been issued.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Partial Refunds</h3>
                  <p className="text-zinc-600">
                    In some cases, partial refunds may be issued for items that
                    are returned with missing parts, damaged packaging, or signs
                    of use. The amount will be determined based on the condition
                    of the returned item.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Exchange Policy */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Exchange Policy</h2>
            <p className="text-zinc-600 mb-6">
              We want you to love your purchase. If you need a different size or
              color, exchanges are easy and free within the US. Simply follow
              the return process and select "Exchange" instead of "Return."
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-blue-800 mb-2">
                    Exchange Notes
                  </h3>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Exchanges are subject to availability</li>
                    <li>
                      • We'll hold your requested item for 7 days once your
                      return is initiated
                    </li>
                    <li>
                      • If the item is out of stock, we'll issue a refund
                      instead
                    </li>
                    <li>
                      • International exchanges may incur additional shipping
                      fees
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Damaged or Defective Items */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">
              Damaged or Defective Items
            </h2>
            <p className="text-zinc-600 mb-6">
              We take quality seriously. If you receive a damaged or defective
              item, please contact us immediately. We will replace the item at
              no cost or provide a full refund, including shipping costs.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
              <p className="text-yellow-800">
                <strong>Important:</strong> Please inspect your order upon
                receipt. For damaged items, retain all packaging materials and
                take photos of the damage. Contact us within 48 hours of
                delivery for fastest resolution.
              </p>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="text-center bg-black text-white rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-4">
              Need Help with a Return?
            </h2>
            <p className="text-zinc-600 mb-6 max-w-2xl mx-auto">
              Our customer service team is here to help you with any questions
              about returns or exchanges. Contact us and we'll assist you every
              step of the way.
            </p>
            <a
              href="/contact-us"
              className="inline-block bg-white text-zinc-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Contact Customer Service
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
