import { serverFetch } from "@/lib/api/server-client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { CertificateList } from "@/components/certificates/CertificateList";
import { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Chứng chỉ & Giấy phép",
  description: "Các chứng chỉ, giấy phép và xác nhận chuyên môn của chúng tôi trong ngành xây dựng.",
};

async function getCertificates() {
  const { data } = await serverFetch<any[]>(publicEndpoints.certificates.list, {
    revalidate: 3600,
    skipCookies: true,
  });
  return data || [];
}

export default async function CertificatesPage() {
  const certificates = await getCertificates();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Chứng chỉ của chúng tôi</h1>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-8 mb-12 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Chứng chỉ và xác nhận chuyên môn</h2>
          <p className="text-lg">
            Chúng tôi liên tục cập nhật kiến thức và kỹ năng thông qua các chứng chỉ uy tín trong ngành.
          </p>
        </div>
      </div>

      <CertificateList initialCertificates={certificates} />

      {/* CTA Section */}
      <div className="mt-16 bg-gray-100 rounded-lg p-8 text-center text-gray-900">
        <h2 className="text-2xl font-bold mb-4">Tìm hiểu thêm về chuyên môn của chúng tôi</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Chúng tôi cam kết liên tục học hỏi và phát triển để mang lại các giải pháp tốt nhất cho khách hàng.
          Liên hệ với chúng tôi để tìm hiểu thêm về kinh nghiệm và chuyên môn của đội ngũ.
        </p>
        <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
          Liên hệ tư vấn
        </Button>
      </div>
    </div>
  );
}