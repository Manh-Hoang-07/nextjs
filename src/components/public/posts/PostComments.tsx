'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PostComment } from '@/types/api';
import { publicEndpoints } from '@/lib/api/endpoints';
import { api } from '@/lib/api/client';
import { MessageSquare, Send, CornerDownRight, User, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react';

interface PostCommentsProps {
    postId: string;
}

interface CommentFormProps {
    postId: string;
    parentId?: string;
    onSuccess: () => void;
    onCancel?: () => void;
    placeholder?: string;
    autoFocus?: boolean;
}

function CommentForm({ postId, parentId, onSuccess, onCancel, placeholder, autoFocus }: CommentFormProps) {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            setSubmitting(true);
            const payload: any = { content };
            if (parentId) {
                payload.parent_id = parentId;
            }

            await api.post(publicEndpoints.posts.comments(postId), payload);
            setContent('');
            onSuccess();
        } catch (error) {
            console.error('Failed to post comment:', error);
            alert('Không thể gửi bình luận. Vui lòng thử lại sau.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-primary transition-colors">
                <textarea
                    autoFocus={autoFocus}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder || "Viết bình luận..."}
                    className="w-full bg-white px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 border-none min-h-[100px] resize-none"
                />
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100">
                    <div className="flex gap-2">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700"
                            >
                                Hủy
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={submitting || !content.trim()}
                        className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded hover:bg-primary-dark disabled:opacity-50 transition-colors"
                    >
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={14} /> <span>Gửi</span></>}
                    </button>
                </div>
            </div>
        </form>
    );
}

export function PostComments({ postId }: PostCommentsProps) {
    const [comments, setComments] = useState<PostComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

    const fetchComments = useCallback(async () => {
        try {
            const response = await api.get(publicEndpoints.posts.comments(postId));
            setComments(response.data.data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        if (postId) {
            fetchComments();
        }
    }, [postId, fetchComments]);

    const toggleExpand = (id: string) => {
        setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Vừa xong';
            const now = new Date();
            const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
            if (diff < 60) return 'Vừa xong';
            if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
            if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
            return date.toLocaleDateString('vi-VN');
        } catch (e) {
            return 'Vừa xong';
        }
    };

    const renderComment = (comment: PostComment, isReply = false) => {
        const isExpanded = !!expandedComments[comment.id];
        const hasReplies = comment.replies && comment.replies.length > 0;

        return (
            <div key={comment.id} className={`${isReply ? 'ml-10 mt-4' : 'mb-6 border-b border-gray-100 pb-6 last:border-0'}`}>
                <div className="flex gap-3">
                    <div className="flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                            {comment.user?.image ? (
                                <Image src={comment.user.image} alt="" className="w-full h-full object-cover" width={36} height={36} />
                            ) : (
                                <User size={18} className="text-gray-400" />
                            )}
                        </div>
                    </div>

                    <div className="flex-grow min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-semibold text-gray-900 text-sm">
                                {comment.user?.name || 'Thành viên'}
                            </span>
                            <span className="text-xs text-gray-400">
                                {formatDate(comment.created_at)}
                            </span>
                        </div>

                        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {comment.content}
                        </div>

                        <div className="mt-2 flex items-center gap-4">
                            <button
                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                className={`text-xs font-medium flex items-center gap-1 hover:text-primary transition-colors ${replyingTo === comment.id ? 'text-primary' : 'text-gray-500'}`}
                            >
                                <CornerDownRight size={12} />
                                Trả lời
                            </button>

                            {hasReplies && (
                                <button
                                    onClick={() => toggleExpand(comment.id)}
                                    className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1"
                                >
                                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    {isExpanded ? 'Thu gọn' : `${comment.replies?.length} phản hồi`}
                                </button>
                            )}
                        </div>

                        {replyingTo === comment.id && (
                            <div className="mt-3">
                                <CommentForm
                                    postId={postId}
                                    parentId={comment.id}
                                    autoFocus
                                    placeholder={`Trả lời ${comment.user?.name}...`}
                                    onSuccess={() => { setReplyingTo(null); fetchComments(); }}
                                    onCancel={() => setReplyingTo(null)}
                                />
                            </div>
                        )}

                        {hasReplies && isExpanded && (
                            <div className="mt-4 space-y-4 border-l-2 border-gray-50 pl-2">
                                {comment.replies?.map(reply => renderComment(reply, true))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const getTotalComments = (commentsList: PostComment[]): number => {
        let count = commentsList.length;
        commentsList.forEach(c => {
            if (c.replies && c.replies.length > 0) {
                count += getTotalComments(c.replies);
            }
        });
        return count;
    };

    const totalComments = getTotalComments(comments);

    return (
        <div className="mt-12 py-8">
            <div className="flex items-center gap-2 mb-8 border-b border-gray-100 pb-4">
                <MessageSquare size={20} className="text-gray-400" />
                <h3 className="text-lg font-bold text-gray-900">Thảo luận ({totalComments})</h3>
            </div>

            <div className="mb-10">
                <CommentForm postId={postId} onSuccess={fetchComments} />
            </div>

            {loading ? (
                <div className="flex justify-center py-10 text-gray-400">
                    <Loader2 size={24} className="animate-spin" />
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map(comment => renderComment(comment))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                    Chưa có bình luận nào.
                </div>
            )}
        </div>
    );
}
