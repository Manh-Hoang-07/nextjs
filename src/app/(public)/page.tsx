import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { getHomepageData } from "@/lib/api/home";
import { StaffCarousel } from "@/components/home/StaffCarousel";
import { PartnerCarousel } from "@/components/home/PartnerCarousel";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import Image from "next/image";

// Helper to parse JSON string if needed (for images array)
const parseImages = (images: string | string[]): string[] => {
    if (Array.isArray(images)) return images;
    try {
        return JSON.parse(images);
    } catch {
        return [];
    }
};

export default async function LandingPage() {
    const data = await getHomepageData();

    // Fallback Hero Data
    const defaultHero = {
        title: "Xây Dựng Tương Lai, Kiến Tạo Giá Trị",
        subtitle: "Chúng tôi cam kết mang đến những công trình chất lượng, bền vững và đẳng cấp.",
        ctaText: "Khám Phá Dự Án",
        ctaLink: "#projects",
    };

    if (!data) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <p className="text-gray-500">Không thể tải dữ liệu trang chủ.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-background pt-32 md:pt-40 lg:pt-48 pb-20">
                <div className="absolute top-0 left-0 -z-10 h-full w-full bg-white">
                    <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-primary/20 opacity-50 blur-[80px]"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block text-primary">Công Ty Xây Dựng</span>
                                <span className="block">Uy Tín & Chất Lượng</span>
                            </h1>
                            <p className="mt-6 text-lg text-gray-600 sm:text-xl max-w-2xl mx-auto lg:mx-0">
                                {defaultHero.subtitle}
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link href={defaultHero.ctaLink}>
                                    <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 h-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                                        {defaultHero.ctaText}
                                    </Button>
                                </Link>
                                <Link href="/home/contact">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-6 h-auto">
                                        Liên Hệ Ngay
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-2xl lg:max-w-none">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 aspect-video bg-gray-100">
                                <Image
                                    src={data?.featured_projects?.[0]?.cover_image || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2940&auto=format&fit=crop"}
                                    alt="Hero Building"
                                    width={1200}
                                    height={675}
                                    className="w-full h-full object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Sections (displayed as Features/Cards) */}
            {data?.about_sections && data.about_sections.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-base font-semibold text-primary uppercase tracking-wide">Về Chúng Tôi</h2>
                            <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Giá Trị Cốt Lõi</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {data.about_sections.slice(0, 6).map((section, idx) => (
                                <div key={section.id} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-gray-100">
                                    <div className={`w-12 h-12 rounded-lg mb-6 flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br ${idx % 2 === 0 ? 'from-primary to-blue-500' : 'from-purple-500 to-indigo-500'}`}>
                                        {idx + 1}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h3>
                                    <div
                                        className="text-gray-600 line-clamp-4 prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Projects */}
            {data?.featured_projects && data.featured_projects.length > 0 && (
                <section id="projects" className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Dự Án Nổi Bật</h2>
                                <p className="mt-4 text-xl text-gray-500">Các công trình tiêu biểu chúng tôi đã thực hiện.</p>
                            </div>
                            <Link href="/home/projects" className="hidden md:block text-primary font-medium hover:underline">
                                Xem tất cả dự án &rarr;
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {data.featured_projects.map((project) => {
                                const projectImages = parseImages(project.images);
                                const displayImage = project.cover_image || (projectImages.length > 0 ? projectImages[0] : null) || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2940";

                                return (
                                    <div key={project.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="relative h-64 overflow-hidden">
                                            <Image
                                                src={displayImage}
                                                alt={project.name}
                                                width={600}
                                                height={400}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
                                                {project.status === 'completed' ? 'Hoàn thành' : 'Đang thi công'}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{project.name}</h3>
                                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.short_description}</p>
                                            <div className="flex items-center text-sm text-gray-400 mb-4">
                                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {project.location}
                                            </div>
                                            <Link href={`/home/projects/${project.slug}`}>
                                                <Button className="w-full" variant="outline">Xem chi tiết</Button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-8 md:hidden text-center">
                            <Link href="/home/projects">
                                <Button variant="secondary" className="w-full">Xem Tất Cả Dự Án</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Staff / Leadership (With Carousel Logic) */}
            {data?.staff && data.staff.length > 0 && (
                <section className="py-20 bg-white overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <StaffCarousel staff={data.staff} />
                    </div>
                </section>
            )}

            {/* Partners (With Carousel Logic) */}
            {data?.partners && data.partners.length > 0 && (
                <section className="py-16 bg-gray-50 border-t border-gray-200 overflow-hidden">
                    <PartnerCarousel partners={data.partners} />
                </section>
            )}

            {/* FAQs (Accordion) */}
            {data?.popular_faqs && data.popular_faqs.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900">Câu Hỏi Thường Gặp</h2>
                            <p className="mt-4 text-gray-500">Giải đáp những thắc mắc phổ biến về dịch vụ của chúng tôi.</p>
                        </div>
                        <FaqAccordion faqs={data.popular_faqs} />
                        <div className="mt-8 text-center">
                            <Link href="/home/faqs">
                                <Button variant="ghost">Xem thêm câu hỏi</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-20 bg-primary text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6">Bạn đã sẵn sàng cho dự án mơ ước?</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Liên hệ ngay với chúng tôi để được tư vấn miễn phí và nhận báo giá chi tiết.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/home/contact">
                            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">Liên Hệ Ngay</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
