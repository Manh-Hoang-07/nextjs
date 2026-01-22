import { Suspense } from "react";
import { Metadata } from "next";
import AdminPosts from "@/components/admin/Posts/AdminPosts";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quản lý bài viết | Admin",
  description: "Quản lý bài viết và tin tức",
};

export default function AdminPostsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quản lý bài viết"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Bài viết", href: "/admin/posts" },
          { label: "Danh sách" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminPosts />
      </Suspense>
    </div>
  );
}


