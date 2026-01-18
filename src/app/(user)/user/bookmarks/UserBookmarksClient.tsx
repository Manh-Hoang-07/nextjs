"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function UserBookmarksClient() {
    const [loading, setLoading] = useState(true);
    const [bookmarks, setBookmarks] = useState<any[]>([]);

    useEffect(() => {
        // TODO: Implement API call to fetch bookmarks
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Đánh dấu của tôi</h1>
                <p className="text-gray-600 mb-8">Danh sách các trang đã đánh dấu</p>

                {bookmarks.length > 0 ? (
                    <div className="space-y-4">
                        {bookmarks.map((bookmark) => (
                            <div key={bookmark.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <p className="text-gray-600">Bookmark item component needed</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bookmark nào</h3>
                        <p className="text-gray-600 mb-6">Bắt đầu đọc và đánh dấu các trang bạn muốn quay lại sau</p>
                        <Link
                            href="/home"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Khám phá
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
