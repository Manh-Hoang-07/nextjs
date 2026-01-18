import HeroBanner from "@/components/public/banners/HeroBanner";
import type { HeroBannerData } from "@/components/public/banners";

export default function BannerDemoPage() {
    // Example 1: Sử dụng với data trực tiếp (static)
    const staticBannerData: HeroBannerData = {
        title: "Công Ty Xây Dựng",
        subtitle: "Uy Tín & Chất Lượng",
        description: "Chúng tôi cam kết mang đến những công trình chất lượng, bền vững và đẳng cấp.",
        image: "/images/construction-site.jpg",
        button_text: "Khám Phá Dự Án",
        link: "/projects",
        link_target: "_self",
        titleColor: "#2563EB",
        subtitleColor: "#1F2937",
        descriptionColor: "#6B7280",
        backgroundColor: "#F9FAFB",
    };

    return (
        <div className="space-y-12 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">HeroBanner Component Demo</h1>

                {/* Example 1: Static Data */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">1. Sử dụng với Static Data</h2>
                    <HeroBanner data={staticBannerData} />
                </section>

                {/* Example 2: Fetch from API by Location Code */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">2. Lấy từ API theo Location Code</h2>
                    <p className="text-gray-600 mb-4">
                        Component sẽ tự động fetch banner từ API endpoint: <code className="bg-gray-100 px-2 py-1 rounded">/api/public/banners/location/homepage_hero</code>
                    </p>
                    <HeroBanner locationCode="homepage_hero" />
                </section>

                {/* Example 3: Fetch from API by Banner ID */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">3. Lấy từ API theo Banner ID</h2>
                    <p className="text-gray-600 mb-4">
                        Component sẽ tự động fetch banner từ API endpoint: <code className="bg-gray-100 px-2 py-1 rounded">/api/public/banners/1</code>
                    </p>
                    <HeroBanner bannerId={1} />
                </section>

                {/* Example 4: Image on Left */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">4. Hình ảnh bên trái</h2>
                    <HeroBanner data={staticBannerData} imagePosition="left" />
                </section>

                {/* Example 5: Custom Container Class */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">5. Custom Styling</h2>
                    <HeroBanner
                        data={{
                            ...staticBannerData,
                            backgroundColor: "#EFF6FF",
                        }}
                        containerClass="shadow-2xl"
                    />
                </section>

                {/* Example 6: Image Only Mode */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">6. Chỉ hiển thị ảnh (Image Only)</h2>
                    <p className="text-gray-600 mb-4">
                        Sử dụng <code className="bg-gray-100 px-2 py-1 rounded">imageOnly=true</code> để chỉ hiển thị ảnh full-width, không có text hay button.
                    </p>
                    <HeroBanner
                        data={staticBannerData}
                        imageOnly={true}
                        containerClass="mb-4"
                    />
                </section>
            </div>

            {/* Usage Instructions */}
            <div className="max-w-7xl mx-auto px-4 mt-16">
                <div className="bg-gray-100 rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-4">Hướng dẫn sử dụng</h2>

                    <div className="space-y-6">
                        {/* Import */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">1. Import Component</h3>
                            <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                                {`import HeroBanner from "@/components/public/banners/HeroBanner";
import type { HeroBannerData } from "@/components/public/banners";`}
                            </pre>
                        </div>

                        {/* Static Data */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">2. Sử dụng với Static Data</h3>
                            <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                                {`const bannerData: HeroBannerData = {
  title: "Công Ty Xây Dựng",
  subtitle: "Uy Tín & Chất Lượng",
  description: "Mô tả...",
  image: "/path/to/image.jpg",
  button_text: "Khám Phá Dự Án",
  link: "/projects",
  link_target: "_self",
};

<HeroBanner data={bannerData} />`}
                            </pre>
                        </div>

                        {/* API Location */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">3. Lấy từ API theo Location Code</h3>
                            <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                                {`<HeroBanner locationCode="homepage_hero" />`}
                            </pre>
                        </div>

                        {/* API ID */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">4. Lấy từ API theo Banner ID</h3>
                            <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                                {`<HeroBanner bannerId={1} />`}
                            </pre>
                        </div>

                        {/* Props */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">5. Props Available</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>
                                    <code className="bg-gray-200 px-2 py-1 rounded">data</code>: HeroBannerData - Truyền data trực tiếp
                                </li>
                                <li>
                                    <code className="bg-gray-200 px-2 py-1 rounded">locationCode</code>: string - Lấy banner theo location code từ API
                                </li>
                                <li>
                                    <code className="bg-gray-200 px-2 py-1 rounded">bannerId</code>: number - Lấy banner theo ID từ API
                                </li>
                                <li>
                                    <code className="bg-gray-200 px-2 py-1 rounded">containerClass</code>: string - Custom CSS class
                                </li>
                                <li>
                                    <code className="bg-gray-200 px-2 py-1 rounded">imagePosition</code>: &quot;left&quot; | &quot;right&quot; - Vị trí hình ảnh
                                </li>
                                <li>
                                    <code className="bg-gray-200 px-2 py-1 rounded">showSkeleton</code>: boolean - Hiển thị skeleton khi loading
                                </li>
                                <li>
                                    <code className="bg-gray-200 px-2 py-1 rounded">imageOnly</code>: boolean - Chỉ hiển thị ảnh, không có text/button
                                </li>
                            </ul>
                        </div>

                        {/* API Response */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">6. Cấu trúc API Response</h3>
                            <p className="text-gray-700 mb-2">Component tự động transform API response. API cần trả về:</p>
                            <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                                {`{
  "success": true,
  "data": {
    "id": 1,
    "title": "Tiêu đề",
    "subtitle": "Phụ đề",
    "description": "Mô tả",
    "image": "/path/to/image.jpg",
    "button_text": "Khám Phá Dự Án",
    "link": "/projects",
    "link_target": "_self",
    "metadata": {
      "title_color": "#2563EB",
      "subtitle_color": "#1F2937",
      "description_color": "#6B7280",
      "background_color": "#F9FAFB"
    }
  }
}`}
                            </pre>
                        </div>

                        {/* Important Notes */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-2 text-yellow-800">⚠️ Lưu ý quan trọng</h3>
                            <ul className="list-disc list-inside space-y-2 text-yellow-700">
                                <li>Nếu API không trả về data, banner sẽ tự động ẩn (return null)</li>
                                <li>Component chỉ hỗ trợ 1 nút duy nhất từ <code>button_text</code>, <code>link</code>, <code>link_target</code></li>
                                <li>Nếu không có <code>button_text</code> hoặc <code>link</code>, nút sẽ không hiển thị</li>
                                <li>Hình ảnh nên có tỷ lệ 4:3 để hiển thị đẹp nhất</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
