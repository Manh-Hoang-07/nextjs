import { Suspense } from "react";
import { Metadata } from "next";
import AdminPostTags from "@/components/admin/PostTags/AdminPostTags";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Thẻ bài viết | Admin",
  description: "Quản lý thẻ (tags) bài viết",
};

export default function AdminPostTagsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Thẻ bài viết"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Bài viết", href: "/admin/posts" },
          { label: "Thẻ (Tags)" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminPostTags />
      </Suspense>
    </div>
  );
}


