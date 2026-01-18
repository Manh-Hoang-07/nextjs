import { Suspense } from "react";
import AdminPosts from "@/components/admin/Posts/AdminPosts";

export default function AdminPostsPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminPosts />
      </Suspense>
    </div>
  );
}


