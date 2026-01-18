import { Suspense } from "react";
import AdminProjects from "@/components/admin/Projects/AdminProjects";

export default function AdminProjectsPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminProjects />
      </Suspense>
    </div>
  );
}


