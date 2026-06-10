'use client';


import { clientLogger } from '@/lib/logger';
import api from '@/services/apiClient';

import { motion } from 'framer-motion';
import {
  Camera,
  CheckCircle,
  DollarSign,
  FileText,
  Layers,
  Package,
  Plus,
  Save,
  Search,
  Settings,
  X,
} from 'lucide-react';
import type { SVGProps } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import BasicInfoTab, { validateBasicInfo } from './product-form/BasicInfoTab';
import MediaTab, { validateMedia } from './product-form/MediaTab';
import VariantsTab, { validateVariants } from './product-form/VariantsTab';
import type { VariantsTabProps } from './product-form/VariantsTab';
import PricingTab, { validatePricing } from './product-form/PricingTab';
import InventoryTab, { validateInventory } from './product-form/InventoryTab';
import SeoTab, { validateSeo } from './product-form/SeoTab';
import AdvancedTab, { validateAdvanced } from './product-form/AdvancedTab';
import type {
  PricingTier,
  CurrencyPrice,
  ProductAttribute,
  Category,
  ProductFormData,
  Variant,
} from '@/types';

interface ColorOption {
  name: string;
  images: string[];
}

interface GeneratedVariant {
  id: string;
  name: string;
  sku: string;
  size: string;
  color: string;
  pattern: string;
  quantity: number;
  price?: number | { usd?: number; eur?: number; gbp?: number; inr?: number };
  comparePrice?: number;
  barcode?: string;
  images?: string[];
  isActive?: boolean;
  isDefault?: boolean;
}

interface CompleteProductData extends ProductFormData {
  pricingTiers?: PricingTier[];
  currencyPrices?: CurrencyPrice[];
  attributes?: ProductAttribute[];
  variants?: Variant[];
  comparePrice?: number;
  originalPrice?: number;
  costPrice?: number;
  discountPercent?: number;
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompleteProductData) => void;
  initialData?: CompleteProductData;
  isLoading?: boolean;
  categories?: Category[];
  onSuccess?: () => void;
}

const getDefaultFormData = (): ProductFormData => ({
  name: '',
  productCode: '',
  categoryId: '',
  subCategoryId: '',
  tags: [],
  isVariant: false,
  description: '',
  shortDescription: '',
  disclaimer: '',
  materialCare: '',
  showIngredients: false,
  showDisclaimer: false,
  showAdditionalDetails: false,
  showMaterialCare: false,
  gender: '',
  season: '',
  material: '',
  occasion: '',
  fitType: '',
  pattern: '',
  sleeveStyle: '',
  neckStyle: '',
  washCare: '',
  sku: '',
  barcode: '',
  upc: '',
  ean: '',
  isbn: '',
  trackQuantity: true,
  quantity: 0,
  lowStockThreshold: 5,
  allowBackorder: false,
  manageStock: true,
  weight: 0,
  weightUnit: 'kg',
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
    unit: 'cm',
  },
  images: [],
  videos: [],
  thumbnail: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: [],
  slug: '',
  metaTags: {},
  canonicalUrl: '',
  robotsMeta: 'index,follow',
  seoFriendlyImageFilename: '',
  imageAltText: '',
  productSchema: '',
  brandSchema: '',
  breadcrumbSchema: '',
  itemListSchema: '',
  faqSchema: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  twitterCardMeta: '',
  productDescription: '',
  faqs: '',
  isActive: true,
  isDigital: false,
  isFeatured: false,
  isNew: false,
  isOnSale: false,
  isBestSeller: false,
  isSales: false,
  isNewSeller: false,
  isFestivalOffer: false,
  visibility: 'VISIBLE',
  publishedAt: '',
  requiresShipping: true,
  shippingClass: '',
  freeShipping: false,
  taxable: true,
  taxClass: '',
  notes: '',
  variantAttributes: [],
});

