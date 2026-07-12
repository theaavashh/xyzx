'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  AlertCircle,
  Check,
  X,
  Image as ImageIcon,
  DollarSign,
  Package,
  Save,
  RefreshCw,
  Upload,
  Palette,
  Ruler,
  Layers,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface VariantOption {
  id: string;
  name: string;
  value: string;
  price?: number;
  comparePrice?: number;
  stock?: number;
  sku?: string;
  barcode?: string;
  image?: string;
  color?: string;
  patternImage?: string;
  isActive?: boolean;
  isDefault?: boolean;
}

interface VariantAttribute {
  id: string;
  name: string;
  type: 'color' | 'pattern' | 'size';
  options: VariantOption[];
}

interface GeneratedVariant {
  id: string;
  combination: Record<string, string>;
  price: number;
  comparePrice?: number;
  stock: number;
  sku: string;
  barcode?: string;
  images: string[];
  isActive: boolean;
  isDefault: boolean;
  label?: string;
}

type VariantGroup =
  | { group: 'color' | 'pattern' | 'all'; variants: GeneratedVariant[] }
  | GeneratedVariant[];

interface VariantMatrixProps {
  attributes: VariantAttribute[];
  onAttributesChange: (attributes: VariantAttribute[]) => void;
  variants: GeneratedVariant[];
  onVariantsChange: (variants: GeneratedVariant[]) => void;
  basePrice?: number;
  baseSku?: string;
}

const attributeTypes = [
  { value: 'color', label: 'Color', icon: Palette },
  { value: 'pattern', label: 'Pattern', icon: Layers },
  { value: 'size', label: 'Size', icon: Ruler },
];

const commonColors = [
  { name: 'Black', value: 'black', color: '#000000' },
  { name: 'White', value: 'white', color: '#FFFFFF' },
  { name: 'Navy', value: 'navy', color: '#000080' },
  { name: 'Red', value: 'red', color: '#DC2626' },
  { name: 'Pink', value: 'pink', color: '#EC4899' },
  { name: 'Brown', value: 'brown', color: '#92400E' },
  { name: 'Beige', value: 'beige', color: '#D4C4B0' },
  { name: 'Grey', value: 'grey', color: '#6B7280' },
  { name: 'Blue', value: 'blue', color: '#2563EB' },
  { name: 'Green', value: 'green', color: '#16A34A' },
  { name: 'Yellow', value: 'yellow', color: '#EAB308' },
  { name: 'Orange', value: 'orange', color: '#EA580C' },
  { name: 'Purple', value: 'purple', color: '#9333EA' },
  { name: 'Gold', value: 'gold', color: '#D4AF37' },
  { name: 'Silver', value: 'silver', color: '#C0C0C0' },
];

const commonSizes = [
  { name: 'XS', value: 'xs' },
  { name: 'S', value: 's' },
  { name: 'M', value: 'm' },
  { name: 'L', value: 'l' },
  { name: 'XL', value: 'xl' },
  { name: 'XXL', value: 'xxl' },
  { name: 'XXXL', value: 'xxxl' },
];

const commonPatterns = [
  { name: 'Leopard Print', value: 'leopard' },
  { name: 'Zebra Print', value: 'zebra' },
  { name: 'Floral', value: 'floral' },
  { name: 'Striped', value: 'striped' },
  { name: 'Plaid', value: 'plaid' },
  { name: 'Polka Dot', value: 'polka-dot' },
  { name: 'Paisley', value: 'paisley' },
  { name: 'Camouflage', value: 'camouflage' },
  { name: 'Houndstooth', value: 'houndstooth' },
  { name: 'Chevron', value: 'chevron' },
  { name: 'Abstract', value: 'abstract' },
  { name: 'Geometric', value: 'geometric' },
  { name: 'Tie Dye', value: 'tie-dye' },
  { name: 'Animal Print', value: 'animal-print' },
  { name: 'Tropical', value: 'tropical' },
  { name: 'Camel Print', value: 'camel-print' },
  { name: 'Snake Print', value: 'snake-print' },
  { name: 'Crocodile Print', value: 'crocodile-print' },
  { name: 'Solid', value: 'solid' },
];

