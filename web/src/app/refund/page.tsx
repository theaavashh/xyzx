import Navbar from '@/components/Navbar';

export default function Refund() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Refund Policy</h1>

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                1. Our Return Policy
              </h2>
              <p className="text-gray-600 mb-4">
                At RaphArch, we want you to be completely satisfied with your
                purchase. If you&apos;re not happy with your order, we offer a
                straightforward return policy to make the process as easy as
                possible.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="font-semibold text-lg mb-2">
                  Return Period: 30 Days
                </p>
                <p className="text-gray-600">
                  You have 30 days from the date of delivery to return your
                  items for a full refund or exchange.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                2. Eligibility for Returns
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Items That Can Be Returned:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>
                      Unused and unworn clothing with original tags attached
                    </li>
                    <li>
                      Footwear in original condition with original packaging
                    </li>
                    <li>Accessories in original condition</li>
                    <li>
                      Items purchased at full price or on sale (unless marked as
                      final sale)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Items That Cannot Be Returned:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Items marked as "Final Sale" or "Clearance"</li>
                    <li>Worn or used items</li>
                    <li>Items without original tags or packaging</li>
                    <li>Personalized or customized items</li>
                    <li>Undergarments and swimwear for hygiene reasons</li>
                    <li>Items damaged by the customer</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Return Process</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Step 1: Initiate Your Return
                  </h3>
                  <p className="text-gray-600">
                    Contact our customer service team at support@rapharch.com or
                    call +1 (800) 123-4567 to initiate your return. Please
                    provide your order number and the items you wish to return.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Step 2: Receive Return Label
                  </h3>
                  <p className="text-gray-600">
                    We'll email you a prepaid return shipping label. Print this
                    label and attach it to your package.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Step 3: Package Your Items
                  </h3>
                  <p className="text-gray-600">
                    Pack your items securely in the original packaging if
                    possible. Include all tags, accessories, and documentation
                    that came with the items.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Step 4: Ship Your Return
                  </h3>
                  <p className="text-gray-600">
                    Drop off your package at any authorized shipping location.
                    Keep your tracking number for reference.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Step 5: Processing
                  </h3>
                  <p className="text-gray-600">
                    Once we receive your return, we'll inspect the items and
                    process your refund or exchange within 5-7 business days.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Refund Options</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Original Payment Method
                  </h3>
                  <p className="text-gray-600">
                    Refunds are typically issued to your original payment
                    method. Please allow 5-10 business days for the refund to
                    appear in your account, depending on your bank or credit
                    card issuer.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Store Credit</h3>
                  <p className="text-gray-600">
                    You can also choose to receive store credit instead of a
                    refund. Store credit is issued immediately and can be used
                    for future purchases.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Exchanges</h3>
                  <p className="text-gray-600">
                    If you'd like to exchange for a different size or color, we
                    can process this as an exchange. If the new item costs more,
                    you'll pay the difference. If it costs less, you'll receive
                    the difference as store credit.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                5. Return Shipping Costs
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Free Returns for Defective Items
                  </h3>
                  <p className="text-gray-600">
                    If you&apos;re returning an item because it&apos;s defective
                    or we sent the wrong item, we'll cover the return shipping
                    costs.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Customer Returns</h3>
                  <p className="text-gray-600">
                    For other returns (wrong size, changed mind, etc.), we
                    provide a prepaid return label, but the return shipping fee
                    ($7.99) will be deducted from your refund amount.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                6. In-Store Returns
              </h2>
              <p className="text-gray-600 mb-4">
                You can return items purchased online to any of our retail
                locations. Please bring:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>The items you wish to return</li>
                <li>Original packaging and tags</li>
                <li>Order confirmation email or receipt</li>
                <li>The credit card used for the purchase (if applicable)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                7. Damaged or Defective Items
              </h2>
              <p className="text-gray-600 mb-4">
                If you receive a damaged or defective item, please contact us
                immediately at support@rapharch.com. We'll arrange for a
                replacement or full refund, and we'll cover all shipping costs.
              </p>
              <p className="text-gray-600">
                Please include photos of the damage or defect in your email to
                help us process your claim quickly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                8. International Returns
              </h2>
              <p className="text-gray-600 mb-4">
                International customers can return items following the same
                process, but please note:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  Return shipping costs are higher and may be deducted from your
                  refund
                </li>
                <li>Customs duties and taxes are non-refundable</li>
                <li>
                  Processing time may be longer due to international shipping
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                9. Exceptions to Our Policy
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Final Sale Items</h3>
                  <p className="text-gray-600">
                    Items marked as "Final Sale" cannot be returned or
                    exchanged. These items are clearly identified on the product
                    page and in your shopping cart.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Extended Holiday Returns
                  </h3>
                  <p className="text-gray-600">
                    For purchases made between November 1st and December 31st,
                    we extend our return window to January 31st of the following
                    year.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                10. Contact Information
              </h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about our return policy or need
                assistance with a return, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>Email:</strong> support@rapharch.com
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> +1 (800) 123-4567
                </p>
                <p className="text-gray-600">
                  <strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST
                </p>
              </div>
            </section>

            <section className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Customer Satisfaction Guarantee
              </h2>
              <p className="text-gray-600">
                We stand behind the quality of our products. If you&apos;re not
                completely satisfied with your purchase, we'll work with you to
                make it right. Your satisfaction is our top priority.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
