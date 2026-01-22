"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/navigation/Button";
import Modal from "@/components/ui/feedback/Modal";
import api from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";

interface GalleryItem {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    date: string;
    featured?: boolean;
}

export default function GalleryClient() {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        category: "all",
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

        // Filter by category
        if (filters.category !== "all") {
            filtered = filtered.filter(item => item.category === filters.category);
        }

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

    const openItemModal = (item: GalleryItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const categories = Array.from(new Set(galleryItems.map(item => item.category)));

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

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-8 mb-12 text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4">Khám phá các dự án của chúng tôi</h2>
                    <p className="text-lg">
                        Xem qua các thiết kế và giải pháp chúng tôi đã tạo cho khách hàng.
                    </p>
                </div>
            </div>

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

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Danh mục
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="all">Tất cả</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
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
                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                            <div className="h-64 bg-gray-200 relative overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={500}
                                    height={400}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
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
                                    <span className="text-sm text-gray-500">{item.category}</span>
                                    <Button
                                        size="sm"
                                        onClick={() => openItemModal(item)}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex group">
                            <div className="w-48 h-48 bg-gray-200 flex-shrink-0 relative overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={200}
                                    height={200}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
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
                                    <span className="text-sm text-gray-500">{item.category}</span>
                                    <Button
                                        size="sm"
                                        onClick={() => openItemModal(item)}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Item Detail Modal */}
            <Modal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedItem?.title}
                size="lg"
            >
                {selectedItem && (
                    <div>
                        <div className="h-96 bg-gray-200 mb-6 rounded-lg overflow-hidden">
                            <Image
                                src={selectedItem.image}
                                alt={selectedItem.title}
                                width={800}
                                height={600}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Thông tin dự án</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Danh mục:</span> {selectedItem.category}</p>
                                    <p><span className="font-medium">Ngày:</span> {selectedItem.date}</p>
                                    {selectedItem.featured && (
                                        <p><span className="font-medium">Trạng thái:</span>
                                            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                                Nổi bật
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Mô tả chi tiết</h4>
                                <p className="text-gray-600">{selectedItem.description}</p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="secondary"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

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
