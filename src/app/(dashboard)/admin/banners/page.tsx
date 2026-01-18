import { Suspense } from "react";
import AdminBanners from "@/components/admin/Banners/AdminBanners";

export default function AdminBannersPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminBanners />
      </Suspense>
    </div>
  );
}


