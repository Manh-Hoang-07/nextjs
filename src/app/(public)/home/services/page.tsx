import Link from "next/link";
import { Button } from "@/components/ui/navigation/Button";
import { ServiceFilter } from "@/components/public/services/ServiceFilter";
import { Metadata } from "next";
import HeroBanner from "@/components/public/banners/HeroBanner";

export const metadata: Metadata = {
  title: "Dịch vụ",
  description: "Giải pháp công nghệ toàn diện giúp doanh nghiệp phát triển bền vững.",
};

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
  price: string;
  duration: string;
  category: string;
  popular?: boolean;
}

const mockServices: Service[] = [
  {
    id: "1",
    title: "Phát triển Web",
    description: "Xây dựng các trang web hiện đại, responsive và tối ưu SEO với công nghệ mới nhất.",
    image: "/images/service1.jpg",
    icon: "web",
    features: ["Thiết kế responsive", "Tối ưu SEO", "Tốc độ tải nhanh", "Bảo mật cao", "Hỗ trợ đa trình duyệt"],
    price: "Từ 15.000.000 VNĐ",
    duration: "2-8 tuần",
    category: "Web Development",
    popular: true,
  },
  {
    id: "2",
    title: "Phát triển Mobile",
    description: "Tạo ứng dụng di động native và cross-platform cho iOS và Android.",
    image: "/images/service2.jpg",
    icon: "mobile",
    features: ["Native iOS & Android", "Cross-platform (React Native)", "UI/UX tối ưu", "Push notifications", "Tích hợp API"],
    price: "Từ 25.000.000 VNĐ",
    duration: "4-12 tuần",
    category: "Mobile Development",
  },
  {
    id: "3",
    title: "UI/UX Design",
    description: "Thiết kế giao diện người dùng hấp dẫn và trải nghiệm người dùng mượt mà.",
    image: "/images/service3.jpg",
    icon: "design",
    features: ["Nghiên cứu người dùng", "Wireframing", "Prototyping", "Thiết kế responsive", "Testing và iteration"],
    price: "Từ 10.000.000 VNĐ",
    duration: "2-6 tuần",
    category: "Design",
  },
  {
    id: "4",
    title: "Tư vấn IT",
    description: "Tư vấn chiến lược công nghệ và giải pháp kỹ thuật cho doanh nghiệp.",
    image: "/images/service4.jpg",
    icon: "consulting",
    features: ["Phân tích nhu cầu", "Đề xuất giải pháp", "Lộ trình triển khai", "Tối ưu quy trình", "Đào tạo nhân sự"],
    price: "Tùy theo dự án",
    duration: "1-4 tuần",
    category: "Consulting",
  },
  {
    id: "5",
    title: "Digital Marketing",
    description: "Chiến lược marketing kỹ thuật số toàn diện để tăng trưởng doanh thu.",
    image: "/images/service5.jpg",
    icon: "marketing",
    features: ["SEO & SEM", "Social Media Marketing", "Content Marketing", "Email Marketing", "Analytics & Reporting"],
    price: "Từ 8.000.000 VNĐ/tháng",
    duration: "Liên tục",
    category: "Marketing",
  },
  {
    id: "6",
    title: "Cloud Solutions",
    description: "Giải pháp đám mây giúp tối ưu hóa hạ tầng và chi phí vận hành.",
    image: "/images/service6.jpg",
    icon: "cloud",
    features: ["Cloud Migration", "Infrastructure as Code", "Monitoring & Alerting", "Backup & Recovery", "Security Management"],
    price: "Từ 12.000.000 VNĐ",
    duration: "2-6 tuần",
    category: "Cloud Services",
  },
];

async function getServices() {
  // In real app: return (await api.get(url)).data.data
  return mockServices;
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <HeroBanner locationCode="service" imageOnly={true} />

      <div className="container mx-auto px-4 mt-8 relative z-10">
        <ServiceFilter initialServices={services} />

        {/* CTA Section */}
        <div className="mt-16 bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cần dịch vụ tùy chỉnh?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Chúng tôi cũng cung cấp các giải pháp tùy chỉnh theo nhu cầu cụ thể của doanh nghiệp bạn.
            Liên hệ với chúng tôi để được tư vấn miễn phí.
          </p>
          <Link href="/home/contact">
            <Button size="lg">
              Liên hệ tư vấn
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}