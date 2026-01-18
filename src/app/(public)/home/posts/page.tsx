import { PageBanner } from "@/components/ui/PageBanner";

import { publicEndpoints } from "@/lib/api/endpoints";
import { PostList } from "@/components/posts/PostList";

import { serverFetch } from "@/lib/api/server-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Cập nhật những thông tin mới nhất về ngành xây dựng, kiến trúc và hoạt động của công ty.",
};

async function getPostsData() {
  const [postsRes, catsRes] = await Promise.all([
    serverFetch(publicEndpoints.posts.list, { revalidate: 3600, skipCookies: true }),
    serverFetch(publicEndpoints.postCategories.list, { revalidate: 3600, skipCookies: true })
  ]);

  return {
    posts: postsRes.data || [],
    categories: catsRes.data || []
  };
}

export default async function PostsPage() {
  const { posts, categories } = await getPostsData();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      <PageBanner
        title="Tin Tức & Sự Kiện"
        subtitle="Cập nhật những thông tin mới nhất về ngành xây dựng, kiến trúc và hoạt động của công ty."
        backgroundImage="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80"
      />

      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <PostList initialPosts={posts} categories={categories} />
      </div>
    </div>
  );
}