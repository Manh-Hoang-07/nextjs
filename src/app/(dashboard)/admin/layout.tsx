import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
    title: "Admin Dashboard",
    description: "Manage your website content",
    noIndex: true,
});

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar with its own scrollbar */}
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full">
                {/* Fixed Header */}
                <AdminHeader />

                {/* Main Content with its own scrollbar */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
