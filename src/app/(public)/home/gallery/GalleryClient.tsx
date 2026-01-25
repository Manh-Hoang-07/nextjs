"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/navigation/Button";
import api from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";
import HeroBanner from "@/components/public/banners/HeroBanner";

interface GalleryItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover_image: string;
    images: string[];
    featured: boolean;
    status: string;
    category?: string; // Optional if missing
    date?: string;     // Optional
}

export default function GalleryClient() {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
    });
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Fetch gallery from API
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await api.get(publicEndpoints.gallery.list);
                if (response.data?.success) {
                    const galleryData = response.data.data || [];
                    setGalleryItems(galleryData);
                    setFilteredItems(galleryData);
                }
            } catch (error) {
                console.error("Error fetching gallery:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGallery();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...galleryItems];

        // Filter by search
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(searchLower) ||
                item.description.toLowerCase().includes(searchLower)
            );
        }

        setFilteredItems(filtered);
    }, [galleryItems, filters]);

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="ml-2 text-gray-600">Đang tải thư viện...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Thư viện dự án</h1>

            <HeroBanner locationCode="gallery" imageOnly={true} containerClass="mb-12" />

            {/* Filters and View Mode */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                Tìm kiếm
                            </label>
                            <input
                                id="search"
                                name="search"
                                type="text"
                                placeholder="Tìm kiếm dự án..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Xem:</span>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Gallery Items */}
            {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">Không tìm thấy dự án nào phù hợp với bộ lọc.</p>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map((item) => (
                        <div key={item.id || Math.random()} className="bg-white rounded-lg shadow-md overflow-hidden group">
                            <div className="h-64 bg-gray-200 relative overflow-hidden">
                                {item.cover_image ? (
                                    <Image
                                        src={item.cover_image}
                                        alt={item.title || "Project Image"}
                                        width={500}
                                        height={400}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gray-300 text-gray-500">
                                        <span className="text-4xl">🖼️</span>
                                    </div>
                                )}
                                {item.featured && (
                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded font-bold">
                                        Nổi bật
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{item.category || "Dự án"}</span>
                                    <Link href={`/home/gallery/${item.slug || item.id}`} className="inline-block">
                                        <Button size="sm">
                                            Xem chi tiết
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredItems.map((item) => (
                        <div key={item.id || Math.random()} className="bg-white rounded-lg shadow-md overflow-hidden flex group">
                            <div className="w-48 h-48 bg-gray-200 flex-shrink-0 relative overflow-hidden">
                                {item.cover_image ? (
                                    <Image
                                        src={item.cover_image}
                                        alt={item.title || "Project Image"}
                                        width={200}
                                        height={200}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gray-300 text-gray-500">
                                        <span className="text-4xl">🖼️</span>
                                    </div>
                                )}
                                {item.featured && (
                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded font-bold">
                                        Nổi bật
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                                    <span className="text-sm text-gray-500 ml-4">{item.date}</span>
                                </div>
                                <p className="text-gray-600 mb-4">{item.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{item.category || "Dự án"}</span>
                                    <Link href={`/home/gallery/${item.slug || item.id}`} className="inline-block">
                                        <Button size="sm">
                                            Xem chi tiết
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* CTA Section */}
            <div className="mt-16 bg-gray-100 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cần dự án tương tự?</h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Chúng tôi chuyên tạo các giải pháp tùy chỉnh theo nhu cầu cụ thể của bạn.
                    Liên hệ với chúng tôi để thảo luận về dự án tiếp theo của bạn.
                </p>
                <Button size="lg">
                    Bắt đầu dự án mới
                </Button>
            </div>
        </div>
    );
}
