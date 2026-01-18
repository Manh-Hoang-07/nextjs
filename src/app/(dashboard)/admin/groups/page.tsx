import { Suspense } from "react";
import AdminGroups from "@/components/admin/Groups/AdminGroups";

export default function AdminGroupsPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminGroups />
      </Suspense>
    </div>
  );
}

