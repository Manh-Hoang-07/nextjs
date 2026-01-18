import { Suspense } from "react";
import AdminAboutSections from "@/components/admin/AboutSections/AdminAboutSections";

export default function AdminAboutSectionsPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminAboutSections />
      </Suspense>
    </div>
  );
}


