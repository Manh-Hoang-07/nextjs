"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/navigation/Button";
import Modal from "@/components/ui/feedback/Modal";

interface Certificate {
    id: string;
    title: string;
    description: string;
    image: string;
    issuedBy: string;
    issueDate: string;
    expiryDate?: string;
    category: string;
    credentialId?: string;
    verificationUrl?: string;
    skills: string[];
}

interface CertificateListProps {
    initialCertificates: Certificate[];
}

export function CertificateList({ initialCertificates }: CertificateListProps) {
    const [certificates] = useState<Certificate[]>(initialCertificates);
    const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>(initialCertificates);
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        category: "all",
        search: "",
        sortBy: "newest",
    });

    useEffect(() => {
        let filtered = [...certificates];
        if (filters.category !== "all") {
            filtered = filtered.filter(cert => cert.category === filters.category);
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(cert =>
                cert.title.toLowerCase().includes(searchLower) ||
                cert.description.toLowerCase().includes(searchLower) ||
                cert.issuedBy.toLowerCase().includes(searchLower) ||
                (cert.skills || []).some(skill => skill.toLowerCase().includes(searchLower))
            );
        }
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case "newest":
                    return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
                case "oldest":
                    return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
                case "title":
                    return a.title.localeCompare(b.title);
                case "expiry":
                    if (!a.expiryDate && !b.expiryDate) return 0;
                    if (!a.expiryDate) return 1;
                    if (!b.expiryDate) return -1;
                    return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
                default:
                    return 0;
            }
        });
        setFilteredCertificates(filtered);
    }, [certificates, filters]);

    const openCertificateModal = (certificate: Certificate) => {
        setSelectedCertificate(certificate);
        setIsModalOpen(true);
    };

    const categories = Array.from(new Set(certificates.map(cert => cert.category)));

    const isExpiringSoon = (expiryDate?: string) => {
        if (!expiryDate) return false;
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
    };

    const isExpired = (expiryDate?: string) => {
        if (!expiryDate) return false;
        const today = new Date();
        const expiry = new Date(expiryDate);
        return expiry.getTime() < today.getTime();
    };

    return (
        <>
            {/* Filters and Sorting */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Tìm kiếm
                        </label>
                        <input
                            id="search"
                            name="search"
                            type="text"
                            placeholder="Tìm kiếm chứng chỉ..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                            Sắp xếp
                        </label>
                        <select
                            id="sortBy"
                            name="sortBy"
                            value={filters.sortBy}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="title">Theo tiêu đề</option>
                            <option value="expiry">Theo ngày hết hạn</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Certificates Grid */}
            {filteredCertificates.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">Không tìm thấy chứng chỉ nào phù hợp với bộ lọc.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCertificates.map((certificate) => (
                        <div key={certificate.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                <Image
                                    src={certificate.image}
                                    alt={certificate.title}
                                    width={500}
                                    height={300}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {isExpired(certificate.expiryDate) && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded shadow-sm">
                                        Đã hết hạn
                                    </div>
                                )}
                                {isExpiringSoon(certificate.expiryDate) && !isExpired(certificate.expiryDate) && (
                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded shadow-sm">
                                        Sắp hết hạn
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{certificate.title}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">{certificate.description}</p>
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-1">Cấp bởi: {certificate.issuedBy}</p>
                                    <p className="text-sm text-gray-500">Ngày cấp: {certificate.issueDate}</p>
                                    {certificate.expiryDate && (
                                        <p className="text-sm text-gray-500">Ngày hết hạn: {certificate.expiryDate}</p>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {(certificate.skills || []).slice(0, 2).map((skill, index) => (
                                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                            {skill}
                                        </span>
                                    ))}
                                    {(certificate.skills || []).length > 2 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                            +{(certificate.skills || []).length - 2} nữa
                                        </span>
                                    )}
                                </div>
                                <Button
                                    onClick={() => openCertificateModal(certificate)}
                                    className="w-full"
                                >
                                    Xem chi tiết
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Certificate Detail Modal */}
            <Modal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedCertificate?.title}
                size="lg"
            >
                {selectedCertificate && (
                    <div>
                        <div className="h-80 bg-gray-200 mb-6 rounded-lg overflow-hidden border border-gray-100">
                            <Image
                                src={selectedCertificate.image}
                                alt={selectedCertificate.title}
                                width={800}
                                height={500}
                                className="h-full w-full object-contain bg-gray-100"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-3 border-b pb-1">Thông tin chứng chỉ</h4>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p><span className="font-semibold text-gray-900">Cấp bởi:</span> {selectedCertificate.issuedBy}</p>
                                    <p><span className="font-semibold text-gray-900">Ngày cấp:</span> {selectedCertificate.issueDate}</p>
                                    {selectedCertificate.expiryDate && (
                                        <p><span className="font-semibold text-gray-900">Ngày hết hạn:</span> {selectedCertificate.expiryDate}</p>
                                    )}
                                    {selectedCertificate.credentialId && (
                                        <p><span className="font-semibold text-gray-900">Mã xác nhận:</span> {selectedCertificate.credentialId}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 mb-3 border-b pb-1">Kỹ năng áp dụng</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(selectedCertificate.skills || []).map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-bold text-gray-900 mb-3 border-b pb-1">Mô tả chi tiết</h4>
                            <p className="text-gray-600 leading-relaxed">{selectedCertificate.description}</p>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Đóng
                            </Button>
                            {selectedCertificate.verificationUrl && (
                                <a href={selectedCertificate.verificationUrl} target="_blank" rel="noopener noreferrer">
                                    <Button>
                                        Xác nhận chứng chỉ
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}
