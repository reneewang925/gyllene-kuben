import type { Metadata } from 'next';
import { getPublishedJournalPosts } from '@/lib/data';
import { JournalIndexClient } from '@/components/journal/JournalIndexClient';

export const metadata: Metadata = {
  title: 'Kulturjournal / Cultural Journal — Gyllene Kuben',
  description: 'Djupdykningar i östasiatisk konsthistoria, tekonstens filosofi och meditationens tysta visdom.',
  alternates: { canonical: 'https://www.gyllenekuben.se/journal' },
  openGraph: {
    title: 'Kulturjournal — Gyllene Kuben',
    description: 'Essays, heritage stories and cultural dispatches from the heart of Eastern art.',
    images: [{ url: '/images/journal-editorial-banner.jpg' }],
  },
};

export default function JournalIndexPage() {
  const posts = getPublishedJournalPosts();
  return <JournalIndexClient posts={posts} />;
}
