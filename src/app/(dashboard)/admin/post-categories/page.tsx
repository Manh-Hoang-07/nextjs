import { Suspense } from "react";
import AdminPostCategories from "@/components/admin/PostCategories/AdminPostCategories";

export default function AdminPostCategoriesPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminPostCategories />
      </Suspense>
    </div>
  );
}


