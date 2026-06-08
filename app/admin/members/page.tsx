import { members, redemptionRequests, rewards } from '@/lib/data';
import { AdminMembersClient } from '@/components/admin/AdminMembersClient';

export default function AdminMembersPage() {
  return (
    <AdminMembersClient
      initialMembers={members}
      initialRedemptions={redemptionRequests}
      rewards={rewards}
    />
  );
}
