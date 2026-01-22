import HomePageContent from "@/components/public/home/HomePageContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Chào mừng bạn đến với trang chủ của chúng tôi. Khám phá các dự án và dịch vụ tiêu biểu.",
};

export default function PublicHomePage() {
  return <HomePageContent />;
}




