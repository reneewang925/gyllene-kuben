import { categories } from '@/lib/data';
import { ProductEditorClient } from '@/components/admin/ProductEditorClient';

export default function NewProductPage() {
  return <ProductEditorClient mode="new" categories={categories} />;
}
