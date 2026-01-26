"use client";

import { useState } from "react";

interface FilterProps {
    initialFilters: any;
    onUpdateFilters: (filters: any) => void;
}

export default function ContentTemplateFilter({
    initialFilters,
    onUpdateFilters,
}: FilterProps) {
    const [filters, setFilters] = useState(initialFilters);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateFilters(filters);
    };

    const handleReset = () => {
        const resetFilters = {
            search: "",
            category: "",
            type: "",
            status: "",
        };
        setFilters(resetFilters);
        onUpdateFilters(resetFilters);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="md:col-span-1 lg:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Tìm kiếm</label>
                    <input
                        type="text"
                        name="search"
                        value={filters.search || ""}
                        onChange={handleChange}
                        placeholder="Tìm theo tên hoặc mã code..."
                        className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Phân loại</label>
                    <select
                        name="category"
                        value={filters.category || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    >
                        <option value="">Tất cả</option>
                        <option value="render">Render (HTML)</option>
                        <option value="file">File</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Kênh/Loại</label>
                    <select
                        name="type"
                        value={filters.type || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    >
                        <option value="">Tất cả</option>
                        <option value="email">Email</option>
                        <option value="telegram">Telegram</option>
                        <option value="zalo">Zalo</option>
                        <option value="sms">SMS</option>
                        <option value="pdf_generated">PDF Generated</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Trạng thái</label>
                    <select
                        name="status"
                        value={filters.status || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    >
                        <option value="">Tất cả</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Tạm ngưng</option>
                    </select>
                </div>

                <div className="flex items-end gap-2 md:col-span-4 lg:col-span-5 justify-end mt-2">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                    >
                        Đặt lại
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
                    >
                        Lọc
                    </button>
                </div>
            </form>
        </div>
    );
}
