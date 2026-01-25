
import { serverFetch } from "@/lib/api/server-client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { ProjectFilter } from "@/components/public/projects/ProjectFilter";
import Link from "next/link";
import { Button } from "@/components/ui/navigation/Button";
import { Suspense } from "react";
import { Metadata } from "next";
import HeroBanner from "@/components/public/banners/HeroBanner";

export const metadata: Metadata = {
  title: "Dự án",
  description: "Khám phá những công trình tiêu biểu chúng tôi đã thực hiện.",
};

// Enable ISR with 5 minutes revalidation
export const revalidate = 300;

async function getProjects() {
  try {
    const { data, error } = await serverFetch(publicEndpoints.projects.list, {
      skipCookies: true, // Public data doesn't need auth
      next: {
        revalidate: 300, // Cache for 5 minutes
        tags: ['projects'],
      },
    });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

async function ProjectList() {
  const projects = await getProjects();
  return <ProjectFilter initialProjects={projects} />;
}

function ProjectSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <HeroBanner locationCode="project" imageOnly={true} />

      <div className="container mx-auto px-4 mt-8 relative z-10">
        <Suspense fallback={<ProjectSkeleton />}>
          <ProjectList />
        </Suspense>

        {/* CTA Section */}
        <div className="mt-16 bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cần giải pháp cho dự án của bạn?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và tư vấn những phương án tối ưu nhất cho dự án của bạn.
          </p>
          <Link href="/home/contact">
            <Button size="lg">
              Liên hệ ngay
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
