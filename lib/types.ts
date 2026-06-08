export type Theme = 'imperial' | 'xuan';
export type Language = 'sv' | 'en';

export interface Translation {
  sv: string;
  en: string;
}

export interface Category {
  id: number;
  slug: string;
  nameSv: string;
  nameEn: string;
  descSv?: string;
  descEn?: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface Product {
  id: number;
  slug: string;
  nameSv: string;
  nameEn: string;
  descSv?: string;
  descEn?: string;
  materialsSv?: string;
  materialsEn?: string;
  dimensionsCm?: string;
  weightGrams?: number;
  artisanNameSv?: string;
  artisanNameEn?: string;
  kilnOrigin?: string;
  dynastyEra?: string;
  heritageSv?: string;
  heritageEn?: string;
  ritualSv?: string;
  ritualEn?: string;
  priceOre: number;
  compareAtOre?: number;
  stockQty: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isLimitedEdition: boolean;
  images: string[];
  categoryId: number;
  category?: Category;
  // Journal cross-link (populated when a JournalPost tags this product)
  relatedJournalSlug?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface HeritagePost {
  id: number;
  slug: string;
  titleSv: string;
  titleEn: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt?: string;
}

// ─── Rich content block types for the Journal editor ────────────────────────

export type BlockType = 'paragraph' | 'heading' | 'image' | 'video' | 'quote' | 'divider';

export interface ContentBlock {
  id: string;
  type: BlockType;
  // paragraph / heading / quote
  textSv?: string;
  textEn?: string;
  // heading level
  level?: 1 | 2 | 3;
  // image block
  imageUrl?: string;
  imageCaption?: string;
  // video block (YouTube / Vimeo URL or direct mp4)
  videoUrl?: string;
  videoCaption?: string;
}

export interface JournalPost {
  id: number;
  slug: string;
  titleSv: string;
  titleEn: string;
  excerptSv: string;
  excerptEn: string;
  coverImage: string;
  videoUrl?: string;
  blocks: ContentBlock[];
  relatedProductIds: number[];
  authorSv?: string;
  authorEn?: string;
  tag?: string;
  publishedAt: string;
  isPublished: boolean;
  readingTimeMin: number;
}

// ─── Member & Loyalty types ───────────────────────────────────────────────────

export type MemberTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type RedemptionStatus = 'PENDING' | 'APPROVED' | 'SHIPPED' | 'CANCELLED';

export interface Member {
  id: number;
  email: string;
  name: string;
  phone?: string;
  gdprConsent: boolean;
  gdprConsentAt?: string;
  gdprConsentIp?: string;
  marketingConsent: boolean;
  loyaltyPoints: number;
  tier: MemberTier;
  isActive: boolean;
  createdAt: string;
  // Populated on demand
  pointsTransactions?: PointsTransaction[];
  redemptions?: RedemptionRequest[];
}

export interface PointsTransaction {
  id: number;
  memberId: number;
  delta: number;
  reason: string;
  adminNote?: string;
  createdAt: string;
}

export interface Reward {
  id: number;
  nameSv: string;
  nameEn: string;
  descriptionEn?: string;
  pointsCost: number;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface RedemptionRequest {
  id: number;
  memberId: number;
  memberName: string;
  memberEmail: string;
  rewardId: number;
  rewardName: string;
  status: RedemptionStatus;
  adminNote?: string;
  processedAt?: string;
  createdAt: string;
}

// ─── Banner CMS types ─────────────────────────────────────────────────────────

export interface BannerConfig {
  id: number;
  key: string;
  titleSv: string;
  titleEn: string;
  subtitleSv?: string;
  subtitleEn?: string;
  ctaLabelSv?: string;
  ctaLabelEn?: string;
  ctaHref?: string;
  imageUrl?: string;
  theme?: 'imperial' | 'xuan';
  isActive: boolean;
}

