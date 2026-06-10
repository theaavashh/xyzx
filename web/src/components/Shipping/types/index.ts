export interface ShippingMethod {
  id: string;
  name: string;
  price: string;
  time: string;
  description: string;
  isActive: boolean;
  order: number;
}

export interface ShippingInfo {
  id: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface InternationalRegion {
  id: string;
  region: string;
  time: string;
  price: string;
  isActive: boolean;
  order: number;
}

export interface ShippingContent {
  methods: ShippingMethod[];
  info: ShippingInfo[];
  regions: InternationalRegion[];
  freeShippingThreshold: string;
  freeInternationalThreshold: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface ShippingResponse {
  success: boolean;
  data?: ShippingContent;
}
