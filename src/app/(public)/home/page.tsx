import HomePageContent from "@/components/home/HomePageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Trang chủ",
  description: "Khám phá hàng ngàn truyện tranh hay nhất, mới nhất. Đọc truyện tranh online miễn phí.",
});

export default function PublicHomePage() {
  return <HomePageContent />;
}




