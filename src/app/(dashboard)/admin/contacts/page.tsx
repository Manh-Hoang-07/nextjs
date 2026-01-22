import { Metadata } from "next";
import PageMeta from "@/components/ui/navigation/PageMeta";
import AdminContacts from "@/components/admin/Contacts/AdminContacts";

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
      <AdminContacts />
    </div>
  );
}

