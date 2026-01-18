"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import api from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";

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

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
    sortBy: "newest",
  });

  // Fetch certificates from API
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await api.get(publicEndpoints.certificates.list);
        if (response.data?.success) {
          const certData = response.data.data || [];
          setCertificates(certData);
          setFilteredCertificates(certData);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...certificates];

    // Filter by category
    if (filters.category !== "all") {
      filtered = filtered.filter(cert => cert.category === filters.category);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(cert =>
        cert.title.toLowerCase().includes(searchLower) ||
        cert.description.toLowerCase().includes(searchLower) ||
        cert.issuedBy.toLowerCase().includes(searchLower) ||
        cert.skills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }

    // Sort certificates
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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-2 text-gray-600">Đang tải chứng chỉ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Chứng chỉ của chúng tôi</h1>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-8 mb-12 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Chứng chỉ và xác nhận chuyên môn</h2>
          <p className="text-lg">
            Chúng tôi liên tục cập nhật kiến thức và kỹ năng thông qua các chứng chỉ uy tín trong ngành.
          </p>
        </div>
      </div>

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
            <div key={certificate.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <Image
                  src={certificate.image}
                  alt={certificate.title}
                  width={500}
                  height={300}
                  className="h-full w-full object-cover"
                />
                {isExpired(certificate.expiryDate) && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                    Đã hết hạn
                  </div>
                )}
                {isExpiringSoon(certificate.expiryDate) && !isExpired(certificate.expiryDate) && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded">
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
                  {certificate.skills.slice(0, 2).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {certificate.skills.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{certificate.skills.length - 2} nữa
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
            <div className="h-64 bg-gray-200 mb-6 rounded-lg overflow-hidden">
              <Image
                src={selectedCertificate.image}
                alt={selectedCertificate.title}
                width={800}
                height={500}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Thông tin chứng chỉ</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Cấp bởi:</span> {selectedCertificate.issuedBy}</p>
                  <p><span className="font-medium">Ngày cấp:</span> {selectedCertificate.issueDate}</p>
                  {selectedCertificate.expiryDate && (
                    <p><span className="font-medium">Ngày hết hạn:</span> {selectedCertificate.expiryDate}</p>
                  )}
                  {selectedCertificate.credentialId && (
                    <p><span className="font-medium">Mã xác nhận:</span> {selectedCertificate.credentialId}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Kỹ năng</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCertificate.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Mô tả chi tiết</h4>
              <p className="text-gray-600">{selectedCertificate.description}</p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Đóng
              </Button>
              {selectedCertificate.verificationUrl && (
                <Button>
                  Xác nhận chứng chỉ
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* CTA Section */}
      <div className="mt-16 bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tìm hiểu thêm về chuyên môn của chúng tôi</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Chúng tôi cam kết liên tục học hỏi và phát triển để mang lại các giải pháp tốt nhất cho khách hàng.
          Liên hệ với chúng tôi để tìm hiểu thêm về kinh nghiệm và chuyên môn của đội ngũ.
        </p>
        <Button size="lg">
          Liên hệ tư vấn
        </Button>
      </div>
    </div>
  );
}