export default function EnhancedProductForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  categories = [],
  // brands = [], // Removed brands prop
  onSuccess,
}: ProductFormProps) {
  const [activeTab, setActiveTab] = useState('identity');
  const [formData, setFormData] = useState<ProductFormData>(() => {
    const defaults = getDefaultFormData();
    if (!initialData) return defaults;
    return {
      ...defaults,
      ...initialData,
      dimensions: initialData.dimensions ?? defaults.dimensions,
    };
  });

  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>(
    initialData?.pricingTiers || [],
  );
  const [currencyPrices, setCurrencyPrices] = useState<CurrencyPrice[]>(() => {
    if (initialData?.currencyPrices && initialData.currencyPrices.length > 0) {
      return initialData.currencyPrices;
    }
    if (initialData?.price && initialData.price > 0) {
      return [{
        country: 'Australia',
        currency: 'AUD',
        symbol: 'A$',
        price: initialData.price,
        comparePrice: initialData.comparePrice || 0,
        minDeliveryDays: 1,
        maxDeliveryDays: 7,
        isActive: true,
      }];
    }
    return [];
  });
  const [attributes, setAttributes] = useState<ProductAttribute[]>(
    initialData?.attributes || [],
  );
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newPricingTier, setNewPricingTier] = useState<PricingTier>({
    minQuantity: 1,
    price: 0,
  });
  const [newCurrencyPrice, setNewCurrencyPrice] = useState<CurrencyPrice>({
    country: '',
    currency: 'USD',
    symbol: '$',
    price: 0,
    comparePrice: 0,
    isActive: true,
  });
  const [newAttribute, setNewAttribute] = useState<ProductAttribute>({
    name: '',
    value: '',
    type: 'TEXT',
    isRequired: false,
    isFilterable: true,
    sortOrder: 0,
  });

  // Variant attributes for new matrix-style variant management
  const [variantAttributes, setVariantAttributes] = useState<
    Array<{
      id: string;
      name: string;
      type: 'color' | 'pattern' | 'size';
      options: Array<{
        id: string;
        name: string;
        value: string;
        image?: string;
      }>;
    }>
  >([]);

  // Selected variant options
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<ColorOption[]>([]);
  const [newColorName, setNewColorName] = useState('');
  const [autoGeneratedVariants, setAutoGeneratedVariants] = useState<
    GeneratedVariant[]
  >([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [attributeOptions, setAttributeOptions] = useState<Record<string, Array<{ value: string; label: string }>>>({});

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get('/api/v1/attribute-options');
        const data = res.data?.data ?? res.data ?? [];
        const grouped: Record<string, Array<{ value: string; label: string }>> = {};
        for (const opt of data) {
          if (!grouped[opt.type]) grouped[opt.type] = [];
          grouped[opt.type].push({ value: opt.value, label: opt.label || opt.value });
        }
        setAttributeOptions(grouped);
      } catch {
        // silently fail — form works with hardcoded fallbacks
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const validAttributes = variantAttributes.filter((attr) => attr.options.length > 0);
    if (validAttributes.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAutoGeneratedVariants([]);
      return;
    }

    const generateCombinations = (
      attrs: typeof variantAttributes,
      index: number,
      current: Record<string, string>,
    ): Record<string, string>[] => {
      if (index === attrs.length) {
        return [current];
      }
      const attr = attrs[index];
      if (attr.options.length === 0) {
        return generateCombinations(attrs, index + 1, current);
      }
      const combinations: Record<string, string>[] = [];
      for (const option of attr.options) {
        const newCurrent = { ...current, [attr.id]: option.id };
        combinations.push(...generateCombinations(attrs, index + 1, newCurrent));
      }
      return combinations;
    };

    const combinations = generateCombinations(validAttributes, 0, {});
    const newVariants: GeneratedVariant[] = combinations.map((combination) => {
      const variantId = Object.entries(combination)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, v]) => v)
        .join('-');

      const existing = autoGeneratedVariants.find((v) => v.id === variantId);

      const getOptionName = (attrId: string, optionId: string) => {
        const attr = variantAttributes.find((a) => a.id === attrId);
        const option = attr?.options.find((o) => o.id === optionId);
        return option?.name || '';
      };

      const name = Object.entries(combination)
        .map(([attrId, optionId]) => getOptionName(attrId, optionId))
        .join(' / ');

      return {
        id: variantId,
        name,
        sku: existing?.sku || `${formData.sku}-${variantId}`.toUpperCase(),
        size: combination['size'] || '',
        color: combination['color'] || '',
        pattern: combination['pattern'] || '',
        quantity: existing?.quantity ?? 1,
        price: existing?.price ?? currencyPrices?.[0]?.price ?? 0,
        comparePrice: existing?.comparePrice ?? currencyPrices?.[0]?.comparePrice,
        barcode: existing?.barcode || '',
        images: existing?.images || [],
        isActive: existing?.isActive ?? true,
        isDefault: existing?.isDefault ?? false,
      };
    });

    const existingIds = new Set(newVariants.map((v) => v.id));
    const hasChanges =
      newVariants.length !== autoGeneratedVariants.length ||
      autoGeneratedVariants.some((v) => !existingIds.has(v.id));

    if (hasChanges) {
      setAutoGeneratedVariants(newVariants);
    }
  }, [variantAttributes]);

  // State to track if slug has been manually edited
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    !!initialData?.slug && !!initialData?.slug.trim(),
  ); // Set to true if editing existing product with a non-empty slug

  // Effect to reset form when initialData changes (for edit mode)
  const prevInitialDataRef = useRef<CompleteProductData | undefined>(undefined);

  useEffect(() => {
    if (initialData && initialData !== prevInitialDataRef.current) {
      setFormData({
        // Product Identity
        name: initialData?.name || '',
        productCode: initialData?.productCode || '',
        categoryId: initialData?.categoryId || '',
        subCategoryId: initialData?.subCategoryId || '',
        // brand: initialData?.brand || "", // Removed brand field
        tags: initialData?.tags || [],
        isVariant: initialData?.isVariant ?? true,

        // Basic Information
        description: initialData?.description || '',
        shortDescription: initialData?.shortDescription || '',
        disclaimer: initialData?.disclaimer || '',
        materialCare: initialData?.materialCare || '',
        showIngredients: initialData?.showIngredients ?? false,
        showDisclaimer: initialData?.showDisclaimer ?? false,
        showAdditionalDetails: initialData?.showAdditionalDetails ?? false,
        showMaterialCare: initialData?.showMaterialCare ?? false,

        // Product Attributes
        gender: initialData?.gender || '',
        season: initialData?.season || '',
        material: initialData?.material || '',
        occasion: initialData?.occasion || '',
        fitType: initialData?.fitType || '',
        pattern: initialData?.pattern || '',
        sleeveStyle: initialData?.sleeveStyle || '',
        neckStyle: initialData?.neckStyle || '',
        washCare: initialData?.washCare || '',

        // Product Identification
        sku: initialData?.sku || '',
        barcode: initialData?.barcode || '',
        upc: initialData?.upc || '',
        ean: initialData?.ean || '',
        isbn: initialData?.isbn || '',

        // Inventory
        trackQuantity: initialData?.trackQuantity ?? true,
        quantity: initialData?.quantity || 0,
        lowStockThreshold: initialData?.lowStockThreshold || 5,
        allowBackorder: initialData?.allowBackorder ?? false,
        manageStock: initialData?.manageStock ?? true,

        // Physical Properties
        weight: initialData?.weight || 0,
        weightUnit: initialData?.weightUnit || 'kg',
        dimensions: initialData?.dimensions || {
          length: 0,
          width: 0,
          height: 0,
          unit: 'cm',
        },

        // Media
        images: initialData?.images || [],
        videos: initialData?.videos || [],
        thumbnail: initialData?.thumbnail || '',

        // SEO
        seoTitle: initialData?.seoTitle || '',
        seoDescription: initialData?.seoDescription || '',
        seoKeywords: initialData?.seoKeywords || [],
        slug: initialData?.slug || '',
        metaTags: initialData?.metaTags || {},
        canonicalUrl: initialData?.canonicalUrl || '',
        robotsMeta: initialData?.robotsMeta || 'index,follow',
        seoFriendlyImageFilename: initialData?.seoFriendlyImageFilename || '',
        imageAltText: initialData?.imageAltText || '',
        productSchema: initialData?.productSchema || '',
        brandSchema: initialData?.brandSchema || '',
        breadcrumbSchema: initialData?.breadcrumbSchema || '',
        itemListSchema: initialData?.itemListSchema || '',
        faqSchema: initialData?.faqSchema || '',
        ogTitle: initialData?.ogTitle || '',
        ogDescription: initialData?.ogDescription || '',
        ogImage: initialData?.ogImage || '',
        twitterCardMeta: initialData?.twitterCardMeta || '',
        productDescription: initialData?.productDescription || '',
        faqs: initialData?.faqs || '',

        // Status
        isActive: initialData?.isActive ?? true,
        isDigital: initialData?.isDigital ?? false,
        isFeatured: initialData?.isFeatured ?? false,
        isNew: initialData?.isNew ?? false,
        isOnSale: initialData?.isOnSale ?? false,
        isBestSeller: initialData?.isBestSeller ?? false,
        isSales: initialData?.isSales ?? false,
        isNewSeller: initialData?.isNewSeller ?? false,
        isFestivalOffer: initialData?.isFestivalOffer ?? false,
        visibility: initialData?.visibility || 'VISIBLE',
        publishedAt: initialData?.publishedAt || '',

        // Shipping
        requiresShipping: initialData?.requiresShipping ?? true,
        shippingClass: initialData?.shippingClass || '',
        freeShipping: initialData?.freeShipping ?? false,

        // Tax
        taxable: initialData?.taxable ?? true,
        taxClass: initialData?.taxClass || '',

        // Additional
        notes: initialData?.notes || '',

        // Variant attributes
        variantAttributes: initialData?.variantAttributes || [],
      });

      // Reset additional states
      setPricingTiers(initialData?.pricingTiers || []);
      if (initialData?.currencyPrices && initialData.currencyPrices.length > 0) {
        setCurrencyPrices(initialData.currencyPrices);
      } else if (initialData?.price && initialData.price > 0) {
        setCurrencyPrices([{
          country: 'Australia',
          currency: 'AUD',
          symbol: 'A$',
          price: initialData.price,
          comparePrice: initialData.comparePrice || 0,
          minDeliveryDays: 1,
          maxDeliveryDays: 7,
          isActive: true,
        }]);
      } else {
        setCurrencyPrices([]);
      }
      setAttributes(initialData?.attributes || []);

      // Load variant attributes (handle both string[] and object[] formats)
      const rawAttributes = initialData?.variantAttributes || [];
      if (rawAttributes.length > 0 && typeof rawAttributes[0] !== 'string') {
        setVariantAttributes(rawAttributes as never);
      } else {
        setVariantAttributes(
          (rawAttributes as string[]).map((name) => ({
            id: name,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            type: name as 'color' | 'size' | 'pattern',
            options: [],
          }))
        );
      }

      // Build attribute type-to-ID mapping for consistent variant IDs
      const attrTypeToId: Record<string, string> = {};
      const rawAttrs: unknown = initialData?.variantAttributes || [];
      if (Array.isArray(rawAttrs) && rawAttrs.length > 0 && typeof rawAttrs[0] !== 'string') {
        (rawAttrs as { type: string; id: string }[]).forEach((attr) => {
          attrTypeToId[attr.type] = attr.id;
        });
      } else {
        (rawAttrs as string[]).forEach((name) => {
          attrTypeToId[name] = name;
        });
      }

      // Load variants from initial data
      if (initialData?.variants && Array.isArray(initialData.variants) && initialData.variants.length > 0) {
        const loadedVariants = initialData.variants.map((v: Variant) => {
          const getPrice = (price: unknown): number => {
            if (!price) return 0;
            if (typeof price === 'number') return price;
            if (typeof price === 'object') return (price as { usd?: number }).usd || 0;
            return 0;
          };
          const combination: Record<string, string> = {};
          if (v.combination) {
            Object.assign(combination, v.combination);
          }
          if (attrTypeToId['color'] && !combination[attrTypeToId['color']] && v.color) combination[attrTypeToId['color']] = v.color;
          if (attrTypeToId['size'] && !combination[attrTypeToId['size']] && v.size) combination[attrTypeToId['size']] = v.size;
          if (attrTypeToId['pattern'] && !combination[attrTypeToId['pattern']] && v.pattern) combination[attrTypeToId['pattern']] = v.pattern;
          const variantId = Object.entries(combination)
            .filter(([, val]) => val && val.trim() !== '')
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([, val]) => val)
            .join('-');
          return {
            id: variantId || `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: v.name || '',
            sku: v.sku || '',
            size: v.size || '',
            color: v.color || '',
            pattern: v.pattern || '',
            quantity: v.quantity ?? v.stock ?? 0,
            price: getPrice(v.price),
            comparePrice: v.comparePrice,
            barcode: v.barcode || '',
            images: v.images || [],
            isActive: v.isActive ?? true,
            isDefault: v.isDefault ?? false,
          };
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAutoGeneratedVariants(loadedVariants);
      } else {
        setAutoGeneratedVariants([]);
      }

      // Update slug tracking
      setSlugManuallyEdited(!!initialData?.slug && !!initialData?.slug.trim());
    } else if (!initialData && initialData !== prevInitialDataRef.current) {
      setFormData({
        name: '',
        productCode: '',
        categoryId: '',
        subCategoryId: '',
        tags: [],
        isVariant: true,
        description: '',
        shortDescription: '',
        disclaimer: '',
        materialCare: '',
        showIngredients: false,
        showDisclaimer: false,
        showAdditionalDetails: false,
        showMaterialCare: false,
        gender: '',
        season: '',
        material: '',
        occasion: '',
        fitType: '',
        pattern: '',
        sleeveStyle: '',
        neckStyle: '',
        washCare: '',
        sku: '',
        barcode: '',
        upc: '',
        ean: '',
        isbn: '',
        trackQuantity: true,
        quantity: 0,
        lowStockThreshold: 5,
        allowBackorder: false,
        manageStock: true,
        weight: 0,
        weightUnit: 'kg',
        dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
        images: [],
        videos: [],
        thumbnail: '',
        seoTitle: '',
        seoDescription: '',
        seoKeywords: [],
        slug: '',
        metaTags: {},
        canonicalUrl: '',
        robotsMeta: 'index,follow',
        seoFriendlyImageFilename: '',
        imageAltText: '',
        productSchema: '',
        brandSchema: '',
        breadcrumbSchema: '',
        itemListSchema: '',
        faqSchema: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterCardMeta: '',
        productDescription: '',
        faqs: '',
        isActive: true,
        isDigital: false,
        isFeatured: false,
        isNew: false,
        isOnSale: false,
        isBestSeller: false,
        isSales: false,
        isNewSeller: false,
        isFestivalOffer: false,
        visibility: 'VISIBLE',
        publishedAt: '',
        requiresShipping: true,
        shippingClass: '',
        freeShipping: false,
        taxable: true,
        taxClass: '',
        notes: '',
        variantAttributes: [],
      });
      setPricingTiers([]);
      setCurrencyPrices([]);
      setAttributes([]);
      setAutoGeneratedVariants([]);
      setSelectedSizes([]);
      setSelectedColors([]);
      setSlugManuallyEdited(false);
      setActiveTab('identity');
    }

    // Update previous reference
    prevInitialDataRef.current = initialData;
  }, [initialData]);

  const handleInputChange = useCallback((field: keyof ProductFormData, value: ProductFormData[keyof ProductFormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Effect to update slug when product name changes (only if slug hasn't been manually edited)
  useEffect(() => {
    // Only auto-update if slug hasn't been manually edited
    if (!slugManuallyEdited) {
      const autoGeneratedSlug = formData.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '-');

      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleInputChange('slug', autoGeneratedSlug);
    }
  }, [formData.name, slugManuallyEdited, handleInputChange]);

  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const tabs = [
    { id: 'identity', label: 'Product Identity', icon: Package },
    { id: 'details', label: 'Product Details', icon: FileText },
    { id: 'variants', label: 'Variant Management', icon: Layers },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'media', label: 'Media', icon: Camera },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleArrayChange = (
    field: string,
    value: string,
    action: 'add' | 'remove',
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        action === 'add'
          ? [...(prev[field as keyof typeof prev] as string[]), value]
          : (prev[field as keyof typeof prev] as string[]).filter(
              (item) => item !== value,
            ),
    }));
  };

  const addPricingTier = () => {
    if (newPricingTier.minQuantity && newPricingTier.price) {
      setPricingTiers((prev) => [
        ...prev,
        { ...newPricingTier, id: Date.now().toString() },
      ]);
      setNewPricingTier({ minQuantity: 1, price: 0 });
    }
  };

  const addCurrencyPrice = () => {
    if (
      newCurrencyPrice.country &&
      newCurrencyPrice.currency &&
      newCurrencyPrice.price
    ) {
      setCurrencyPrices((prev) => [
        ...prev,
        { ...newCurrencyPrice, id: Date.now().toString() },
      ]);
      setNewCurrencyPrice({
        country: '',
        currency: 'USD',
        symbol: '$',
        price: 0,
        comparePrice: 0,
        isActive: true,
      });
    }
  };

  const removeCurrencyPrice = (id: string) => {
    setCurrencyPrices((prev) => prev.filter((cp) => cp.id !== id));
  };

  const currencyOptions = [
    { country: 'Australia', currency: 'AUD', symbol: 'A$' },
    { country: 'New Zealand', currency: 'NZD', symbol: 'NZ$' },
  ];

  const removePricingTier = (id: string) => {
    setPricingTiers((prev) => prev.filter((tier) => tier.id !== id));
  };

  const addAttribute = () => {
    if (newAttribute.name && newAttribute.value) {
      setAttributes((prev) => [
        ...prev,
        { ...newAttribute, id: Date.now().toString() },
      ]);
      setNewAttribute({
        name: '',
        value: '',
        type: 'TEXT',
        isRequired: false,
        isFilterable: true,
        sortOrder: 0,
      });
    }
  };

  const removeAttribute = (id: string) => {
    setAttributes((prev) => prev.filter((attr) => attr.id !== id));
  };

  const getTabErrors = (tabId: string): Record<string, string> => {
    switch (tabId) {
      case 'identity':
      case 'details':
        return validateBasicInfo(formData as any);
      case 'variants':
        return validateVariants(autoGeneratedVariants as any);
      case 'pricing': {
        const prices = currencyPrices.length > 0
          ? currencyPrices
          : (formData.price && formData.price > 0
            ? [{
                country: 'Australia',
                currency: 'AUD',
                symbol: 'A$',
                price: formData.price,
                comparePrice: 0,
                minDeliveryDays: 1,
                maxDeliveryDays: 7,
                isActive: true,
              } as CurrencyPrice]
            : []);
        return validatePricing(prices);
      }
      case 'inventory':
        return validateInventory(formData as any);
      case 'media':
        return validateMedia(formData as any);
      case 'seo':
        return validateSeo(formData as any);
      case 'settings':
        return validateAdvanced(formData as any);
      default:
        return {};
    }
  };

  const validateTab = (tabId: string): boolean => {
    const errors = getTabErrors(tabId);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If no currency prices are added, create a default one from the existing price
    if (currencyPrices.length === 0 && formData.price && formData.price > 0) {
      setCurrencyPrices([{
        country: 'Australia',
        currency: 'AUD',
        symbol: 'A$',
        price: formData.price,
        comparePrice: 0,
        minDeliveryDays: 1,
        maxDeliveryDays: 7,
        isActive: true,
      }]);
    }

    const finalCurrencyPrices =
      currencyPrices.length > 0
        ? currencyPrices
        : formData.price && formData.price > 0
          ? [{
              country: 'Australia',
              currency: 'AUD',
              symbol: 'A$',
              price: formData.price,
              comparePrice: 0,
              minDeliveryDays: 1,
              maxDeliveryDays: 7,
              isActive: true,
            }]
          : [];

    // Set default price from first currency price if exists (for backward compatibility)
    const defaultPrice =
      finalCurrencyPrices.length > 0 ? finalCurrencyPrices[0].price : 0;

    // Create submission data without the sku field
    const {
      sku, // Remove this field
      ...formDataWithoutSku
    } = formData;

    const submissionData = {
      ...formDataWithoutSku,
      productCode: formData.slug || formData.productCode,
      isOnSale: formData.isSales,
      price: defaultPrice,
      comparePrice:
        finalCurrencyPrices.length > 0
          ? finalCurrencyPrices[0].comparePrice
          : 0,
      pricingTiers,
      attributes,
      currencyPrices: finalCurrencyPrices.map((cp) => ({
        country: cp.country,
        currency: cp.currency,
        symbol: cp.symbol,
        price: cp.price,
        comparePrice: cp.comparePrice,
        minDeliveryDays: cp.minDeliveryDays ?? 1,
        maxDeliveryDays: cp.maxDeliveryDays ?? 7,
        isActive: cp.isActive ?? true,
      })),
      variantAttributes,
      variants: autoGeneratedVariants as unknown as Variant[],
      selectedSizes,
      selectedColors,
    };

    // Validate all tabs before submit
    for (const tab of tabs) {
      const errors = getTabErrors(tab.id);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        const firstError = Object.values(errors)[0];
        if (firstError) toast.error(firstError);
        setActiveTab(tab.id);
        return;
      }
    }

    // Show success state briefly
    setShowSuccess(true);

    onSubmit(submissionData as any);

    // Clear form after successful submission (only for new products, not updates)
    if (!initialData) {
      setTimeout(() => {
        clearForm();
        setShowSuccess(false);
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
        // Optionally close's form after successful submission
        // Uncomment's next line if you want to auto-close after adding
        // onClose();
      }, 1500); // Show success for 1.5 seconds before clearing
    } else {
      // For updates, just hide success message after 1.5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    }
  };

  const clearForm = () => {
    setFormData(getDefaultFormData());

    setPricingTiers([]);
    setCurrencyPrices([]);
    setAttributes([]);
    setNewTag('');
    setNewKeyword('');
    setSelectedSizes([]);
    setSelectedColors([]);
    setAutoGeneratedVariants([]);
    setActiveTab('identity');
  };

  // CSV/Excel Import functionality
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      parseCSV(file);
    } else if (['xlsx', 'xls', 'xlsm'].includes(fileExtension || '')) {
      toast.error('Excel import is not supported. Please use CSV format.');
    } else {
      toast.error('Invalid file format. Please upload a CSV or Excel file.');
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const rows = text.split('\n').filter((row) => row.trim());
        if (rows.length === 0) {
          toast.error('CSV file is empty');
          return;
        }

        const headers = rows[0]
          .split(',')
          .map((h) => h.trim().replace(/^"|"$/g, ''));

        if (rows.length < 2) {
          toast.error('CSV file is empty or has no data rows');
          return;
        }

        // Parse data rows
        const dataRows: string[][] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row) continue;

          const cells: string[] = [];
          let cell = '';
          let inQuotes = false;

          for (let j = 0; j < row.length; j++) {
            const char = row[j];
            if (!char) continue;
            if (char === '"') {
              if (inQuotes && j + 1 < row.length && row[j + 1] === '"') {
                cell += '"';
                j++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              cells.push(cell.trim());
              cell = '';
            } else {
              cell += char;
            }
          }
          cells.push(cell.trim());
          dataRows.push(cells);
        }

        // Use the first data row
        if (dataRows.length > 0 && dataRows[0]) {
          mapRowToFormData(headers, dataRows[0]);
        }
      }
    };
    reader.readAsText(file);
  };


  const mapRowToFormData = (headers: string[], row: string[]) => {
    const getValue = (fieldName: string): string => {
      const index = headers.findIndex(
        (h) => h.toLowerCase() === fieldName.toLowerCase(),
      );
      if (index >= 0 && index < row.length) {
        const value = row[index];
        return value !== undefined && value !== null ? String(value) : '';
      }
      return '';
    };

    // Map fields to form data
    const name = getValue('name');
    const description = getValue('description');
    const categoryName = getValue('category');
    const categoryId =
      getValue('categoryId') ||
      getValue('category_id') ||
      getValue('categoryid');
    const tags = getValue('tags');
    const images = getValue('images');
    const weight = getValue('weight');
    const length = getValue('length');
    const width = getValue('width');
    const height = getValue('height');
    const stock = getValue('stock') || getValue('quantity');
    const price = getValue('price');
    const comparePrice =
      getValue('comparePrice') ||
      getValue('compare_price') ||
      getValue('compareprice');
    const sku = getValue('sku');
    const productCode =
      getValue('productCode') ||
      getValue('product_code') ||
      getValue('productcode');
    const barcode = getValue('barcode');
    const seoTitle =
      getValue('seoTitle') || getValue('seo_title') || getValue('seotitle');
    const seoDescription =
      getValue('seoDescription') ||
      getValue('seo_description') ||
      getValue('seodescription');

    // Update form data
    if (name) handleInputChange('name', name);
    if (description) handleInputChange('description', description);
    if (productCode) handleInputChange('productCode', productCode);
    if (sku) handleInputChange('sku', sku);
    if (barcode) handleInputChange('barcode', barcode);
    if (seoTitle) handleInputChange('seoTitle', seoTitle);
    if (seoDescription) handleInputChange('seoDescription', seoDescription);

    // Update category if found
    if (categoryId) {
      handleInputChange('categoryId', categoryId);
    } else if (categoryName && categories.length > 0) {
      const foundCategory = categories.find(
        (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
      );
      if (foundCategory) {
        handleInputChange('categoryId', foundCategory.id);
      }
    }

    // Update tags
    if (tags) {
      const tagList = tags
        .split(/[,;]/)
        .map((t) => t.trim())
        .filter((t) => t);
      tagList.forEach((tag) => {
        if (!formData.tags.includes(tag)) {
          handleArrayChange('tags', tag, 'add');
        }
      });
    }

    // Update images
    if (images) {
      const imageList = images
        .split(/[,;]/)
        .map((img) => img.trim())
        .filter((img) => img);
      handleInputChange('images', imageList);
    }

    // Update weight
    if (weight) {
      const weightNum = parseFloat(weight);
      if (!isNaN(weightNum)) {
        handleInputChange('weight', weightNum);
      }
    }

    // Update dimensions
    if (length || width || height) {
      const newDimensions = { ...formData.dimensions };
      if (length) {
        const lengthNum = parseFloat(length);
        if (!isNaN(lengthNum)) newDimensions.length = lengthNum;
      }
      if (width) {
        const widthNum = parseFloat(width);
        if (!isNaN(widthNum)) newDimensions.width = widthNum;
      }
      if (height) {
        const heightNum = parseFloat(height);
        if (!isNaN(heightNum)) newDimensions.height = heightNum;
      }
      handleInputChange('dimensions', newDimensions);
    }

    // Update quantity
    if (stock) {
      const stockNum = parseInt(stock);
      if (!isNaN(stockNum)) {
        handleInputChange('quantity', stockNum);
      }
    }

    // Update pricing
    if (price) {
      const priceNum = parseFloat(price);
      if (!isNaN(priceNum)) {
        const comparePriceNum = comparePrice ? parseFloat(comparePrice) : 0;
        const newCurrencyPrice: CurrencyPrice = {
          id: Date.now().toString(),
          country: 'USA',
          currency: 'USD',
          symbol: '$',
          price: priceNum,
          comparePrice:
            !isNaN(comparePriceNum) && comparePriceNum > 0
              ? comparePriceNum
              : undefined,
          isActive: true,
        };
        setCurrencyPrices((prev) => [...prev, newCurrencyPrice]);
      }
    }

    toast.success('Product data imported successfully!');
    setActiveTab('identity');
  };

  const downloadTemplate = () => {
    const template = `name,description,category,categoryId,tags,images,weight,length,width,height,stock,price,comparePrice,sku,productCode,barcode,seoTitle,seoDescription
"Sample Product","This is a sample product description","Electronics","","tag1;tag2","https://example.com/image1.jpg;https://example.com/image2.jpg",1.5,10,5,3,100,99.99,129.99,"SKU123","PROD123","123456789","Sample Product","Sample product description for SEO"`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded!');
  };

  // Navigation functions
  const getCurrentTabIndex = () => {
    return tabs.findIndex((tab) => tab.id === activeTab);
  };

  const handleNext = () => {
    const currentIndex = getCurrentTabIndex();
    const currentTab = tabs[currentIndex].id;

    if (!validateTab(currentTab)) {
      return;
    }

    setFormErrors({});
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const isFirstTab = getCurrentTabIndex() === 0;
  const isLastTab = getCurrentTabIndex() === tabs.length - 1;

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl"
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-black lastik">
                {initialData ? 'Edit Product' : 'New Product'}
              </h2>
              <p className="text-sm text-gray-400">
                {initialData ? 'Update the product details' : 'Fill in the product details'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/10 text-gray-600 text-xs font-medium rounded-lg ring-1 ring-[#D4AF37]/20">
              <span className="text-[#D4AF37]">{getCurrentTabIndex() + 1}</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-600">{tabs.length}</span>
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            className="mx-6 mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-emerald-100">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-emerald-800">
                {initialData
                  ? 'Product updated successfully!'
                  : 'Product added successfully!'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto px-4 flex-shrink-0 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 h-[520px]">
            {activeTab === 'identity' && (
              <BasicInfoTab
                formData={formData as any}
                categories={categories}
                errors={formErrors}
                onInputChange={(field, value) => handleInputChange(field as keyof ProductFormData, value as ProductFormData[keyof ProductFormData])}
                onArrayChange={handleArrayChange}
                newTag={newTag}
                onNewTagChange={setNewTag}
                section="identity"
                attributeOptions={attributeOptions}
              />
            )}
            {activeTab === 'details' && (
              <BasicInfoTab
                formData={formData as any}
                categories={categories}
                errors={formErrors}
                onInputChange={(field, value) => handleInputChange(field as keyof ProductFormData, value as ProductFormData[keyof ProductFormData])}
                onArrayChange={handleArrayChange}
                newTag={newTag}
                onNewTagChange={setNewTag}
                section="details"
                attributeOptions={attributeOptions}
              />
            )}

            {activeTab === 'variants' && (
              <VariantsTab
                variantAttributes={variantAttributes as VariantsTabProps['variantAttributes']}
                autoGeneratedVariants={autoGeneratedVariants as any}
                currencyPrices={currencyPrices}
                baseSku={formData.sku || ''}
                onAttributesChange={setVariantAttributes}
                onVariantsChange={setAutoGeneratedVariants}
                errors={formErrors}
              />
            )}

            {activeTab === 'pricing' && (
              <PricingTab
                currencyPrices={currencyPrices}
                errors={formErrors}
                onAddCurrencyPrice={(price) => {
                  setCurrencyPrices((prev) => [...prev, price as CurrencyPrice]);
                }}
                onRemoveCurrencyPrice={removeCurrencyPrice}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryTab
                formData={formData as any}
                errors={formErrors}
                onInputChange={(field, value) => handleInputChange(field as keyof ProductFormData, value as ProductFormData[keyof ProductFormData])}
              />
            )}

            {activeTab === 'media' && (
              <MediaTab
                formData={formData as any}
                errors={formErrors}
                onImagesChange={(images) => handleInputChange('images', images)}
              />
            )}

            {activeTab === 'seo' && (
              <SeoTab
                formData={formData as any}
                productName={formData.name}
                errors={formErrors}
                onInputChange={(field, value) => handleInputChange(field as keyof ProductFormData, value as ProductFormData[keyof ProductFormData])}
                onArrayChange={handleArrayChange}
                onSlugManuallyEdited={() => setSlugManuallyEdited(true)}
              />
            )}

            {activeTab === 'settings' && (
              <AdvancedTab
                formData={formData as any}
                onInputChange={(field, value) => handleInputChange(field as keyof ProductFormData, value as ProductFormData[keyof ProductFormData])}
              />
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-white flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm font-medium"
            >
              Cancel
            </button>
            {!isFirstTab && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm font-medium flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
            )}
          </div>

          <div className="flex gap-3">
            {!isLastTab && (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm font-medium flex items-center gap-1.5"
              >
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {isLastTab && (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : initialData ? (
                  <>
                    <Save className="w-4 h-4" />
                    Update Product
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Product
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
