import { Suspense } from "react";
import AdminContexts from "@/components/admin/Contexts/AdminContexts";

export default function AdminContextsPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminContexts />
      </Suspense>
    </div>
  );
}


