import { Suspense } from "react";
import AdminGallery from "@/components/admin/Gallery/AdminGallery";

export default function AdminGalleryPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminGallery />
      </Suspense>
    </div>
  );
}


