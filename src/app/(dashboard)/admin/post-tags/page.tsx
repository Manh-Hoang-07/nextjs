import { Suspense } from "react";
import AdminPostTags from "@/components/admin/PostTags/AdminPostTags";

export default function AdminPostTagsPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminPostTags />
      </Suspense>
    </div>
  );
}


