import { Suspense } from "react";
import { Metadata } from "next";
import AdminPartners from "@/components/admin/Partners/AdminPartners";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quản lý Đối tác | Admin",
  description: "Quản lý danh sách đối tác",
};

export default function AdminPartnersPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quản lý Đối tác"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Đối tác" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminPartners />
      </Suspense>
    </div>
  );
}


