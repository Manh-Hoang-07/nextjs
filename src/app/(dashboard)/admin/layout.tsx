import { constructMetadata } from "@/lib/metadata";
import { AdminLayoutClient } from "@/components/layout/admin/AdminLayoutClient";

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
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
