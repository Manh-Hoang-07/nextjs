import { Suspense } from "react";
import AdminFAQs from "@/components/admin/FAQs/AdminFAQs";

export default function AdminFAQsPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminFAQs />
      </Suspense>
    </div>
  );
}


