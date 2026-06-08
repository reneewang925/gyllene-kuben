import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustStrip } from '@/components/home/TrustStrip';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { EditorialBanner } from '@/components/home/EditorialBanner';

export const metadata: Metadata = {
  title: 'Gyllene Kuben — Österns Konst i Nordiskt Ljus',
  description:
    'Handplockade mästerverk av kinesisk porslin, bronskonst, östasiatisk tekannor, premium te och meditationsredskap. Fri frakt i Sverige. Klarna & Swish.',
  alternates: {
    canonical: 'https://www.gyllenekuben.se',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <CategoryGrid />
      <EditorialBanner />
    </>
  );
}
