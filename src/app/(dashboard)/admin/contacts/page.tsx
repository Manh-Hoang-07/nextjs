import { Metadata } from "next";
import PageMeta from "@/components/ui/PageMeta";

export const metadata: Metadata = {
  title: "Quản lý Liên hệ | Admin",
  description: "Danh sách liên hệ từ khách hàng",
};

export default function AdminContactsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quản lý Liên hệ"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Liên hệ" },
        ]}
      />
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Admin contacts component needed</p>
      </div>
    </div>
  );
}

