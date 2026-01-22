import { Suspense } from "react";
import { Metadata } from "next";
import AdminPermissions from "@/components/admin/Permissions/AdminPermissions";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quản lý Quyền hạn | Admin",
  description: "Danh sách quyền hạn trong hệ thống",
};

export default function AdminPermissionsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quản lý Quyền hạn"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Phân quyền", href: "/admin/roles" },
          { label: "Quyền hạn" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminPermissions />
      </Suspense>
    </div>
  );
}


