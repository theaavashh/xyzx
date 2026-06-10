import { Info, Ruler } from 'lucide-react';
import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/SEO';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Size Guide',
  description:
    'Find your perfect fit with RaphArch comprehensive size guide. View sizing charts for shoes, clothing, and accessories.',
  keywords: [
    'size guide',
    'sizing chart',
    'shoe sizes',
    'clothing sizes',
    'fit guide',
    'measurements',
  ],
  url: `${process.env.NEXT_PUBLIC_SITE_URL}/size-guide`,
});

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Size Guide</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive sizing charts
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Introduction */}
          <section className="mb-16 text-center">
            <div className="max-w-3xl mx-auto">
              <Ruler className="w-16 h-16 mx-auto mb-6 text-black" />
              <h2 className="text-2xl font-bold mb-4">How to Measure</h2>
              <p className="text-gray-600">
                For the best fit, measure yourself carefully or use a piece of
                clothing that fits you well. If you&apos;re between sizes, we
                recommend sizing up for a more comfortable fit or down for a
                more fitted look.
              </p>
            </div>
          </section>

          {/* Men's Shoes */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Men's Shoes</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-4 text-left">US</th>
                    <th className="p-4 text-left">UK</th>
                    <th className="p-4 text-left">EU</th>
                    <th className="p-4 text-left">CM</th>
                    <th className="p-4 text-left">Inches</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">6</td>
                    <td className="p-4">5.5</td>
                    <td className="p-4">38.5</td>
                    <td className="p-4">24</td>
                    <td className="p-4">9.4</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4">7</td>
                    <td className="p-4">6</td>
                    <td className="p-4">40</td>
                    <td className="p-4">25</td>
                    <td className="p-4">9.8</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">8</td>
                    <td className="p-4">7</td>
                    <td className="p-4">41</td>
                    <td className="p-4">26</td>
                    <td className="p-4">10.2</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4">9</td>
                    <td className="p-4">8</td>
                    <td className="p-4">42.5</td>
                    <td className="p-4">27</td>
                    <td className="p-4">10.6</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">10</td>
                    <td className="p-4">9</td>
                    <td className="p-4">44</td>
                    <td className="p-4">28</td>
                    <td className="p-4">11.0</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4">11</td>
                    <td className="p-4">10</td>
                    <td className="p-4">45</td>
                    <td className="p-4">29</td>
                    <td className="p-4">11.4</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">12</td>
                    <td className="p-4">11</td>
                    <td className="p-4">46</td>
                    <td className="p-4">30</td>
                    <td className="p-4">11.8</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4">13</td>
                    <td className="p-4">12</td>
                    <td className="p-4">47.5</td>
                    <td className="p-4">31</td>
                    <td className="p-4">12.2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Women's Shoes */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Women's Shoes</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-4 text-left">US</th>
                    <th className="p-4 text-left">UK</th>
                    <th className="p-4 text-left">EU</th>
                    <th className="p-4 text-left">CM</th>
                    <th className="p-4 text-left">Inches</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">5</td>
                    <td className="p-4">2.5</td>
                    <td className="p-4">35.5</td>
                    <td className="p-4">22</td>
                    <td className="p-4">8.7</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4">6</td>
                    <td className="p-4">3.5</td>
                    <td className="p-4">36.5</td>
                    <td className="p-4">23</td>
                    <td className="p-4">9.1</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">7</td>
                    <td className="p-4">4.5</td>
                    <td className="p-4">38</td>
                    <td className="p-4">24</td>
                    <td className="p-4">9.4</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4">8</td>
                    <td className="p-4">5.5</td>
                    <td className="p-4">39</td>
                    <td className="p-4">25</td>
                    <td className="p-4">9.8</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">9</td>
                    <td className="p-4">6.5</td>
                    <td className="p-4">40.5</td>
                    <td className="p-4">26</td>
                    <td className="p-4">10.2</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4">10</td>
                    <td className="p-4">7.5</td>
                    <td className="p-4">42</td>
                    <td className="p-4">27</td>
                    <td className="p-4">10.6</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4">11</td>
                    <td className="p-4">8.5</td>
                    <td className="p-4">43</td>
                    <td className="p-4">28</td>
                    <td className="p-4">11.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Kids' Shoes */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Kids' Shoes</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-4 text-left">US</th>
                    <th className="p-4 text-left">UK</th>
                    <th className="p-4 text-left">EU</th>
                    <th className="p-4 text-left">Approx. Age</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">1C</td>
                    <td className="p-4">0.5</td>
                    <td className="p-4">16</td>
                    <td className="p-4">0-3 months</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4">2C</td>
                    <td className="p-4">1.5</td>
                    <td className="p-4">17</td>
                    <td className="p-4">3-6 months</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">3C</td>
                    <td className="p-4">2.5</td>
                    <td className="p-4">18.5</td>
                    <td className="p-4">6-9 months</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4">4C</td>
                    <td className="p-4">3.5</td>
                    <td className="p-4">19.5</td>
                    <td className="p-4">9-12 months</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">5C</td>
                    <td className="p-4">4.5</td>
                    <td className="p-4">21</td>
                    <td className="p-4">1-2 years</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4">6C</td>
                    <td className="p-4">5.5</td>
                    <td className="p-4">22</td>
                    <td className="p-4">2-3 years</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">7C</td>
                    <td className="p-4">6.5</td>
                    <td className="p-4">23.5</td>
                    <td className="p-4">3-4 years</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4">11C</td>
                    <td className="p-4">10.5</td>
                    <td className="p-4">28</td>
                    <td className="p-4">5-6 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Men's Clothing */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Men's Clothing</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-4 text-left">Size</th>
                    <th className="p-4 text-left">Chest (in)</th>
                    <th className="p-4 text-left">Waist (in)</th>
                    <th className="p-4 text-left">Hips (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">XS</td>
                    <td className="p-4">33-35</td>
                    <td className="p-4">27-29</td>
                    <td className="p-4">33-35</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4">S</td>
                    <td className="p-4">35-37</td>
                    <td className="p-4">29-31</td>
                    <td className="p-4">35-37</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">M</td>
                    <td className="p-4">37-40</td>
                    <td className="p-4">31-34</td>
                    <td className="p-4">37-40</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4">L</td>
                    <td className="p-4">40-44</td>
                    <td className="p-4">34-38</td>
                    <td className="p-4">40-44</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">XL</td>
                    <td className="p-4">44-48</td>
                    <td className="p-4">38-43</td>
                    <td className="p-4">44-48</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4">XXL</td>
                    <td className="p-4">48-52</td>
                    <td className="p-4">43-48</td>
                    <td className="p-4">48-52</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Women's Clothing */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Women's Clothing</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-4 text-left">Size</th>
                    <th className="p-4 text-left">Bust (in)</th>
                    <th className="p-4 text-left">Waist (in)</th>
                    <th className="p-4 text-left">Hips (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">XS (0-2)</td>
                    <td className="p-4">31-33</td>
                    <td className="p-4">24-26</td>
                    <td className="p-4">34-36</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4">S (4-6)</td>
                    <td className="p-4">33-35</td>
                    <td className="p-4">26-28</td>
                    <td className="p-4">36-38</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">M (8-10)</td>
                    <td className="p-4">35-37</td>
                    <td className="p-4">28-30</td>
                    <td className="p-4">38-40</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4">L (12-14)</td>
                    <td className="p-4">37-40</td>
                    <td className="p-4">30-33</td>
                    <td className="p-4">40-43</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">XL (16-18)</td>
                    <td className="p-4">40-43</td>
                    <td className="p-4">33-37</td>
                    <td className="p-4">43-47</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4">XXL (20-22)</td>
                    <td className="p-4">43-47</td>
                    <td className="p-4">37-41</td>
                    <td className="p-4">47-51</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Tips Section */}
          <section className="mb-16">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-start gap-4">
                <Info className="w-8 h-8 text-black flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-4">Sizing Tips</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>
                      • Measure your feet at the end of the day when
                      they&apos;re largest
                    </li>
                    <li>
                      • Wear the type of socks you'll wear with the shoes when
                      measuring
                    </li>
                    <li>
                      • Stand on a piece of paper and trace your foot for the
                      most accurate measurement
                    </li>
                    <li>
                      • For clothing, measure over undergarments for the most
                      accurate fit
                    </li>
                    <li>
                      • Different brands may have slight variations in sizing -
                      always check the specific product measurements
                    </li>
                    <li>
                      • If you&apos;re between sizes, consider the style and fit
                      you prefer
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Still Unsure About Your Size?
            </h2>
            <p className="text-gray-600 mb-6">
              Contact our customer service team for personalized sizing
              assistance
            </p>
            <a
              href="/contact-us"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
