import Navbar from '@/components/Navbar';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Terms of Use</h1>

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600">
                By accessing and using RaphArch's website, you accept and agree
                to be bound by the terms and provision of this agreement. If you
                do not agree to abide by the above, please do not use this
                service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p className="text-gray-600 mb-4">
                Permission is granted to temporarily download one copy of the
                materials on RaphArch's website for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a
                transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>modify or copy the materials</li>
                <li>
                  use the materials for any commercial purpose or for any public
                  display
                </li>
                <li>
                  attempt to reverse engineer any software contained on
                  RaphArch's website
                </li>
                <li>
                  remove any copyright or other proprietary notations from the
                  materials
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                3. Products and Services
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Product Information
                  </h3>
                  <p className="text-gray-600">
                    We strive to be as accurate as possible in the descriptions
                    of our products. However, we do not warrant that product
                    descriptions, colors, information, or other content of the
                    site are accurate, complete, reliable, current, or
                    error-free.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Pricing</h3>
                  <p className="text-gray-600">
                    All prices are displayed in [Currency] and are subject to
                    change without notice. We reserve the right to modify or
                    discontinue products at any time without notice.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Order Acceptance</h3>
                  <p className="text-gray-600">
                    We reserve the right to refuse or cancel any order for any
                    reason, including but not limited to: product availability,
                    errors in the description or price of the product, error in
                    your order.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                4. Account Responsibilities
              </h2>
              <p className="text-gray-600 mb-4">
                If you create an account on our website, you are responsible for
                maintaining the confidentiality of your account and password.
                You agree to accept responsibility for all activities that occur
                under your account or password.
              </p>
              <p className="text-gray-600">
                RaphArch reserves the right to refuse service, terminate
                accounts, remove or edit content, or cancel orders in their sole
                discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                5. Payment and Billing
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Payment Methods</h3>
                  <p className="text-gray-600">
                    We accept various payment methods including credit cards,
                    debit cards, and other payment processors. By providing
                    payment information, you represent that you are authorized
                    to use the payment method.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Billing</h3>
                  <p className="text-gray-600">
                    You agree to provide current, complete, and accurate
                    purchase and account information for all purchases made at
                    our store. You agree to promptly update your account and
                    other information.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                6. Shipping and Delivery
              </h2>
              <p className="text-gray-600 mb-4">
                We make every effort to deliver products within the estimated
                time frames. However, we are not liable for any delays in
                shipments.
              </p>
              <p className="text-gray-600">
                Risk of loss and title for all merchandise ordered on this site
                pass to you when the merchandise is delivered to the shipping
                carrier.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                7. Returns and Refunds
              </h2>
              <p className="text-gray-600">
                Our return policy is outlined separately in our Refund Policy.
                By using our website, you agree to the terms and conditions
                outlined in our return policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                8. Intellectual Property
              </h2>
              <p className="text-gray-600 mb-4">
                All content included on this site, such as text, graphics,
                logos, images, data compilations, and software, is the property
                of RaphArch or its content suppliers and protected by
                international copyright laws.
              </p>
              <p className="text-gray-600">
                The compilation of all content on this site is the exclusive
                property of RaphArch and protected by international copyright
                laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. User Conduct</h2>
              <p className="text-gray-600 mb-4">
                You agree not to use the website for any unlawful purpose or in
                any way that could damage, disable, or impair the site or
                interfere with any other party's use and enjoyment of the
                website.
              </p>
              <p className="text-gray-600">
                Prohibited activities include but are not limited to: using the
                site to transmit spam, harassing or abusive content, or any
                material that is harmful, obscene, or otherwise objectionable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                10. Disclaimer of Warranties
              </h2>
              <p className="text-gray-600">
                The materials on RaphArch's website are provided on an 'as is'
                basis. RaphArch makes no warranties, expressed or implied, and
                hereby disclaims and negates all other warranties including
                without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of
                rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                11. Limitation of Liability
              </h2>
              <p className="text-gray-600">
                In no event shall RaphArch or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on RaphArch's website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                12. Indemnification
              </h2>
              <p className="text-gray-600">
                You agree to indemnify and hold RaphArch and its parents,
                subsidiaries, affiliates, officers, employees, agents, partners
                and licensors harmless from any claim or demand, including
                reasonable attorneys' fees, made by any third-party due to or
                arising out of your breach of these Terms of Service or the
                documents they incorporate by reference, or your violation of
                any law or the rights of a third-party.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
              <p className="text-gray-600">
                These terms and conditions are governed by and construed in
                accordance with the laws of [State/Country] and you irrevocably
                submit to the exclusive jurisdiction of the courts in that State
                or location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                14. Changes to Terms of Use
              </h2>
              <p className="text-gray-600">
                RaphArch reserves the right to revise these terms of use at any
                time without notice. By using this website, you are agreeing to
                be bound by the then current version of these terms of use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                15. Contact Information
              </h2>
              <p className="text-gray-600 mb-4">
                Questions about the Terms of Use should be sent to us at:
              </p>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>Email:</strong> legal@rapharch.com
                </p>
                <p className="text-gray-600">
                  <strong>Address:</strong> RaphArch, 123 Fashion Avenue, New
                  York, NY 10001
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> +1 (800) 123-4567
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
