"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import ImageUploader from "@/components/ui/ImageUploader";
import CKEditor from "@/components/ui/CKEditor";
import SingleSelectEnhanced from "@/components/ui/SingleSelectEnhanced";
import SearchableSelect from "@/components/ui/SearchableSelect";
import MultipleSelect from "@/components/ui/MultipleSelect";
import { adminEndpoints } from "@/lib/api/endpoints";
import api from "@/lib/api/client";

interface Post {
  id?: number;
  name?: string;
  excerpt?: string;
  content?: string;
  cover_image?: string | null;
  image?: string | null;
  post_type?: string;
  video_url?: string | null;
  audio_url?: string | null;
  status?: string;
  published_at?: string;
  primary_postcategory_id?: number | null;
  category_ids?: number[];
  tag_ids?: number[];
  is_featured?: boolean;
  is_pinned?: boolean;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string | null;
  categories?: Array<{ id: number; name: string }>;
  tags?: Array<{ id: number; name: string }>;
}

interface PostFormProps {
  show: boolean;
  post?: Post | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  postTypeEnums?: Array<{ value: string; label?: string; name?: string }>;
  categoryEnums?: Array<{ value: number; label?: string; name?: string }>;
  tagEnums?: Array<{ value: number; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const formatDateTimeForInput = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatDateTimeToISO = (dateTimeLocal?: string): string | null => {
  if (!dateTimeLocal) return null;
  const date = new Date(dateTimeLocal);
  if (isNaN(date.getTime())) return null;
  return date.toISOString();
};

export default function PostForm({
  show,
  post,
  statusEnums = [],
  postTypeEnums = [],
  categoryEnums = [],
  tagEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: PostFormProps) {
  const formTitle = post ? "Chỉnh sửa bài viết" : "Thêm bài viết mới";

  const [formData, setFormData] = useState<Partial<Post>>({
    name: "",
    excerpt: "",
    content: "",
    cover_image: null,
    image: null,
    post_type: "text",
    video_url: null,
    audio_url: null,
    status: "draft",
    published_at: "",
    primary_postcategory_id: null,
    category_ids: [],
    tag_ids: [],
    is_featured: false,
    is_pinned: false,
    meta_title: "",
    meta_description: "",
    canonical_url: "",
    og_title: "",
    og_description: "",
    og_image: null,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<Array<{ value: number; label: string }>>([]);
  const [tagOptions, setTagOptions] = useState<Array<{ value: number; label: string }>>([]);

  const statusOptions = useMemo(() => {
    const statusArray = statusEnums && statusEnums.length > 0 ? statusEnums : [
      { value: "draft", label: "Bản nháp" },
      { value: "published", label: "Đã xuất bản" },
      { value: "archived", label: "Đã lưu trữ" },
    ];
    return statusArray.map((opt) => ({
      value: opt.value,
      label: opt.label || (opt as any).name || String(opt.value),
    }));
  }, [statusEnums]);

  const postTypeOptions = useMemo(() => {
    const typeArray = postTypeEnums && postTypeEnums.length > 0 ? postTypeEnums : [
      { value: "text", label: "Văn bản" },
      { value: "video", label: "Video" },
      { value: "audio", label: "Audio" },
    ];
    return typeArray.map((opt) => ({
      value: opt.value,
      label: opt.label || (opt as any).name || String(opt.value),
    }));
  }, [postTypeEnums]);

  useEffect(() => {
    if (show) {
      loadCategories();
      loadTags();
    }
  }, [show]);

  const loadCategories = async () => {
    try {
      const response = await api.get(adminEndpoints.postCategories.list);
      const data = response.data?.data || response.data || [];
      const items = Array.isArray(data) ? data : data.items || data.data || [];
      setCategoryOptions(
        items.map((cat: any) => ({
          value: cat.id,
          label: cat.name || cat.label || String(cat.id),
        }))
      );
    } catch (error) {
      setCategoryOptions([]);
    }
  };

  const loadTags = async () => {
    try {
      const response = await api.get(adminEndpoints.postTags.list);
      const data = response.data?.data || response.data || [];
      const items = Array.isArray(data) ? data : data.items || data.data || [];
      setTagOptions(
        items.map((tag: any) => ({
          value: tag.id,
          label: tag.name || tag.label || String(tag.id),
        }))
      );
    } catch (error) {
      setTagOptions([]);
    }
  };

  useEffect(() => {
    if (post) {
      setFormData({
        name: post.name || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        cover_image: post.cover_image && !String(post.cover_image).includes("via.placeholder") ? post.cover_image : null,
        image: post.image && !String(post.image).includes("via.placeholder") ? post.image : null,
        post_type: post.post_type || "text",
        video_url: post.video_url || null,
        audio_url: post.audio_url || null,
        status: post.status || "draft",
        published_at: post.published_at ? formatDateTimeForInput(post.published_at) : "",
        primary_postcategory_id: post.primary_postcategory_id ? Number(post.primary_postcategory_id) : null,
        category_ids:
          post.categories && Array.isArray(post.categories)
            ? post.categories.map((cat) => Number(cat.id || cat)).filter((id) => !isNaN(id) && id > 0)
            : post.category_ids && Array.isArray(post.category_ids)
              ? post.category_ids.map((id) => Number(id)).filter((id) => !isNaN(id) && id > 0)
              : [],
        tag_ids:
          post.tags && Array.isArray(post.tags)
            ? post.tags.map((tag) => Number(tag.id || tag)).filter((id) => !isNaN(id) && id > 0)
            : post.tag_ids && Array.isArray(post.tag_ids)
              ? post.tag_ids.map((id) => Number(id)).filter((id) => !isNaN(id) && id > 0)
              : [],
        is_featured: post.is_featured || false,
        is_pinned: post.is_pinned || false,
        meta_title: post.meta_title || "",
        meta_description: post.meta_description || "",
        canonical_url: post.canonical_url || "",
        og_title: post.og_title || "",
        og_description: post.og_description || "",
        og_image: post.og_image && !String(post.og_image).includes("via.placeholder") ? post.og_image : null,
      });
    } else {
      setFormData({
        name: "",
        excerpt: "",
        content: "",
        cover_image: null,
        image: null,
        post_type: "text",
        video_url: null,
        audio_url: null,
        status: "draft",
        published_at: "",
        primary_postcategory_id: null,
        category_ids: [],
        tag_ids: [],
        is_featured: false,
        is_pinned: false,
        meta_title: "",
        meta_description: "",
        canonical_url: "",
        og_title: "",
        og_description: "",
        og_image: null,
      });
    }
    setValidationErrors({});
  }, [post, show]);

  useEffect(() => {
    if (formData.post_type !== "video") {
      setFormData((prev) => ({ ...prev, video_url: null }));
    }
    if (formData.post_type !== "audio") {
      setFormData((prev) => ({ ...prev, audio_url: null }));
    }
  }, [formData.post_type]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = "Tiêu đề là bắt buộc";
    } else if (formData.name.length > 255) {
      errors.name = "Tiêu đề không được vượt quá 255 ký tự";
    }

    if (!formData.content?.trim()) {
      errors.content = "Nội dung là bắt buộc";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData: any = {
        name: formData.name?.trim(),
        content: formData.content?.trim(),
        excerpt: formData.excerpt?.trim() || undefined,
        image: formData.image || null,
        cover_image: formData.cover_image || null,
        og_image: formData.og_image || null,
        meta_title: formData.meta_title?.trim() || undefined,
        meta_description: formData.meta_description?.trim() || undefined,
        canonical_url: formData.canonical_url?.trim() || undefined,
        og_title: formData.og_title?.trim() || undefined,
        og_description: formData.og_description?.trim() || undefined,
        post_type: formData.post_type || "text",
        video_url: formData.video_url?.trim() || null,
        audio_url: formData.audio_url?.trim() || null,
        status: formData.status || "draft",
        is_featured: Boolean(formData.is_featured),
        is_pinned: Boolean(formData.is_pinned),
        primary_postcategory_id: formData.primary_postcategory_id ? Number(formData.primary_postcategory_id) : null,
        category_ids: Array.isArray(formData.category_ids)
          ? formData.category_ids.map((id) => Number(id)).filter((id) => !isNaN(id) && id > 0)
          : [],
        tag_ids: Array.isArray(formData.tag_ids)
          ? formData.tag_ids.map((id) => Number(id)).filter((id) => !isNaN(id) && id > 0)
          : [],
        published_at: formatDateTimeToISO(formData.published_at),
      };

      onSubmit?.(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onCancel?.();
  };

  if (!show) return null;

  const coverImageUrl = formData.cover_image || null;
  const imageUrl = formData.image || null;
  const ogImageUrl = formData.og_image || null;

  return (
    <Modal show={show} onClose={handleClose} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit} className="space-y-8" onClick={(e) => e.stopPropagation()}>
        {/* Thông tin cơ bản */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin bài viết</h3>
            <p className="text-sm text-gray-600 mt-1">Điền tiêu đề và nội dung chính</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.name || apiErrors.name ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                  }`}
                placeholder="Nhập tiêu đề bài viết"
              />
              {validationErrors.name && <p className="mt-2 text-sm text-red-600">{validationErrors.name}</p>}
              {apiErrors.name && !validationErrors.name && (
                <p className="mt-2 text-sm text-red-600">{Array.isArray(apiErrors.name) ? apiErrors.name[0] : apiErrors.name}</p>
              )}
            </div>

            <div className="md:col-span-1">
              <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 mb-2">
                Ngày xuất bản
              </label>
              <input
                id="published_at"
                type="datetime-local"
                value={formData.published_at || ""}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.published_at || apiErrors.published_at ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                  }`}
              />
              {validationErrors.published_at && <p className="mt-2 text-sm text-red-600">{validationErrors.published_at}</p>}
              {apiErrors.published_at && !validationErrors.published_at && (
                <p className="mt-2 text-sm text-red-600">{Array.isArray(apiErrors.published_at) ? apiErrors.published_at[0] : apiErrors.published_at}</p>
              )}
            </div>

            <div className="md:col-span-1">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <SingleSelectEnhanced
                value={formData.status || "draft"}
                onChange={(value) => setFormData({ ...formData, status: value as string })}
                options={statusOptions}
                placeholder="-- Chọn trạng thái --"
                error={validationErrors.status || (apiErrors.status ? String(apiErrors.status) : undefined)}
              />
              {validationErrors.status && <p className="mt-2 text-sm text-red-600">{validationErrors.status}</p>}
              {apiErrors.status && !validationErrors.status && (
                <p className="mt-2 text-sm text-red-600">{Array.isArray(apiErrors.status) ? apiErrors.status[0] : apiErrors.status}</p>
              )}
            </div>

            <div className="md:col-span-1">
              <label htmlFor="post_type" className="block text-sm font-medium text-gray-700 mb-2">
                Loại bài viết
              </label>
              <select
                id="post_type"
                value={formData.post_type || "text"}
                onChange={(e) => setFormData({ ...formData, post_type: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.post_type || apiErrors.post_type ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                  }`}
              >
                {postTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {validationErrors.post_type && <p className="mt-2 text-sm text-red-600">{validationErrors.post_type}</p>}
              {apiErrors.post_type && !validationErrors.post_type && (
                <p className="mt-2 text-sm text-red-600">{Array.isArray(apiErrors.post_type) ? apiErrors.post_type[0] : apiErrors.post_type}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Tóm tắt</label>
            <CKEditor
              value={formData.excerpt || ""}
              onChange={(value) => setFormData({ ...formData, excerpt: value })}
              placeholder="Nhập tóm tắt bài viết..."
              height="220px"
            />
            {validationErrors.excerpt && <p className="mt-1 text-sm text-red-600">{validationErrors.excerpt}</p>}
            {apiErrors.excerpt && !validationErrors.excerpt && (
              <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.excerpt) ? apiErrors.excerpt[0] : apiErrors.excerpt}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Ảnh bìa</label>
            <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-white shadow-sm">
              <ImageUploader
                value={formData.cover_image}
                onChange={(value) => setFormData({ ...formData, cover_image: value as string })}
                defaultUrl={coverImageUrl || undefined}
              />
              <p className="text-xs text-gray-500 mt-2">Định dạng: jpg, png, webp. Kích thước khuyến nghị 1200x630.</p>
            </div>
            {validationErrors.cover_image && <p className="mt-1 text-sm text-red-600">{validationErrors.cover_image}</p>}
            {apiErrors.cover_image && !validationErrors.cover_image && (
              <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.cover_image) ? apiErrors.cover_image[0] : apiErrors.cover_image}</p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
              <ImageUploader
                value={formData.image}
                onChange={(value) => setFormData({ ...formData, image: value as string })}
                defaultUrl={imageUrl || undefined}
              />
              {validationErrors.image && <p className="mt-1 text-sm text-red-600">{validationErrors.image}</p>}
              {apiErrors.image && !validationErrors.image && (
                <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.image) ? apiErrors.image[0] : apiErrors.image}</p>
              )}
            </div>
          </div>
        </div>

        {/* Nội dung chi tiết */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Nội dung & media</h3>
            <p className="text-sm text-gray-600 mt-1">Soạn thảo nội dung đầy đủ cho bài viết</p>
          </div>
          <div>
            <CKEditor
              value={formData.content || ""}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Nhập nội dung bài viết..."
              height="400px"
            />
            {validationErrors.content && <p className="mt-1 text-sm text-red-600">{validationErrors.content}</p>}
            {apiErrors.content && !validationErrors.content && (
              <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.content) ? apiErrors.content[0] : apiErrors.content}</p>
            )}
          </div>

          {/* Video URL */}
          {formData.post_type === "video" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Video URL</label>
              <input
                type="url"
                value={formData.video_url || ""}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://example.com/video.mp4"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.video_url || apiErrors.video_url ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                  }`}
              />
              {validationErrors.video_url && <p className="mt-1 text-sm text-red-600">{validationErrors.video_url}</p>}
              {apiErrors.video_url && !validationErrors.video_url && (
                <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.video_url) ? apiErrors.video_url[0] : apiErrors.video_url}</p>
              )}
            </div>
          )}

          {/* Audio URL */}
          {formData.post_type === "audio" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Audio URL</label>
              <input
                type="url"
                value={formData.audio_url || ""}
                onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                placeholder="https://example.com/audio.mp3"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.audio_url || apiErrors.audio_url ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                  }`}
              />
              {validationErrors.audio_url && <p className="mt-1 text-sm text-red-600">{validationErrors.audio_url}</p>}
              {apiErrors.audio_url && !validationErrors.audio_url && (
                <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.audio_url) ? apiErrors.audio_url[0] : apiErrors.audio_url}</p>
              )}
            </div>
          )}
        </div>

        {/* Phân loại & trạng thái */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Phân loại & hiển thị</h3>
            <p className="text-sm text-gray-600 mt-1">Thiết lập danh mục, thẻ và hiển thị</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục chính</label>
              <SearchableSelect
                value={formData.primary_postcategory_id}
                onChange={(value) => setFormData({ ...formData, primary_postcategory_id: value as number | null })}
                searchApi={adminEndpoints.postCategories.list}
                labelField="name"
                placeholder="Chọn danh mục chính"
                error={validationErrors.primary_postcategory_id || (apiErrors.primary_postcategory_id ? String(apiErrors.primary_postcategory_id) : undefined)}
              />
              {validationErrors.primary_postcategory_id && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.primary_postcategory_id}</p>
              )}
              {apiErrors.primary_postcategory_id && !validationErrors.primary_postcategory_id && (
                <p className="mt-1 text-sm text-red-600">
                  {Array.isArray(apiErrors.primary_postcategory_id) ? apiErrors.primary_postcategory_id[0] : apiErrors.primary_postcategory_id}
                </p>
              )}
            </div>

            <div>
              <MultipleSelect
                value={formData.category_ids || []}
                onChange={(value) => setFormData({ ...formData, category_ids: value as number[] })}
                options={categoryOptions}
                label="Danh mục"
                placeholder="Chọn danh mục"
                error={validationErrors.category_ids || (apiErrors.category_ids ? String(apiErrors.category_ids) : undefined)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <MultipleSelect
                value={formData.tag_ids || []}
                onChange={(value) => setFormData({ ...formData, tag_ids: value as number[] })}
                options={tagOptions}
                label="Thẻ"
                placeholder="Chọn thẻ"
                error={validationErrors.tag_ids || (apiErrors.tag_ids ? String(apiErrors.tag_ids) : undefined)}
              />
            </div>
          </div>

          {/* Tùy chọn hiển thị */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <input
                  id="is_featured"
                  type="checkbox"
                  checked={formData.is_featured || false}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_featured" className="ml-2 text-sm font-medium text-gray-700">
                  Bài viết nổi bật
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Hiển thị ưu tiên trên trang chủ</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <input
                  id="is_pinned"
                  type="checkbox"
                  checked={formData.is_pinned || false}
                  onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_pinned" className="ml-2 text-sm font-medium text-gray-700">
                  Bài viết ghim
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Ghim bài viết lên đầu danh sách</p>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="space-y-6 mt-8">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
              SEO
            </h3>
            <p className="text-sm text-gray-600 mt-1">Tối ưu hiển thị trên công cụ tìm kiếm và mạng xã hội</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                id="meta_title"
                type="text"
                value={formData.meta_title || ""}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="Tiêu đề SEO"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.meta_title || apiErrors.meta_title ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                  }`}
              />
              <p className="text-xs text-gray-500 mt-1">Tiêu đề hiển thị trên công cụ tìm kiếm</p>
            </div>

            <div>
              <label htmlFor="canonical_url" className="block text-sm font-medium text-gray-700 mb-2">
                Canonical URL
              </label>
              <input
                id="canonical_url"
                type="url"
                value={formData.canonical_url || ""}
                onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                placeholder="https://example.com/page"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.canonical_url || apiErrors.canonical_url ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                  }`}
              />
              <p className="text-xs text-gray-500 mt-1">URL chính thức để tránh nội dung trùng lặp</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
            <CKEditor
              value={formData.meta_description || ""}
              onChange={(value) => setFormData({ ...formData, meta_description: value })}
              placeholder="Mô tả SEO"
              height="120px"
            />
            <p className="text-xs text-gray-500 mt-1">Mô tả hiển thị trên công cụ tìm kiếm</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="og_title" className="block text-sm font-medium text-gray-700 mb-2">
                OG Title
              </label>
              <input
                id="og_title"
                type="text"
                value={formData.og_title || ""}
                onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                placeholder="Tiêu đề mạng xã hội"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.og_title || apiErrors.og_title ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                  }`}
              />
              <p className="text-xs text-gray-500 mt-1">Tiêu đề khi chia sẻ lên mạng xã hội</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">OG Image</label>
              <ImageUploader
                value={formData.og_image}
                onChange={(value) => setFormData({ ...formData, og_image: value as string })}
                defaultUrl={ogImageUrl || undefined}
              />
              <p className="text-xs text-gray-500 mt-1">Hình ảnh hiển thị khi chia sẻ (khuyến nghị 1200x630px)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">OG Description</label>
            <CKEditor
              value={formData.og_description || ""}
              onChange={(value) => setFormData({ ...formData, og_description: value })}
              placeholder="Mô tả mạng xã hội"
              height="120px"
            />
            <p className="text-xs text-gray-500 mt-1">Mô tả khi chia sẻ lên mạng xã hội</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : post ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

