export function OrganizationStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'RaphArch',
          url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rapharch.com',
          logo: `${process.env.NEXT_PUBLIC_SITE_URL}/raphard-logo.png`,
          description: 'Premium fashion and footwear retailer',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Fashion Avenue',
            addressLocality: 'New York',
            addressRegion: 'NY',
            postalCode: '10001',
            addressCountry: 'US',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-800-123-4567',
            contactType: 'customer service',
            availableLanguage: 'English',
          },
          sameAs: [
            'https://facebook.com/rapharch',
            'https://instagram.com/rapharch',
            'https://twitter.com/rapharch',
            'https://youtube.com/rapharch',
          ],
        }),
      }}
    />
  );
}

export function ProductStructuredData(product: any) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.images,
          brand: {
            '@type': 'Brand',
            name: 'RaphArch',
          },
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        }),
      }}
    />
  );
}

export function WebsiteStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'RaphArch',
          url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rapharch.com',
          description: 'Premium fashion and footwear retailer',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }),
      }}
    />
  );
}
