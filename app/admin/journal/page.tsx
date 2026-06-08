import { journalPosts } from '@/lib/data';
import { AdminJournalListClient } from '@/components/admin/AdminJournalListClient';

export default function AdminJournalPage() {
  return <AdminJournalListClient initialPosts={journalPosts} />;
}
