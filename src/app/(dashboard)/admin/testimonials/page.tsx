import { Suspense } from "react";
import AdminTestimonials from "@/components/admin/Testimonials/AdminTestimonials";

export default function AdminTestimonialsPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminTestimonials />
      </Suspense>
    </div>
  );
}


