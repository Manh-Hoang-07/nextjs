"use client";

import { useState } from "react";
import Image from "next/image";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import SkeletonLoader from "@/components/ui/feedback/SkeletonLoader";
import ConfirmModal from "@/components/ui/feedback/ConfirmModal";
import Actions from "@/components/ui/data-display/Actions";
import Pagination from "@/components/ui/data-display/Pagination";
import PostCommentsFilter from "./PostCommentsFilter";
import { PostComment } from "@/types/api";
import { Eye, EyeOff, Trash2, MessageSquare, User, Info } from "lucide-react";
import Modal from "@/components/ui/feedback/Modal";

const formatDate = (dateString?: string): string => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

interface AdminPostCommentsProps {
    title?: string;
}

export default function AdminPostComments({
    title = "Quản lý bình luận bài viết",
}: AdminPostCommentsProps) {
    const {
        items,
        loading,
        pagination,
        filters,
        modals,
        selectedItem,
        openDeleteModal,
        closeDeleteModal,
        updateFilters,
        changePage,
        handleDelete,
        getSerialNumber,
        hasData,
        refresh,
        showSuccess,
        showError,
    } = useAdminListPage({
        endpoints: {
            list: adminEndpoints.postComments.list,
            delete: (id) => adminEndpoints.postComments.delete(id),
        },
        messages: {
            deleteSuccess: "Bình luận đã được xóa thành công",
        },
    });

    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [viewComment, setViewComment] = useState<PostComment | null>(null);

    const handleToggleStatus = async (comment: PostComment) => {
        const newStatus = comment.status === "visible" ? "hidden" : "visible";
        setTogglingId(comment.id);
        try {
            const response = await api.patch(adminEndpoints.postComments.updateStatus(comment.id), {
                status: newStatus,
            });
            if (response.data) {
                showSuccess(`Đã ${newStatus === "visible" ? "hiện" : "ẩn"} bình luận`);
                refresh();
            }
        } catch (error) {
            showError("Không thể cập nhật trạng thái bình luận");
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div className="admin-post-comments">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <MessageSquare className="text-blue-600" />
                    {title}
                </h1>
            </div>

            <PostCommentsFilter
                initialFilters={filters}
                onUpdateFilters={updateFilters}
            />

            <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
                {loading ? (
                    <SkeletonLoader type="table" rows={10} columns={6} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">STT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">Người gửi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Bài viết</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Ngày gửi</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((comment: PostComment, index) => (
                                    <tr key={comment.id} className={`${comment.status === "hidden" ? "bg-gray-50" : ""} hover:bg-gray-50 transition-colors`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8">
                                                    {comment.user?.image ? (
                                                        <Image className="h-8 w-8 rounded-full object-cover" src={comment.user.image} alt={comment.user.name || "User"} width={32} height={32} />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <User className="text-gray-500 w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-3 min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-gray-900 truncate" title={comment.user?.name || comment.guest_name || "Khách"}>
                                                        {comment.user?.name || comment.guest_name || "Khách"}
                                                        {!comment.user_id && <span className="ml-1 text-xs text-gray-500">(Guest)</span>}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate" title={comment.user?.email || comment.guest_email || "N/A"}>
                                                        {comment.user?.email || comment.guest_email || "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 line-clamp-2" title={comment.content}>
                                                {comment.content}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {comment.post ? (
                                                <div className="max-w-[150px]">
                                                    <a
                                                        href={`/posts/${comment.post.slug}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-sm text-blue-600 hover:text-blue-900 font-medium truncate block"
                                                        title={comment.post.name}
                                                    >
                                                        {comment.post.name}
                                                    </a>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${comment.status === 'visible'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {comment.status === 'visible' ? 'Công khai' : 'Đang ẩn'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {comment.created_at ? formatDate(comment.created_at) : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Actions
                                                item={comment}
                                                showView={false}
                                                showEdit={false}
                                                showDelete={true}
                                                onDelete={() => openDeleteModal(comment)}
                                                additionalActions={[
                                                    {
                                                        label: "Xem chi tiết",
                                                        action: () => setViewComment(comment),
                                                        icon: "eye",
                                                    },
                                                    {
                                                        label: comment.status === 'visible' ? 'Ẩn bình luận' : 'Hiện bình luận',
                                                        action: () => handleToggleStatus(comment),
                                                        icon: comment.status === 'visible' ? 'eye-off' : 'eye',
                                                    },
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {!loading && items.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-10 py-10 text-center text-gray-500">
                                            Không có bình luận nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {hasData && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    onPageChange={changePage}
                />
            )}

            {/* View Detail Modal */}
            <Modal
                show={!!viewComment}
                title="Chi tiết bình luận"
                onClose={() => setViewComment(null)}
                footer={
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setViewComment(null)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Đóng
                        </button>
                        {viewComment && (
                            <button
                                onClick={() => {
                                    handleToggleStatus(viewComment);
                                    setViewComment(null);
                                }}
                                className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${viewComment.status === 'visible' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'}`}
                            >
                                {viewComment.status === 'visible' ? 'Ẩn bình luận' : 'Hiện bình luận'}
                            </button>
                        )}
                    </div>
                }
            >
                {viewComment && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                {viewComment.user?.image ? (
                                    <Image src={viewComment.user.image} alt={viewComment.user.name || "User"} className="w-full h-full object-cover" width={48} height={48} />
                                ) : (
                                    <User className="text-blue-500 w-6 h-6" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-gray-900 leading-tight">
                                    {viewComment.user?.name || viewComment.guest_name || "Khách"}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {viewComment.user?.email || viewComment.guest_email || "N/A"}
                                </span>
                            </div>
                            <div className="ml-auto flex flex-col items-end">
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider ${viewComment.status === 'visible' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {viewComment.status === 'visible' ? 'Công khai' : 'Đang ẩn'}
                                </span>
                                <span className="text-[10px] text-gray-400 mt-1">{formatDate(viewComment.created_at)}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 italic text-gray-800 leading-relaxed min-h-[100px]">
                            &quot;{viewComment.content}&quot;
                        </div>

                        {viewComment.post && (
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <span className="text-[10px] font-bold uppercase text-blue-400 tracking-widest block mb-1">Bài viết liên quan</span>
                                <a
                                    href={`/posts/${viewComment.post.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-700 font-bold hover:underline"
                                >
                                    {viewComment.post.name}
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {selectedItem && (
                <ConfirmModal
                    show={modals.delete}
                    title="Xác nhận xóa"
                    message={`Bình luận này sẽ bị xóa vĩnh viễn khỏi hệ thống. Bạn có chắc chắn muốn xóa bình luận của "${selectedItem.user?.name || selectedItem.guest_name || "Khách"}"?`}
                    onClose={closeDeleteModal}
                    onConfirm={() => handleDelete(selectedItem.id)}
                />
            )}
        </div>
    );
}