const shoeSizes = [
  { name: '35', value: '35' },
  { name: '36', value: '36' },
  { name: '37', value: '37' },
  { name: '38', value: '38' },
  { name: '39', value: '39' },
  { name: '40', value: '40' },
  { name: '41', value: '41' },
  { name: '42', value: '42' },
  { name: '43', value: '43' },
  { name: '44', value: '44' },
  { name: '45', value: '45' },
];

const VariantMatrix: React.FC<VariantMatrixProps> = ({
  attributes,
  onAttributesChange,
  variants,
  onVariantsChange,
  basePrice = 0,
  baseSku = '',
}) => {
  const [showAddAttribute, setShowAddAttribute] = useState(false);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [newAttributeType, setNewAttributeType] = useState<
    'color' | 'size' | 'pattern'
  >('size');
  const [editingCell, setEditingCell] = useState<{
    variantId: string;
    field: string;
  } | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [showAddOption, setShowAddOption] = useState<string | null>(null);
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionColor, setNewOptionColor] = useState('#000000');
  const [initialized, setInitialized] = useState(false);
  const [newOptionImage, setNewOptionImage] = useState<string | null>(null);
  const [newOptionPattern, setNewOptionPattern] = useState<string | null>(null);
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [variantFilter, setVariantFilter] = useState<Record<string, string>>(
    {},
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const patternInputRef = useRef<HTMLInputElement>(null);

  const getDefaultOptionsForType = (type: string) => {
    switch (type) {
      case 'color':
        return [];
      case 'size':
        return commonSizes.map((s) => ({
          id: `size-${Date.now()}-${s.value}`,
          name: s.name,
          value: s.value,
          stock: 0,
          sku: '',
          isActive: true,
        }));
      case 'pattern':
        return [];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (!initialized && attributes.length === 0) {
      const defaultAttributes: VariantAttribute[] = [
        {
          id: 'color',
          name: 'Color',
          type: 'color',
          options: [],
        },
        {
          id: 'size',
          name: 'Size',
          type: 'size',
          options: [],
        },
      ];
      onAttributesChange(defaultAttributes);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitialized(true);
    }
  }, [initialized, attributes.length, onAttributesChange]);

  const generatedVariants = useMemo(() => {
    const validAttributes = attributes.filter(
      (attr) => attr.options.length > 0,
    );
    if (attributes.length === 0 || validAttributes.length === 0) {
      return [];
    }

    const generateCombinations = (
      attrs: VariantAttribute[],
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
        const newCurrent = { ...current, [attr.id]: (option as any).value || option.id };
        combinations.push(
          ...generateCombinations(attrs, index + 1, newCurrent),
        );
      }

      return combinations;
    };

    const buildVariant = (combination: Record<string, string>) => {
      const variantId = Object.entries(combination)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, v]) => v)
        .join('-');
      const existingVariant = variants.find((v) => v.id === variantId);

      const getCombinationLabel = () => {
        return Object.entries(combination)
          .map(([attrId, optionId]) => {
            const attr = attributes.find((a) => a.id === attrId);
            const option = attr?.options.find((o) => o.id === optionId);
            return option?.name || '';
          })
          .join(' / ');
      };

      return {
        id: variantId,
        combination,
        price: existingVariant?.price ?? basePrice,
        comparePrice: existingVariant?.comparePrice,
        stock: existingVariant?.stock ?? 1,
        sku: existingVariant?.sku ?? `${baseSku}-${variantId}`.toUpperCase(),
        barcode: existingVariant?.barcode || '',
        images: existingVariant?.images || [],
        isActive: existingVariant?.isActive ?? true,
        isDefault: existingVariant?.isDefault ?? false,
        label: getCombinationLabel(),
      };
    };

    const colorAttr = attributes.find((a) => a.type === 'color');
    const patternAttr = attributes.find((a) => a.type === 'pattern');
    const sizeAttr = attributes.find((a) => a.type === 'size');

    // If both color and pattern exist, generate separate groups
    if (colorAttr && patternAttr && sizeAttr) {
      const colorVariants = generateCombinations(
        [colorAttr, sizeAttr],
        0,
        {},
      ).map(buildVariant);

      const patternVariants = generateCombinations(
        [patternAttr, sizeAttr],
        0,
        {},
      ).map(buildVariant);

      return [
        { group: 'color' as const, variants: colorVariants },
        { group: 'pattern' as const, variants: patternVariants },
      ];
    }

    // Standard combination of all attributes
    const combinations = generateCombinations(validAttributes, 0, {});
    return [{ group: 'all' as const, variants: combinations.map(buildVariant) }];
  }, [attributes, variants, basePrice, baseSku]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    optionId?: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/file', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.data?.url || data.url;

        if (optionId) {
          const updatedAttributes = attributes.map((attr) => ({
            ...attr,
            options: attr.options.map((opt) =>
              opt.id === optionId ? { ...opt, image: imageUrl } : opt,
            ),
          }));
          onAttributesChange(updatedAttributes);
          toast.success('Image uploaded successfully');
        } else {
          setNewOptionImage(imageUrl);
          toast.success('Image uploaded successfully');
        }
      } else {
        toast.error('Failed to upload image');
      }
    } catch {
      toast.error('Failed to upload image');
    }
  };

  const handlePatternImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    optionId: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/file', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.data?.url || data.url;

        const updatedAttributes = attributes.map((attr) => ({
          ...attr,
          options: attr.options.map((opt) =>
            opt.id === optionId ? { ...opt, patternImage: imageUrl } : opt,
          ),
        }));
        onAttributesChange(updatedAttributes);
        toast.success('Pattern image uploaded');
      } else {
        toast.error('Failed to upload pattern image');
      }
    } catch {
      toast.error('Failed to upload pattern image');
    }
  };

  const addAttribute = () => {
    if (!newAttributeName.trim()) return;

    const newAttribute: VariantAttribute = {
      id: newAttributeName.toLowerCase().replace(/\s+/g, '-'),
      name: newAttributeName,
      type: newAttributeType,
      options: getDefaultOptionsForType(newAttributeType),
    };

    onAttributesChange([...attributes, newAttribute]);
    setNewAttributeName('');
    setNewAttributeType('size');
    setShowAddAttribute(false);
    toast.success(`${newAttributeName} attribute added`);
  };

  const removeAttribute = (attributeId: string) => {
    onAttributesChange(attributes.filter((attr) => attr.id !== attributeId));
    toast.success('Attribute removed');
  };

  const addOption = (attributeId: string) => {
    if (!newOptionName.trim() || !showAddOption) return;

    const newOption: VariantOption = {
      id: `${attributeId}-${Date.now()}`,
      name: newOptionName.trim(),
      value: newOptionName.trim().toLowerCase().replace(/\s+/g, '-'),
      stock: 0,
      sku: '',
      isActive: true,
    };

    if (newAttributeType === 'color') {
      newOption.color = newOptionColor;
    }

    if (newAttributeType === 'pattern') {
      newOption.patternImage = newOptionPattern || undefined;
    }

    if (newOptionImage) {
      newOption.image = newOptionImage;
    }

    const updatedAttributes = attributes.map((attr) =>
      attr.id === showAddOption
        ? { ...attr, options: [...attr.options, newOption] }
        : attr,
    );
    onAttributesChange(updatedAttributes);
    setShowAddOption(null);
    setNewOptionName('');
    setNewOptionColor('#000000');
    setNewOptionImage(null);
    setNewOptionPattern(null);
  };

  const removeOption = (attributeId: string, optionId: string) => {
    const updatedAttributes = attributes.map((attr) =>
      attr.id === attributeId
        ? {
            ...attr,
            options: attr.options.filter((opt) => opt.id !== optionId),
          }
        : attr,
    );
    onAttributesChange(updatedAttributes);
  };

  const toggleOptionActive = (attributeId: string, optionId: string) => {
    const updatedAttributes = attributes.map((attr) =>
      attr.id === attributeId
        ? {
            ...attr,
            options: attr.options.map((opt) =>
              opt.id === optionId ? { ...opt, isActive: !opt.isActive } : opt,
            ),
          }
        : attr,
    );
    onAttributesChange(updatedAttributes);
  };

  const handleVariantChange = (
    variantId: string,
    field: keyof GeneratedVariant,
    value: number | boolean | string[],
  ) => {
    if (field === 'stock' && typeof value === 'number') {
      if (value < 1) {
        toast.error('Stock must be at least 1');
        return;
      }
    }
    if (field === 'price' && typeof value === 'number') {
      if (value < 0) {
        toast.error('Price cannot be negative');
        return;
      }
    }
    const updatedVariants = variants.map((v) =>
      v.id === variantId ? { ...v, [field]: value } : v,
    );
    onVariantsChange(updatedVariants);
  };

  const setDefaultVariant = (variantId: string) => {
    const updatedVariants = variants.map((v) => ({
      ...v,
      isDefault: v.id === variantId,
    }));
    onVariantsChange(updatedVariants);
    toast.success('Default variant set');
  };

  const getOptionImage = (
    attributeId: string,
    optionId: string | undefined,
  ) => {
    if (!optionId) return undefined;
    const attribute = attributes.find((attr) => attr.id === attributeId);
    const option = attribute?.options.find((opt) => opt.id === optionId);
    return option?.image;
  };

  const getOptionColor = (
    attributeId: string,
    optionId: string | undefined,
  ) => {
    if (!optionId) return undefined;
    const attribute = attributes.find((attr) => attr.id === attributeId);
    const option = attribute?.options.find((opt) => opt.id === optionId);
    return option?.color;
  };

  const getOptionPattern = (
    attributeId: string,
    optionId: string | undefined,
  ) => {
    if (!optionId) return undefined;
    const attribute = attributes.find((attr) => attr.id === attributeId);
    const option = attribute?.options.find((opt) => opt.id === optionId);
    return option?.patternImage;
  };

  const getOptionName = (attributeId: string, optionId: string | undefined) => {
    if (!optionId) return '';
    const attribute = attributes.find((attr) => attr.id === attributeId);
    const option = attribute?.options.find((opt) => opt.id === optionId);
    return option?.name || '';
  };

  const isGrouped = generatedVariants.length > 0 && 'variants' in generatedVariants[0];
  const totalVariants = isGrouped
    ? (generatedVariants as { group: string; variants: GeneratedVariant[] }[]).reduce((sum, group) => sum + group.variants.length, 0)
    : generatedVariants.length;
  const activeVariants = isGrouped
    ? (generatedVariants as { group: string; variants: GeneratedVariant[] }[]).reduce((sum, group) => sum + group.variants.filter((v) => v.isActive).length, 0)
    : (generatedVariants as unknown as GeneratedVariant[]).filter((v) => v.isActive).length;
  const totalStock = isGrouped
    ? (generatedVariants as { group: string; variants: GeneratedVariant[] }[]).reduce((sum, group) => sum + group.variants.reduce((s, v) => s + (v.stock || 0), 0), 0)
    : (generatedVariants as unknown as GeneratedVariant[]).reduce((sum, v) => sum + (v.stock || 0), 0);
  const outOfStock = isGrouped
    ? (generatedVariants as { group: string; variants: GeneratedVariant[] }[]).reduce((sum, group) => sum + group.variants.filter((v) => v.stock === 0).length, 0)
    : (generatedVariants as unknown as GeneratedVariant[]).filter((v) => v.stock === 0).length;

  return (
    <div className="space-y-6">
      {/* Attributes Section */}
      <div className="bg-white rounded-lg p-5 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">
            Variant Attributes
          </h3>
          <button
            type="button"
            onClick={() => setShowAddAttribute(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Attribute
          </button>
        </div>

        <div className="space-y-4">
          {attributes.map((attr) => (
            <div
              key={attr.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      attr.type === 'color'
                        ? 'bg-pink-100 text-black'
                        : attr.type === 'pattern'
                          ? 'bg-purple-100 text-black'
                          : attr.type === 'size'
                            ? 'bg-blue-100 text-black'
                            : attr.type === 'material'
                              ? 'bg-green-100 text-black'
                              : 'bg-gray-100 text-black'
                    }`}
                  >
                    {attr.type}
                  </span>
                  <h4 className="font-medium text-black">{attr.name}</h4>
                  <span className="text-sm text-black">
                    ({attr.options.length} options)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttribute(attr.id)}
                  className="text-black hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Options Grid */}
              <div className="flex flex-wrap gap-2">
                {attr.type === 'color'
                  ? attr.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`relative group p-1 rounded-lg border-2 transition-all ${
                          opt.isActive
                            ? 'border-amber-500'
                            : 'border-gray-200 opacity-50'
                        }`}
                      >
                        <div className="relative">
                          <div
                            className="w-12 h-12 rounded-lg border border-gray-200"
                            style={{ backgroundColor: opt.color || '#ccc' }}
                          />
                          {!opt.isActive && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                              <EyeOff className="w-4 h-4 text-black" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-center mt-1">{opt.name}</p>
                        <button
                          type="button"
                          onClick={() => removeOption(attr.id, opt.id)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  : attr.type === 'pattern'
                    ? attr.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`relative group p-1 rounded-lg border-2 transition-all ${
                            opt.isActive
                              ? 'border-amber-500'
                              : 'border-gray-200 opacity-50'
                          }`}
                        >
                          <div className="relative">
                            {opt.patternImage ? (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                                <Image
                                  src={opt.patternImage}
                                  alt={opt.name}
                                  fill
                                  className="object-cover"
                                />
                                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handlePatternImageUpload(e, opt.id)
                                    }
                                  />
                                  <Upload className="w-5 h-5 text-white" />
                                </label>
                              </div>
                            ) : (
                              <label className="relative w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer hover:border-amber-500 transition-colors">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handlePatternImageUpload(e, opt.id)
                                  }
                                />
                                <Upload className="w-6 h-6 text-gray-400" />
                              </label>
                            )}
                            {!opt.isActive && (
                              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                                <EyeOff className="w-4 h-4 text-black" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-center mt-1 max-w-16 truncate">
                            {opt.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeOption(attr.id, opt.id)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    : attr.type === 'size'
                    ? attr.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`relative group px-4 py-2 rounded-lg border-2 transition-all ${
                            opt.isActive
                              ? 'border-amber-500 bg-amber-50 text-black'
                              : 'border-gray-200 bg-gray-50 text-black'
                          }`}
                        >
                          <span className="font-medium">{opt.name}</span>
                          {!opt.isActive && (
                            <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                              <EyeOff className="w-4 h-4 text-black" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeOption(attr.id, opt.id)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    : attr.options.map((opt) => (
                        <div
                          key={opt.id}
                          className="relative group flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <span className="text-sm">{opt.name}</span>
                          <button
                            type="button"
                            onClick={() => removeOption(attr.id, opt.id)}
                            className="text-black hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                {/* Add Option Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowAddOption(attr.id);
                    setNewAttributeType(attr.type);
                  }}
                  className="flex items-center gap-1 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-black hover:border-amber-500 hover:text-black transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add</span>
                </button>
              </div>
            </div>
          ))}

          {attributes.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Package className="w-12 h-12 mx-auto text-black mb-3" />
              <p className="text-black">No attributes added yet</p>
              <p className="text-sm text-black">
                Add attributes like Color, Size, Pattern, etc.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Variants List */}
      {generatedVariants.length > 0 && (
        <div className="space-y-6">
          {generatedVariants.map((group) => (
            <div key={group.group}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-black">
                  {group.group === 'color'
                    ? 'Color Variants'
                    : group.group === 'pattern'
                      ? 'Pattern Variants'
                      : 'Generated Variants'}{' '}
                  ({group.variants.length})
                </h3>
                <span className="text-sm text-black">
                  Base Price: ${basePrice.toFixed(2)}
                </span>
              </div>

              <div className="space-y-3">
                {group.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`bg-white rounded-lg border-2 overflow-hidden transition-all ${
                      variant.isActive
                        ? 'border-gray-200'
                        : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Variant Header / Info */}
                      <div className="flex-1 p-4 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {Object.entries(variant.combination).map(
                              ([attrId, optionId]) => {
                                const attr = attributes.find(
                                  (a) => a.id === attrId,
                                );
                                const option = attr?.options.find(
                                  (o) => o.id === optionId,
                                );
                                if (!attr || !option) return null;
                                return (
                                  <div
                                    key={attrId}
                                    className="flex items-center gap-1"
                                  >
                                    {attr.type === 'color' &&
                                      option?.color && (
                                        <div
                                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                                          style={{
                                            backgroundColor: option.color,
                                          }}
                                        />
                                      )}
                                    {attr.type === 'pattern' && (
                                      <div className="relative w-6 h-6 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center bg-gray-100">
                                        {option?.patternImage ? (
                                          <Image
                                            src={option.patternImage}
                                            alt=""
                                            fill
                                            className="object-cover"
                                          />
                                        ) : (
                                          <Layers className="w-3 h-3 text-gray-400" />
                                        )}
                                      </div>
                                    )}
                                    <span className="text-sm font-medium text-black">
                                      {option?.name}
                                    </span>
                                  </div>
                                );
                              },
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleVariantChange(
                                variant.id,
                                'isActive',
                                !variant.isActive,
                              )
                            }
                            className={`p-1 rounded transition-colors ${
                              variant.isActive
                                ? 'text-green-600'
                                : 'text-gray-400'
                            }`}
                          >
                            {variant.isActive ? (
                              <Eye className="w-5 h-5" />
                            ) : (
                              <EyeOff className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        {/* Price & Stock */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-black mb-1">
                              Price
                            </label>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-black text-sm">
                                $
                              </span>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={
                                  editingCell?.variantId === variant.id && editingCell?.field === 'price'
                                    ? editingValue
                                    : String(variant.price)
                                }
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  if (!/^[0-9]*\.?[0-9]*$/.test(raw)) return;
                                  setEditingCell({ variantId: variant.id, field: 'price' });
                                  setEditingValue(raw);
                                }}
                                onBlur={() => {
                                  if (editingCell?.variantId === variant.id && editingCell?.field === 'price') {
                                    const val = parseFloat(editingValue);
                                    if (!isNaN(val) && val >= 0) {
                                      handleVariantChange(variant.id, 'price', val);
                                    } else {
                                      handleVariantChange(variant.id, 'price', 0);
                                    }
                                    setEditingCell(null);
                                    setEditingValue('');
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.currentTarget.blur();
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingCell(null);
                                    setEditingValue('');
                                    e.currentTarget.blur();
                                  }
                                }}
                                className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-black"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-black mb-1">
                              Stock
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={
                                editingCell?.variantId === variant.id && editingCell?.field === 'stock'
                                  ? editingValue
                                  : String(variant.stock)
                              }
                              onChange={(e) => {
                                const raw = e.target.value;
                                if (!/^[0-9]*$/.test(raw)) return;
                                setEditingCell({ variantId: variant.id, field: 'stock' });
                                setEditingValue(raw);
                              }}
                              onBlur={() => {
                                if (editingCell?.variantId === variant.id && editingCell?.field === 'stock') {
                                  const val = parseInt(editingValue);
                                  if (!isNaN(val) && val >= 0) {
                                    handleVariantChange(variant.id, 'stock', val);
                                  } else {
                                    handleVariantChange(variant.id, 'stock', 0);
                                  }
                                  setEditingCell(null);
                                  setEditingValue('');
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur();
                                }
                                if (e.key === 'Escape') {
                                  setEditingCell(null);
                                  setEditingValue('');
                                  e.currentTarget.blur();
                                }
                              }}
                              className={`w-full px-3 py-2 text-sm border rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-black ${
                                variant.stock < 1
                                  ? 'bg-red-50 border-red-300'
                                  : variant.stock < 5
                                    ? 'bg-yellow-50 border-yellow-300'
                                    : 'border-gray-300'
                              }`}
                              placeholder="0"
                            />
                          </div>
                        </div>

                        {/* Stock Status Badge */}
                        <div className="mt-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                              variant.stock < 1
                                ? 'bg-red-100 text-black'
                                : variant.stock < 5
                                  ? 'bg-yellow-100 text-black'
                                  : 'bg-green-100 text-black'
                            }`}
                          >
                            {variant.stock < 1
                              ? 'Out of Stock'
                              : variant.stock < 5
                                ? 'Low Stock'
                                : 'In Stock'}
                          </span>
                        </div>
                      </div>

                      {/* Variant Images */}
                      <div className="flex-1 p-4">
                        <label className="block text-xs font-medium text-black mb-2">
                          Product Images ({variant.images?.length || 0})
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {variant.images?.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
                            >
                              <Image
                                src={img}
                                alt={`Image ${idx + 1}`}
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newImages = variant.images.filter(
                                    (_, i) => i !== idx,
                                  );
                                  handleVariantChange(
                                    variant.id,
                                    'images',
                                    newImages,
                                  );
                                }}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-amber-500 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  const response = await fetch(
                                    '/api/v1/upload/product',
                                    {
                                      method: 'POST',
                                      credentials: 'include',
                                      body: formData,
                                    },
                                  );
                                  if (response.ok) {
                                    const data = await response.json();
                                    const imageUrl =
                                      data.data?.url || data.url;
                                    const newImages = [
                                      ...(variant.images || []),
                                      imageUrl,
                                    ];
                                    handleVariantChange(
                                      variant.id,
                                      'images',
                                      newImages,
                                    );
                                    toast.success('Image uploaded');
                                  } else {
                                    toast.error('Failed to upload image');
                                  }
                                } catch {
                                  toast.error('Failed to upload image');
                                }
                                e.target.value = '';
                              }}
                            />
                            <Plus className="w-5 h-5 text-gray-400" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Attribute Modal */}
      <AnimatePresence>
        {showAddAttribute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddAttribute(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-lg font-semibold text-black mb-4">
                Add Variant Attribute
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Attribute Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {attributeTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setNewAttributeType(type.value as 'color' | 'size' | 'pattern')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm transition-colors ${
                          newAttributeType === type.value
                            ? 'border-amber-500 bg-amber-50 text-black'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Attribute Name
                  </label>
                  <input
                    type="text"
                    value={newAttributeName}
                    onChange={(e) => setNewAttributeName(e.target.value)}
                    placeholder={
                      newAttributeType === 'size'
                        ? 'Size'
                        : newAttributeType === 'color'
                          ? 'Color'
                          : 'Enter attribute name'
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                    onKeyPress={(e) => e.key === 'Enter' && addAttribute()}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addAttribute}
                    disabled={!newAttributeName.trim()}
                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Attribute
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAttribute(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Option Modal */}
      <AnimatePresence>
        {showAddOption && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddOption(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-lg font-semibold text-black mb-4">
                Add Option
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Option Name
                  </label>
                  <input
                    type="text"
                    value={newOptionName}
                    onChange={(e) => setNewOptionName(e.target.value)}
                    placeholder="Enter option name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                  />
                </div>

                {newAttributeType === 'color' && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Quick Select Color
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {commonColors.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => {
                            setNewOptionName(c.name);
                            setNewOptionColor(c.color);
                          }}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-colors flex items-center gap-1 ${
                            newOptionName === c.name
                              ? 'border-amber-500 bg-amber-50 text-black'
                              : 'border-gray-200 hover:border-gray-300 text-black'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: c.color }}
                          />
                          {c.name}
                        </button>
                      ))}
                    </div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={newOptionColor}
                        onChange={(e) => setNewOptionColor(e.target.value)}
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={newOptionColor}
                        onChange={(e) => setNewOptionColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm text-black"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                )}

                {newAttributeType === 'pattern' && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Quick Select Pattern
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {commonPatterns.map((pattern) => (
                        <button
                          key={pattern.value}
                          type="button"
                          onClick={() => setNewOptionName(pattern.name)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                            newOptionName === pattern.name
                              ? 'border-amber-500 bg-amber-50 text-black'
                              : 'border-gray-200 hover:border-gray-300 text-black'
                          }`}
                        >
                          {pattern.name}
                        </button>
                      ))}
                    </div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Pattern Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {newOptionPattern ? (
                        <div className="relative inline-block">
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                            <Image
                              src={newOptionPattern}
                              alt="Pattern"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setNewOptionPattern(null)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <input
                            ref={patternInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  setNewOptionPattern(
                                    ev.target?.result as string,
                                  );
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => patternInputRef.current?.click()}
                            className="flex flex-col items-center gap-2 mx-auto"
                          >
                            <Upload className="w-10 h-10 text-gray-400" />
                            <span className="text-sm text-black">
                              Upload Pattern Image
                            </span>
                            <span className="text-xs text-gray-500">
                              Leopard, Floral, Zebra, etc.
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => showAddOption && addOption(showAddOption)}
                    disabled={!newOptionName.trim()}
                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Option
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddOption(null)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VariantMatrix;
