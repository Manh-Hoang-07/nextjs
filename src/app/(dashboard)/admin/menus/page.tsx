import { Suspense } from "react";
import AdminMenus from "@/components/admin/Menus/AdminMenus";

export default function AdminMenusPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminMenus />
      </Suspense>
    </div>
  );
}


