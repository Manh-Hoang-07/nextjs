import { Suspense } from "react";
import AdminPermissions from "@/components/admin/Permissions/AdminPermissions";

export default function AdminPermissionsPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminPermissions />
      </Suspense>
    </div>
  );
}


