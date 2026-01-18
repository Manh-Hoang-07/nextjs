import { Suspense } from "react";
import AdminBannerLocations from "@/components/admin/BannerLocations/AdminBannerLocations";

export default function AdminBannerLocationsPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminBannerLocations />
      </Suspense>
    </div>
  );
}


