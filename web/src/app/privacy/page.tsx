import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/SEO';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Privacy Policy',
  description:
    "Read RaphArch's privacy policy to learn how we collect, use, and protect your personal information. Understand your rights and our commitment to data privacy.",
  keywords: [
    'privacy policy',
    'data protection',
    'personal information',
    'privacy',
    'data security',
  ],
  url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy`,
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Privacy Policy
          </h1>

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                1. Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Personal Information
                  </h3>
                  <p className="text-gray-600">
                    When you make a purchase or create an account, we collect
                    information such as your name, email address, shipping
                    address, billing address, and payment information.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Automatically Collected Information
                  </h3>
                  <p className="text-gray-600">
                    We automatically collect certain information when you visit
                    our website, including your IP address, browser type, device
                    information, and browsing behavior.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Cookies and Tracking Technologies
                  </h3>
                  <p className="text-gray-600">
                    We use cookies and similar tracking technologies to track
                    activity on our website and hold certain information to
                    improve your experience.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>To process and fulfill your orders</li>
                <li>To provide customer service and support</li>
                <li>
                  To send you transactional emails and order confirmations
                </li>
                <li>To personalize your shopping experience</li>
                <li>To improve our website and services</li>
                <li>To send marketing communications (with your consent)</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                3. Information Sharing
              </h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties except in the following
                circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  With trusted third-party service providers who assist us in
                  operating our business
                </li>
                <li>With payment processors to process transactions</li>
                <li>With shipping carriers to deliver your orders</li>
                <li>When required by law or to protect our rights</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no
                method of transmission over the internet or method of electronic
                storage is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
              <p className="text-gray-600 mb-4">
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Object to processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Essential Cookies
                  </h3>
                  <p className="text-gray-600">
                    These cookies are necessary for the website to function and
                    cannot be switched off in our systems.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Analytics Cookies
                  </h3>
                  <p className="text-gray-600">
                    These cookies help us understand how visitors interact with
                    our website by collecting and reporting information
                    anonymously.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Marketing Cookies
                  </h3>
                  <p className="text-gray-600">
                    These cookies are used to track visitors across websites to
                    display relevant advertisements.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                7. Children's Privacy
              </h2>
              <p className="text-gray-600">
                Our website is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If you are a parent or guardian and believe your child
                has provided us with personal information, please contact us
                immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                8. International Data Transfers
              </h2>
              <p className="text-gray-600">
                Your personal information may be transferred to and processed in
                countries other than your own. We ensure that appropriate
                safeguards are in place to protect your information in
                accordance with applicable data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                9. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-600">
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new privacy policy on
                this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this privacy policy or our data
                practices, please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">
                  <strong>Email:</strong> privacy@rapharch.com
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
