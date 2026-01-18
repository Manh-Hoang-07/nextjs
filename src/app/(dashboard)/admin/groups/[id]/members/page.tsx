"use client";

import { useParams } from "next/navigation";
import GroupMembers from "@/components/admin/Groups/GroupMembers";

export default function AdminGroupMembersPage() {
  const params = useParams();
  const groupId = Number(params.id);

  return (
    <div className="container mx-auto p-4">
      <GroupMembers groupId={groupId} />
    </div>
  );
}

