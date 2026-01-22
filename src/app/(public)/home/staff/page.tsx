import { getStaffList } from "@/lib/api/public";
import { StaffList } from "@/components/public/staff/StaffList";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/navigation/Button";

export const metadata: Metadata = {
  title: "Đội ngũ nhân sự",
  description: "Gặp gỡ đội ngũ chuyên gia tận tâm và giàu kinh nghiệm của chúng tôi.",
};

export default async function StaffPage() {
  const staffMembers = await getStaffList();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Đội ngũ của chúng tôi</h1>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 mb-12 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Gặp gỡ đội ngũ chuyên gia</h2>
          <p className="text-lg">
            Chúng tôi tự hào về đội ngũ đa dạng và tài năng của mình, mỗi người đều đóng góp vào thành công chung.
          </p>
        </div>
      </div>

      <StaffList initialStaff={staffMembers} />

      {/* CTA Section */}
      <div className="mt-16 bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Gia nhập đội ngũ của chúng tôi</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Chúng tôi luôn tìm kiếm những tài năng đam mê và sáng tạo.
          Xem các vị trí đang tuyển dụng và ứng tuyển ngay hôm nay.
        </p>
        <Link href="/home/contact">
          <Button size="lg">
            Liên hệ ứng tuyển
          </Button>
        </Link>
      </div>
    </div>
  );
}