export interface PopupBannerData {
  id?: string;
  image: string;
  isActive: boolean;
  position: 'top' | 'center' | 'bottom';
  size: 'small' | 'medium' | 'large';
  lastUpdated: string;
}
