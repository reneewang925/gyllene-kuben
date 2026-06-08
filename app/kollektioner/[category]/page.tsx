import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/data';
import { CollectionPageClient } from '@/components/collection/CollectionPageClient';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: 'Samling | Gyllene Kuben' };

  return {
    title: `${category.nameSv} / ${category.nameEn}`,
    description: category.descSv ?? undefined,
    alternates: { canonical: `https://www.gyllenekuben.se/kollektioner/${slug}` },
  };
}

export async function generateStaticParams() {
  const { categories } = await import('@/lib/data');
  return categories.map((c) => ({ category: c.slug }));
}

export default async function CollectionPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.id);

  return <CollectionPageClient category={category} products={products} />;
}
