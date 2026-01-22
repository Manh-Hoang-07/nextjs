import { Suspense } from "react";
import { Metadata } from "next";
import AdminGallery from "@/components/admin/Gallery/AdminGallery";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Thư viện ảnh | Admin",
  description: "Quản lý thư viện hình ảnh",
};

export default function AdminGalleryPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Thư viện ảnh"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Thư viện ảnh" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminGallery />
      </Suspense>
    </div>
  );
}


