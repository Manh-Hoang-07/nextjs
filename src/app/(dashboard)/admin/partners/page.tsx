import { Suspense } from "react";
import AdminPartners from "@/components/admin/Partners/AdminPartners";

export default function AdminPartnersPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminPartners />
      </Suspense>
    </div>
  );
}


