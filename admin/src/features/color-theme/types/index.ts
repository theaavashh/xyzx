export interface ColorSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  buttonSecondaryBg: string;
  buttonSecondaryText: string;
  bannerBackgroundColor: string;
  bannerTextColor: string;
  cardBackgroundColor: string;
  cardBorderColor: string;
  headerBackgroundColor: string;
  footerBackgroundColor: string;
}

export const defaultSettings: ColorSettings = {
  primaryColor: '#D4AF37',
  secondaryColor: '#10B981',
  accentColor: '#F59E0B',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  buttonPrimaryBg: '#D4AF37',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondaryBg: '#F3F4F6',
  buttonSecondaryText: '#1F2937',
  bannerBackgroundColor: '#F0F9FF',
  bannerTextColor: '#1E40AF',
  cardBackgroundColor: '#FFFFFF',
  cardBorderColor: '#E5E7EB',
  headerBackgroundColor: '#FFFFFF',
  footerBackgroundColor: '#1F2937',
};

export const colorFields: (keyof ColorSettings)[] = [
  'primaryColor', 'secondaryColor', 'accentColor',
  'backgroundColor', 'textColor',
  'buttonPrimaryBg', 'buttonPrimaryText',
  'buttonSecondaryBg', 'buttonSecondaryText',
  'bannerBackgroundColor', 'bannerTextColor',
  'cardBackgroundColor', 'cardBorderColor',
  'headerBackgroundColor', 'footerBackgroundColor',
];

export interface ColorFieldConfig {
  id: keyof ColorSettings;
  label: string;
  description: string;
}

export interface ColorSection {
  title: string;
  colors: ColorFieldConfig[];
}

export const colorSections: ColorSection[] = [
  {
    title: 'Brand Colors',
    colors: [
      { id: 'primaryColor', label: 'Primary', description: 'Main brand color' },
      { id: 'secondaryColor', label: 'Secondary', description: 'Accent color' },
      { id: 'accentColor', label: 'Accent', description: 'Highlight color' },
    ],
  },
  {
    title: 'Base Colors',
    colors: [
      { id: 'backgroundColor', label: 'Background', description: 'Page background' },
      { id: 'textColor', label: 'Text', description: 'Primary text' },
    ],
  },
  {
    title: 'Buttons',
    colors: [
      { id: 'buttonPrimaryBg', label: 'Primary BG', description: 'Primary button background' },
      { id: 'buttonPrimaryText', label: 'Primary Text', description: 'Primary button text' },
      { id: 'buttonSecondaryBg', label: 'Secondary BG', description: 'Secondary button background' },
      { id: 'buttonSecondaryText', label: 'Secondary Text', description: 'Secondary button text' },
    ],
  },
  {
    title: 'Components',
    colors: [
      { id: 'bannerBackgroundColor', label: 'Banner BG', description: 'Promotional banner' },
      { id: 'bannerTextColor', label: 'Banner Text', description: 'Banner text color' },
      { id: 'cardBackgroundColor', label: 'Card BG', description: 'Product card background' },
      { id: 'cardBorderColor', label: 'Card Border', description: 'Card border color' },
    ],
  },
  {
    title: 'Layout',
    colors: [
      { id: 'headerBackgroundColor', label: 'Header BG', description: 'Navigation header' },
      { id: 'footerBackgroundColor', label: 'Footer BG', description: 'Site footer' },
    ],
  },
];
