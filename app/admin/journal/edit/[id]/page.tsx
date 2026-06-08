import { notFound } from 'next/navigation';
import { journalPosts } from '@/lib/data';
import { ArticleEditorClient } from '@/components/admin/ArticleEditorClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const post = journalPosts.find((p) => p.id === parseInt(id, 10));
  if (!post) notFound();
  return <ArticleEditorClient mode="edit" post={post} />;
}
