"use client";

import { useState, useEffect } from "react";

export default function UserReadingHistoryClient() {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        // TODO: Implement API call to fetch reading history
        setLoading(false);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đọc</h1>
                <p className="text-gray-600 mb-8">Danh sách các bài viết/truyện bạn đã đọc</p>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : history.length > 0 ? (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-gray-600">Reading history item component needed</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử đọc</h3>
                        <p className="text-gray-600">Bắt đầu đọc để xem lịch sử đọc của bạn</p>
                    </div>
                )}
            </div>
        </div>
    );
}
