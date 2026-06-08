import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getJournalBySlug, getPublishedJournalPosts, getProductsForJournal } from '@/lib/data';
import { ArticlePageClient } from '@/components/journal/ArticlePageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalBySlug(slug);
  if (!post) return { title: 'Artikel | Gyllene Kuben' };
  return {
    title: `${post.titleSv} / ${post.titleEn} — Gyllene Kuben`,
    description: post.excerptEn,
    alternates: { canonical: `https://www.gyllenekuben.se/journal/${slug}` },
    openGraph: {
      title: post.titleEn,
      description: post.excerptEn,
      images: [{ url: post.coverImage }],
    },
  };
}

export async function generateStaticParams() {
  return getPublishedJournalPosts().map((p) => ({ slug: p.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getJournalBySlug(slug);
  if (!post || !post.isPublished) notFound();
  const relatedProducts = getProductsForJournal(post);
  return <ArticlePageClient post={post} relatedProducts={relatedProducts} />;
}
