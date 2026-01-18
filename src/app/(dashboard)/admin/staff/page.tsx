import { Suspense } from "react";
import AdminStaff from "@/components/admin/Staff/AdminStaff";

export default function AdminStaffPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminStaff />
      </Suspense>
    </div>
  );
}


