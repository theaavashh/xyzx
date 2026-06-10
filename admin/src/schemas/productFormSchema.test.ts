import { describe, it, expect } from 'vitest';
import { ProductFormSchema, PricingTierSchema, DimensionsSchema } from './productFormSchema';

describe('productFormSchema', () => {
  describe('PricingTierSchema', () => {
    it('validates valid pricing tier', () => {
      const result = PricingTierSchema.safeParse({
        minQuantity: 10,
        price: 29.99,
      });
      expect(result.success).toBe(true);
    });

    it('rejects negative price', () => {
      const result = PricingTierSchema.safeParse({
        minQuantity: 10,
        price: -5,
      });
      expect(result.success).toBe(false);
    });

    it('rejects minQuantity less than 1', () => {
      const result = PricingTierSchema.safeParse({
        minQuantity: 0,
        price: 29.99,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('DimensionsSchema', () => {
    it('validates valid dimensions', () => {
      const result = DimensionsSchema.safeParse({
        length: 10,
        width: 5,
        height: 3,
      });
      expect(result.success).toBe(true);
    });

    it('rejects negative dimensions', () => {
      const result = DimensionsSchema.safeParse({
        length: -1,
        width: 5,
        height: 3,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('ProductFormSchema', () => {
    it('validates minimal valid product', () => {
      const result = ProductFormSchema.safeParse({
        name: 'Test Product',
        description: 'A test product',
        tags: [],
        isVariant: false,
        showIngredients: false,
        showDisclaimer: false,
        showAdditionalDetails: false,
        showMaterialCare: false,
        trackQuantity: false,
        quantity: 0,
        lowStockThreshold: 0,
        allowBackorder: false,
        manageStock: false,
        weight: 1,
        weightUnit: 'kg',
        dimensions: { length: 10, width: 5, height: 3, unit: 'cm' },
        images: [],
        videos: [],
        seoKeywords: [],
        isActive: true,
        isDigital: false,
        isFeatured: false,
        isNew: false,
        isOnSale: false,
        isBestSeller: false,
        isSales: false,
        isNewSeller: false,
        isFestivalOffer: false,
        visibility: 'public',
        requiresShipping: true,
        freeShipping: false,
        taxable: false,
        variantAttributes: [],
      });
      expect(result.success).toBe(true);
    });

    it('rejects name shorter than 3 characters', () => {
      const result = ProductFormSchema.safeParse({
        name: 'AB',
        description: 'A test product',
        tags: [],
        isVariant: false,
        showIngredients: false,
        showDisclaimer: false,
        showAdditionalDetails: false,
        showMaterialCare: false,
        trackQuantity: false,
        quantity: 0,
        lowStockThreshold: 0,
        allowBackorder: false,
        manageStock: false,
        weight: 1,
        weightUnit: 'kg',
        dimensions: { length: 10, width: 5, height: 3, unit: 'cm' },
        images: [],
        videos: [],
        seoKeywords: [],
        isActive: true,
        isDigital: false,
        isFeatured: false,
        isNew: false,
        isOnSale: false,
        isBestSeller: false,
        isSales: false,
        isNewSeller: false,
        isFestivalOffer: false,
        visibility: 'public',
        requiresShipping: true,
        freeShipping: false,
        taxable: false,
        variantAttributes: [],
      });
      expect(result.success).toBe(false);
    });

    it('rejects negative quantity', () => {
      const result = ProductFormSchema.safeParse({
        name: 'Test Product',
        description: 'A test product',
        tags: [],
        isVariant: false,
        showIngredients: false,
        showDisclaimer: false,
        showAdditionalDetails: false,
        showMaterialCare: false,
        trackQuantity: false,
        quantity: -1,
        lowStockThreshold: 0,
        allowBackorder: false,
        manageStock: false,
        weight: 1,
        weightUnit: 'kg',
        dimensions: { length: 10, width: 5, height: 3, unit: 'cm' },
        images: [],
        videos: [],
        seoKeywords: [],
        isActive: true,
        isDigital: false,
        isFeatured: false,
        isNew: false,
        isOnSale: false,
        isBestSeller: false,
        isSales: false,
        isNewSeller: false,
        isFestivalOffer: false,
        visibility: 'public',
        requiresShipping: true,
        freeShipping: false,
        taxable: false,
        variantAttributes: [],
      });
      expect(result.success).toBe(false);
    });
  });
});
