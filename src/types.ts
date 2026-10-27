export interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  priceBDT: number;
  oldPriceBDT: number;
  priceUSD: number;
  oldPriceUSD: number;
  badge: string;
  badgeBg: string;
  badgeText: string;
  badgeShadow: string;
  linkKey: string;
  rating: string;
  ratingValue: number;
  reviewCount: number;
  image: string;
  category: 'presets' | 'reels' | 'software';
  categoryLabel: string;
  features: string[];
  specs: { label: string; value: string }[];
  description: string;
  driveFolderSampleId: string;
  fileSize: string;
  format: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethod: string;
  items: {
    id: string;
    name: string;
    price: string;
    downloadUrl: string;
    licenseKey: string;
  }[];
  totalAmount: string;
  currency: 'BDT' | 'USD';
  status: 'Completed' | 'Pending';
}

export interface CustomerReview {
  id: string;
  productId: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
  avatarColor: string;
  verified: boolean;
}
