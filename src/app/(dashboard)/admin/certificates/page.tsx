import { Suspense } from "react";
import AdminCertificates from "@/components/admin/Certificates/AdminCertificates";

export default function AdminCertificatesPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminCertificates />
      </Suspense>
    </div>
  );
}


