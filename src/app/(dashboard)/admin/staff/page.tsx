import { Suspense } from "react";
import { Metadata } from "next";
import AdminStaff from "@/components/admin/Staff/AdminStaff";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quản lý Nhân sự | Admin",
  description: "Quản lý danh sách nhân sự",
};

export default function AdminStaffPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quản lý Nhân sự"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Giới thiệu", href: "/admin/about-sections" },
          { label: "Nhân sự" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminStaff />
      </Suspense>
    </div>
  );
}


