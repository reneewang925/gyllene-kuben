import { featuredProducts, categories } from '@/lib/data';
import { AdminProductsClient } from '@/components/admin/AdminProductsClient';

export default function AdminProductsPage() {
  return <AdminProductsClient products={featuredProducts} categories={categories} />;
}
