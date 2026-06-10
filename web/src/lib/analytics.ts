/* Google Analytics and other analytics configuration */
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

// Event tracking functions
export const analytics = {
  pageView: (url: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    }
  },

  event: (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  },

  ecommerce: {
    purchase: (transactionData: any) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'purchase', transactionData);
      }
    },

    addToCart: (itemData: any) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'add_to_cart', itemData);
      }
    },

    removeFromCart: (itemData: any) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'remove_from_cart', itemData);
      }
    },

    viewItem: (itemData: any) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'view_item', itemData);
      }
    },
  },
};

// Structured data helpers
export const structuredData = {
  organization: {
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
  },

  website: {
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
  },
};
