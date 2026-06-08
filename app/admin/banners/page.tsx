import { bannerConfigs } from '@/lib/data';
import { AdminBannersClient } from '@/components/admin/AdminBannersClient';

export default function AdminBannersPage() {
  return <AdminBannersClient initialBanners={bannerConfigs} />;
}
