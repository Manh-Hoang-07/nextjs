"use client";

import dynamic from "next/dynamic";

const AdminUsers = dynamic(() => import("@/components/admin/Users/AdminUsers"), {
  ssr: false,
  loading: () => <div>Đang tải...</div>,
});

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto p-4">
      <AdminUsers />
    </div>
  );
}


