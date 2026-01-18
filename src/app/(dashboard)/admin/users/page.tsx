import { Suspense } from "react";
import AdminUsers from "@/components/admin/Users/AdminUsers";

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminUsers />
      </Suspense>
    </div>
  );
}


