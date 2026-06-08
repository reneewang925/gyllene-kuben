import { notFound } from 'next/navigation';
import { featuredProducts, categories } from '@/lib/data';
import { ProductEditorClient } from '@/components/admin/ProductEditorClient';

interface Props { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = featuredProducts.find((p) => p.id === parseInt(id, 10));
  if (!product) notFound();
  return <ProductEditorClient mode="edit" product={product} categories={categories} />;
}
