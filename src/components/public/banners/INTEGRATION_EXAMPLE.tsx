/**
 * Example: Cách tích hợp HeroBanner vào trang chủ
 * 
 * File này là ví dụ về cách sử dụng HeroBanner component trong HomePageContent.tsx
 * Bạn có thể copy code này và thêm vào file HomePageContent.tsx
 */

import HeroBanner from "@/components/public/banners/HeroBanner";
import type { HeroBannerData } from "@/components/public/banners";

// ============================================
// OPTION 1: Sử dụng Static Data
// ============================================
export function HomePageWithStaticBanner() {
    const heroBannerData: HeroBannerData = {
        title: "Công Ty Xây Dựng",
        subtitle: "Uy Tín & Chất Lượng",
        description: "Chúng tôi cam kết mang đến những công trình chất lượng, bền vững và đẳng cấp.",
        image: "/images/construction-hero.jpg",
        primaryButton: {
            text: "Khám Phá Dự Án",
            link: "/home/projects",
        },
        secondaryButton: {
            text: "Liên Hệ Ngay",
            link: "/home/contact",
        },
        titleColor: "#2563EB",
        subtitleColor: "#1F2937",
        descriptionColor: "#6B7280",
        backgroundColor: "#F9FAFB",
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner Section */}
            <HeroBanner data={heroBannerData} containerClass="mb-12" />

            {/* Rest of your homepage content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Your existing content here */}
            </div>
        </div>
    );
}

// ============================================
// OPTION 2: Sử dụng API với Location Code
// ============================================
export function HomePageWithAPIBanner() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner Section - Lấy từ API */}
            <HeroBanner
                locationCode="homepage_hero"
                containerClass="mb-12"
            />

            {/* Rest of your homepage content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Your existing content here */}
            </div>
        </div>
    );
}

// ============================================
// OPTION 3: Kết hợp nhiều Banner
// ============================================
export function HomePageWithMultipleBanners() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Hero Banner */}
            <HeroBanner
                locationCode="homepage_hero"
                containerClass="mb-8"
            />

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Your existing content here */}

                {/* Secondary Banner - Image on Left */}
                <HeroBanner
                    locationCode="homepage_secondary"
                    imagePosition="left"
                    containerClass="my-12"
                />

                {/* More content */}
            </div>
        </div>
    );
}

// ============================================
// HƯỚNG DẪN TÍCH HỢP VÀO HomePageContent.tsx
// ============================================

/**
 * Bước 1: Import component
 * 
 * Thêm vào đầu file HomePageContent.tsx:
 * 
 * import HeroBanner from "@/components/public/banners/HeroBanner";
 * import type { HeroBannerData } from "@/components/public/banners";
 */

/**
 * Bước 2: Thêm vào component
 * 
 * Trong return statement của HomePageContent, thêm:
 * 
 * return (
 *   <div className="min-h-screen bg-gray-50">
 *     {/* Thêm Hero Banner ở đây */}
 * <HeroBanner locationCode="homepage_hero" containerClass="mb-8" />
    *     
 * {/* Phần content hiện tại */ }
    * <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        *       {/* Featured Comics Slider */}
        *       <section className="mb-8">
            *         ...
            *       </section>
        *     </div>
    *   </div >
 * );
 */

/**
 * Bước 3: Cấu hình Banner trong Admin
 * 
 * 1. Vào trang Admin Banners: /admin/banners
 * 2. Tạo Banner mới với:
 *    - Location: "homepage_hero"
 *    - Title: "Công Ty Xây Dựng"
 *    - Subtitle: "Uy Tín & Chất Lượng"
 *    - Description: "Chúng tôi cam kết..."
 *    - Image: Upload hình ảnh
 *    - Button Text: "Khám Phá Dự Án"
 *    - Link: "/home/projects"
 *    - Status: Active
 * 
 * 3. (Optional) Thêm secondary button trong metadata:
 *    {
 *      "secondary_button": {
 *        "text": "Liên Hệ Ngay",
 *        "link": "/home/contact"
 *      },
 *      "title_color": "#2563EB",
 *      "subtitle_color": "#1F2937",
 *      "description_color": "#6B7280",
 *      "background_color": "#F9FAFB"
 *    }
 */

/**
 * Bước 4: Test
 * 
 * 1. Chạy dev server: npm run dev
 * 2. Truy cập: http://localhost:3000/home
 * 3. Kiểm tra banner hiển thị đúng
 * 4. Test responsive trên mobile
 */

// ============================================
// EXAMPLE: Full Integration
// ============================================
export function FullHomePageExample() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <HeroBanner
                locationCode="homepage_hero"
                containerClass="mb-12"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Featured Comics Slider */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Truyện nổi bật</h2>
                    {/* Your existing featured comics slider */}
                </section>

                {/* Filter Buttons */}
                <section className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Phân loại</h2>
                    {/* Your existing filter buttons */}
                </section>

                {/* Comics Grid - Trending */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Truyện Hot</h2>
                    {/* Your existing trending comics grid */}
                </section>

                {/* Secondary Banner - Promotional */}
                <HeroBanner
                    locationCode="homepage_promo"
                    imagePosition="left"
                    containerClass="my-12"
                />

                {/* Latest Updates */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Mới Cập Nhật</h2>
                    {/* Your existing recent updates */}
                </section>
            </div>
        </div>
    );
}
