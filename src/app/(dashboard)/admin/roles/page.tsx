import { Suspense } from "react";
import AdminRoles from "@/components/admin/Roles/AdminRoles";

export default function AdminRolesPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminRoles />
      </Suspense>
    </div>
  );
}


