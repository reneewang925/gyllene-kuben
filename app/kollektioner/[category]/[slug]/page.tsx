import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/data';
import { featuredProducts } from '@/lib/data';
import { ProductDetailPageClient } from '@/components/pdp/ProductDetailPageClient';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = featuredProducts.find((p) => p.slug === slug);
  if (!product) return { title: 'Produkt | Gyllene Kuben' };

  return {
    title: `${product.nameSv} / ${product.nameEn}`,
    description: product.descSv ?? product.descEn ?? undefined,
    alternates: {
      canonical: `https://www.gyllenekuben.se/kollektioner/${product.categoryId}/${slug}`,
    },
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export async function generateStaticParams() {
  const { categories, featuredProducts: products } = await import('@/lib/data');
  return products.map((p) => {
    const cat = categories.find((c) => c.id === p.categoryId);
    return { category: cat?.slug ?? 'okand', slug: p.slug };
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = featuredProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  const { getCategoryBySlug: _getCat, getProductsByCategory } = await import('@/lib/data');
  const { categories } = await import('@/lib/data');
  const category = categories.find((c) => c.id === product.categoryId);
  const related = getProductsByCategory(product.categoryId).filter(
    (p) => p.slug !== product.slug,
  );

  return (
    <ProductDetailPageClient
      product={{ ...product, category }}
      related={related}
    />
  );
}
