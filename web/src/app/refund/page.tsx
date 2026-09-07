import Navbar from '@/components/Navbar';

export default function Refund() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-14">
          <span className="inline-block text-zinc-600/30 text-xs font-semibold tracking-[0.25em] uppercase mb-4 border-l-2 border-black/30 pl-4">
            Policy
          </span>
          <h1 className="swansea text-3xl sm:text-4xl md:text-5xl text-zinc-600 mb-4">Refund Policy</h1>
          <p className="text-zinc-600/50 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="max-w-none space-y-12">
          <section>
            <h2 className="swansea text-2xl md:text-3xl text-zinc-600 mb-6">
              1. Our Return Policy
            </h2>
            <p className="text-zinc-600/50 leading-relaxed mb-6">
              At RaphArch, we want you to be completely satisfied with your
              purchase. If you&apos;re not happy with your order, we offer a
              straightforward return policy to make the process as easy as
              possible.
            </p>
            <div className="bg-black/5 p-6 md:p-8 rounded-xl border border-black/10">
              <p className="swansea text-lg text-zinc-600 mb-2">
                Return Period: 30 Days
              </p>
              <p className="text-zinc-600/50">
                You have 30 days from the date of delivery to return your
                items for a full refund or exchange.
              </p>
            </div>
          </section>

          <section>
            <h2 className="swansea text-2xl md:text-3xl text-zinc-600 mb-6">
              2. Eligibility for Returns
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-black/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-zinc-600 uppercase tracking-wider mb-4">
                  Items That Can Be Returned:
                </h3>
                <ul className="space-y-2">
                  {[
                    'Unused and unworn clothing with original tags attached',
                    'Footwear in original condition with original packaging',
                    'Accessories in original condition',
                    'Items purchased at full price or on sale (unless marked as final sale)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-600/50 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-black/30 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-black/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-zinc-600 uppercase tracking-wider mb-4">
                  Items That Cannot Be Returned:
                </h3>
                <ul className="space-y-2">
                  {[
                    'Items marked as "Final Sale" or "Clearance"',
                    'Worn or used items',
                    'Items without original tags or packaging',
                    'Personalized or customized items',
                    'Undergarments and swimwear for hygiene reasons',
                    'Items damaged by the customer',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-600/50 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-black/30 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="swansea text-2xl md:text-3xl text-zinc-600 mb-6">3. Return Process</h2>
            <div className="space-y-4">
              {[
                { step: 'Step 1', title: 'Initiate Your Return', desc: 'Contact our customer service team at support@rapharch.com or call +1 (800) 123-4567 to initiate your return. Please provide your order number and the items you wish to return.' },
                { step: 'Step 2', title: 'Receive Return Label', desc: "We'll email you a prepaid return shipping label. Print this label and attach it to your package." },
                { step: 'Step 3', title: 'Package Your Items', desc: 'Pack your items securely in the original packaging if possible. Include all tags, accessories, and documentation that came with the items.' },
                { step: 'Step 4', title: 'Ship Your Return', desc: 'Drop off your package at any authorized shipping location. Keep your tracking number for reference.' },
                { step: 'Step 5', title: 'Processing', desc: "Once we receive your return, we'll inspect the items and process your refund or exchange within 5-7 business days." },
              ].map((s, i) => (
                <div key={i} className="group flex gap-5 p-5 rounded-xl border border-black/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs text-zinc-600/40 uppercase tracking-wider mb-0.5">{s.step}</p>
                    <h3 className="font-semibold text-zinc-600 text-sm mb-1 group-hover:translate-x-0.5 transition-transform duration-300">{s.title}</h3>
                    <p className="text-zinc-600/50 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="swansea text-2xl md:text-3xl text-zinc-600 mb-6">4. Refund Options</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { title: 'Original Payment Method', desc: 'Refunds are typically issued to your original payment method. Please allow 5-10 business days for the refund to appear in your account, depending on your bank or credit card issuer.' },
                { title: 'Store Credit', desc: 'You can also choose to receive store credit instead of a refund. Store credit is issued immediately and can be used for future purchases.' },
                { title: 'Exchanges', desc: "If you'd like to exchange for a different size or color, we can process this as an exchange. If the new item costs more, you'll pay the difference. If it costs less, you'll receive the difference as store credit." },
              ].map((opt, i) => (
                <div key={i} className="group border border-black/10 rounded-xl p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-9 h-9 bg-black/5 rounded-xl flex items-center justify-center mb-4 group-hover:bg-black/10 group-hover:scale-110 transition-all duration-300">
                    <span className="text-xs font-bold text-zinc-600">{i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-zinc-600 text-sm mb-2 group-hover:translate-x-0.5 transition-transform duration-300">{opt.title}</h3>
                  <p className="text-zinc-600/50 text-sm leading-relaxed">{opt.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="swansea text-2xl md:text-3xl text-zinc-600 mb-6">
              5. Return Shipping Costs
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="border border-black/10 rounded-xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <h3 className="font-semibold text-zinc-600 text-sm mb-2">Free Returns for Defective Items</h3>
                <p className="text-zinc-600/50 text-sm leading-relaxed">
                  If you&apos;re returning an item because it&apos;s defective or we sent the wrong item, we&apos;ll cover the return shipping costs.
                </p>
              </div>
              <div className="border border-black/10 rounded-xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <h3 className="font-semibold text-zinc-600 text-sm mb-2">Customer Returns</h3>
                <p className="text-zinc-600/50 text-sm leading-relaxed">
                  For other returns (wrong size, changed mind, etc.), we provide a prepaid return label, but the return shipping fee ($7.99) will be deducted from your refund amount.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="swansea text-2xl md:text-3xl text-zinc-600 mb-6">
              6. In-Store Returns
            </h2>
            <p className="text-zinc-600/50 leading-relaxed mb-4">
              You can return items purchased online to any of our retail locations. Please bring:
            </p>
            <ul className="space-y-2">
              {[
                'The items you wish to return',
                'Original packaging and tags',
                'Order confirmation email or receipt',
                'The credit card used for the purchase (if applicable)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-zinc-600/50 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/30 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="swansea text-2xl md:text-3xl text-zinc-600 mb-6">
              7. Damaged or Defective Items
            </h2>
            <p className="text-zinc-600/50 leading-relaxed mb-4">
              If you receive a damaged or defective item, please contact us immediately at support@rapharch.com. We&apos;ll arrange for a replacement or full refund, and we&apos;ll cover all shipping costs.
            </p>
            <p className="text-zinc-600/50 leading-relaxed">
              Please include photos of the damage or defect in your email to help us process your claim quickly.
            </p>
          </section>

          <section>
            <h2 className="swansea text-2xl md:text-3xl text-zinc-600 mb-6">
              8. International Returns
            </h2>
            <p className="text-zinc-600/50 leading-relaxed mb-4">
              International customers can return items following the same process, but please note:
            </p>
            <ul className="space-y-2">
              {[
                'Return shipping costs are higher and may be deducted from your refund',
                'Customs duties and taxes are non-refundable',
                'Processing time may be longer due to international shipping',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-zinc-600/50 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/30 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="swansea text-2xl md:text-3xl text-zinc-600 mb-6">
              9. Exceptions to Our Policy
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: 'Final Sale Items', desc: 'Items marked as "Final Sale" cannot be returned or exchanged. These items are clearly identified on the product page and in your shopping cart.' },
                { title: 'Extended Holiday Returns', desc: 'For purchases made between November 1st and December 31st, we extend our return window to January 31st of the following year.' },
              ].map((exc, i) => (
                <div key={i} className="border border-black/10 rounded-xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <h3 className="font-semibold text-zinc-600 text-sm mb-2">{exc.title}</h3>
                  <p className="text-zinc-600/50 text-sm leading-relaxed">{exc.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="swansea text-2xl md:text-3xl text-zinc-600 mb-6">
              10. Contact Information
            </h2>
            <p className="text-zinc-600/50 leading-relaxed mb-6">
              If you have any questions about our return policy or need assistance with a return, please contact us:
            </p>
            <div className="bg-black/5 rounded-xl border border-black/10 p-6 space-y-3">
              {[
                { label: 'Email', value: 'support@rapharch.com' },
                { label: 'Phone', value: '+1 (800) 123-4567' },
                { label: 'Hours', value: 'Monday - Friday, 9:00 AM - 6:00 PM EST' },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-zinc-600/40 uppercase tracking-wider w-16 shrink-0">{c.label}</span>
                  <span className="text-zinc-600 text-sm">{c.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-black/5 rounded-xl border border-black/10 p-8 md:p-10 text-center">
            <h2 className="swansea text-2xl md:text-3xl text-zinc-600 mb-4">
              Customer Satisfaction Guarantee
            </h2>
            <p className="text-zinc-600/50 leading-relaxed max-w-2xl mx-auto">
              We stand behind the quality of our products. If you&apos;re not completely satisfied with your purchase, we&apos;ll work with you to make it right. Your satisfaction is our top priority.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
