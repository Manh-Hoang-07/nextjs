"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/navigation/Button";
import api from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    sort_order?: number;
}

export default function FAQsClient() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [filteredFAQs, setFilteredFAQs] = useState<FAQ[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [filters, setFilters] = useState({
        category: "all",
        search: "",
    });

    // Fetch FAQs from API
    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await api.get(publicEndpoints.faqs.list);
                if (response.data?.success) {
                    const faqData = response.data.data || [];
                    setFaqs(faqData);
                    setFilteredFAQs(faqData);
                }
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...faqs];

        // Filter by category
        if (filters.category !== "all") {
            filtered = filtered.filter(faq => faq.category === filters.category);
        }

        // Filter by search
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(faq =>
                faq.question.toLowerCase().includes(searchLower) ||
                faq.answer.toLowerCase().includes(searchLower)
            );
        }

        // Sort by order if available
        filtered.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

        setFilteredFAQs(filtered);
    }, [faqs, filters]);

    const toggleExpanded = (id: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedItems(newExpanded);
    };

    const categories = Array.from(new Set(faqs.map(faq => faq.category)));

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="ml-2 text-gray-600">Đang tải câu hỏi...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Câu hỏi thường gặp</h1>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg p-8 mb-12 text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4">Tìm câu trả lời cho các câu hỏi của bạn</h2>
                    <p className="text-lg">
                        Chúng tôi đã tổng hợp các câu hỏi thường gặp từ khách hàng để giúp bạn hiểu rõ hơn về dịch vụ của chúng tôi.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Tìm kiếm
                        </label>
                        <input
                            id="search"
                            name="search"
                            type="text"
                            placeholder="Tìm kiếm câu hỏi..."
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
            </div>

            {/* FAQs List */}
            {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">Không tìm thấy câu hỏi nào phù hợp với bộ lọc.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredFAQs.map((faq) => (
                        <div key={faq.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <button
                                onClick={() => toggleExpanded(faq.id)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                            >
                                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                                <svg
                                    className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedItems.has(faq.id) ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {expandedItems.has(faq.id) && (
                                <div className="px-6 pb-4">
                                    <div className="border-t border-gray-200 pt-4">
                                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* CTA Section */}
            <div className="mt-16 bg-gray-100 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy câu trả lời bạn cần?</h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Nếu bạn có câu hỏi khác chưa được trả lời, đừng ngần ngại liên hệ với chúng tôi.
                    Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp bạn.
                </p>
                <div className="max-w-md mx-auto flex justify-center gap-2">
                    <Button size="lg">
                        Liên hệ hỗ trợ
                    </Button>
                </div>
            </div>
        </div>
    );
}
