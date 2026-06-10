import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/SEO';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Terms of Service',
  description:
    'Read RaphArch Terms of Service. Understand the terms and conditions governing your use of our website and services.',
  keywords: [
    'terms of service',
    'terms and conditions',
    'legal',
    'user agreement',
    'terms of use',
  ],
  url: `${process.env.NEXT_PUBLIC_SITE_URL}/terms-of-service`,
});

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Terms of Service
          </h1>
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 mb-4">
                By accessing and using RaphArch website and services, you agree
                to be bound by these Terms of Service and all applicable laws
                and regulations. If you do not agree with any of these terms,
                you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p className="text-gray-600 mb-4">
                Permission is granted to temporarily download one copy of the
                materials on RaphArch website for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a
                transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>
                  Attempt to decompile or reverse engineer any software on the
                  website
                </li>
                <li>Remove any copyright or other proprietary notations</li>
                <li>
                  Transfer the materials to another person or mirror the
                  materials on any other server
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                3. Account Registration
              </h2>
              <p className="text-gray-600 mb-4">
                To access certain features of our website, you may need to
                create an account. You agree to provide accurate, current, and
                complete information during registration and to update such
                information to keep it accurate, current, and complete.
              </p>
              <p className="text-gray-600 mb-4">
                You are responsible for maintaining the confidentiality of your
                account and password and for restricting access to your
                computer. You agree to accept responsibility for all activities
                that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                4. Product Information
              </h2>
              <p className="text-gray-600 mb-4">
                We make every effort to display as accurately as possible the
                colors, features, specifications, and details of the products
                available on the website. However, we do not guarantee that the
                colors, features, specifications, and details will be accurate,
                complete, reliable, current, or free of other errors.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                5. Pricing and Payment
              </h2>
              <p className="text-gray-600 mb-4">
                All prices are listed in US dollars and are subject to change
                without notice. We reserve the right to modify or discontinue
                products without notice. We shall not be liable to you or any
                third party for any modification, price change, suspension, or
                discontinuance of the products.
              </p>
              <p className="text-gray-600 mb-4">
                By providing a credit card or other payment method, you
                represent and warrant that you are authorized to use the
                designated payment method and that you authorize us to charge
                your payment method for the total amount of your purchase.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                6. Shipping and Delivery
              </h2>
              <p className="text-gray-600 mb-4">
                Shipping and delivery dates are estimates only and cannot be
                guaranteed. We are not liable for any delays in shipments. Title
                and risk of loss for items purchased pass to you upon delivery
                of the items to the carrier.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                7. Returns and Refunds
              </h2>
              <p className="text-gray-600 mb-4">
                Our return and refund policy is outlined in detail on our
                Returns page. By making a purchase, you agree to the terms of
                our return policy. We reserve the right to refuse returns or
                exchanges that do not meet our policy requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                8. Intellectual Property
              </h2>
              <p className="text-gray-600 mb-4">
                All content on this website, including but not limited to text,
                graphics, logos, images, audio clips, digital downloads, data
                compilations, and software, is the property of RaphArch or its
                content suppliers and is protected by international copyright
                laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-gray-600 mb-4">
                RaphArch shall not be liable for any direct, indirect,
                incidental, special, consequential, or punitive damages
                resulting from your access to or use of, or inability to access
                or use, the website or any content therein.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                10. Indemnification
              </h2>
              <p className="text-gray-600 mb-4">
                You agree to indemnify, defend, and hold harmless RaphArch, its
                officers, directors, employees, agents, licensors, and suppliers
                from and against all losses, expenses, damages, and costs,
                including reasonable attorneys' fees, resulting from any
                violation of these Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These Terms of Service shall be governed by and construed in
                accordance with the laws of the State of New York, without
                regard to its conflict of law provisions. Any dispute arising
                under these terms shall be subject to the exclusive jurisdiction
                of the courts of New York.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                12. Changes to Terms
              </h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these Terms of Service at any
                time. Changes will be effective immediately upon posting to the
                website. Your continued use of the website following the posting
                of revised Terms means that you accept and agree to the changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                13. Contact Information
              </h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>Email:</strong> legal@rapharch.com
                </p>
                <p className="text-gray-600">
                  <strong>Address:</strong> RaphArch, 123 Fashion Avenue, New
                  York, NY 10001
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
