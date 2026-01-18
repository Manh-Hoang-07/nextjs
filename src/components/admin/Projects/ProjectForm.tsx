"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import CKEditor from "@/components/ui/CKEditor";
import { userEndpoints } from "@/lib/api/endpoints";

const getProjectStatusArray = () => [
  { value: "planning", label: "Đang lập kế hoạch" },
  { value: "in_progress", label: "Đang thực hiện" },
  { value: "completed", label: "Hoàn thành" },
  { value: "on_hold", label: "Tạm dừng" },
  { value: "cancelled", label: "Đã hủy" },
];

interface Project {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  cover_image?: string | null;
  location?: string;
  area?: number | null;
  start_date?: string;
  end_date?: string;
  status?: string;
  client_name?: string;
  budget?: number | null;
  images?: string[];
  featured?: boolean;
  sort_order?: number;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_image?: string | null;
}

interface ProjectFormProps {
  show: boolean;
  project?: Project | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: Partial<Project>) => void;
  onCancel?: () => void;
}

export default function ProjectForm({
  show,
  project,
  statusEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const formTitle = project ? "Chỉnh sửa dự án" : "Thêm dự án mới";

  const [formData, setFormData] = useState<Partial<Project>>({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    cover_image: null,
    location: "",
    area: null,
    start_date: "",
    end_date: "",
    status: "planning",
    client_name: "",
    budget: null,
    images: [],
    featured: false,
    sort_order: 0,
    meta_title: "",
    meta_description: "",
    canonical_url: "",
    og_image: null,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = useMemo(() => {
    const statusArray = statusEnums && statusEnums.length > 0 ? statusEnums : getProjectStatusArray();
    return statusArray.map((opt) => ({
      value: opt.value,
      label: opt.label || (opt as any).name || String(opt.value),
    }));
  }, [statusEnums]);

  const coverImageUrl = useMemo(() => project?.cover_image || null, [project]);
  const ogImageUrl = useMemo(() => project?.og_image || null, [project]);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        slug: project.slug || "",
        description: project.description || "",
        short_description: project.short_description || "",
        cover_image: project.cover_image || null,
        location: project.location || "",
        area: project.area || null,
        start_date: formatDateForInput(project.start_date),
        end_date: formatDateForInput(project.end_date),
        status: project.status || "planning",
        client_name: project.client_name || "",
        budget: project.budget || null,
        images: Array.isArray(project.images) ? project.images : [],
        featured: project.featured || false,
        sort_order: project.sort_order || 0,
        meta_title: project.meta_title || "",
        meta_description: project.meta_description || "",
        canonical_url: project.canonical_url || "",
        og_image: project.og_image || null,
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        short_description: "",
        cover_image: null,
        location: "",
        area: null,
        start_date: "",
        end_date: "",
        status: "planning",
        client_name: "",
        budget: null,
        images: [],
        featured: false,
        sort_order: 0,
        meta_title: "",
        meta_description: "",
        canonical_url: "",
        og_image: null,
      });
    }
    setValidationErrors({});
  }, [project, show]);

  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = "Tên dự án là bắt buộc";
    }

    if (formData.name && formData.name.length > 255) {
      errors.name = "Tên dự án không được vượt quá 255 ký tự";
    }

    if (!formData.images || formData.images.length === 0) {
      errors.images = "Hình ảnh dự án là bắt buộc";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        name: formData.name?.trim(),
        slug: formData.slug?.trim() || undefined,
        description: formData.description?.trim() || undefined,
        short_description: formData.short_description?.trim() || undefined,
        cover_image: formData.cover_image || null,
        location: formData.location?.trim() || undefined,
        area: formData.area ? Number(formData.area) : null,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
        status: formData.status || "planning",
        client_name: formData.client_name?.trim() || undefined,
        budget: formData.budget ? Number(formData.budget) : null,
        images: Array.isArray(formData.images) ? formData.images : [],
        featured: Boolean(formData.featured),
        sort_order: formData.sort_order ? Number(formData.sort_order) : 0,
        meta_title: formData.meta_title?.trim() || undefined,
        meta_description: formData.meta_description?.trim() || undefined,
        canonical_url: formData.canonical_url?.trim() || undefined,
        og_image: formData.og_image || null,
      };
      onSubmit?.(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getApiError = (field: string): string | undefined => {
    const error = apiErrors[field];
    if (Array.isArray(error)) {
      return error[0];
    }
    return error;
  };

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin dự án</h3>
            <p className="text-sm text-gray-600 mt-1">Điền thông tin cơ bản về dự án</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                label="Tên dự án"
                type="text"
                value={formData.name}
                placeholder="Nhập tên dự án"
                required
                error={validationErrors.name || getApiError("name")}
                onChange={(value) => setFormData({ ...formData, name: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Slug"
                type="text"
                value={formData.slug}
                placeholder="Tự động tạo từ tên nếu để trống"
                onChange={(value) => setFormData({ ...formData, slug: value as string })}
              />
              <p className="text-xs text-gray-500 mt-1">Để trống để tự động tạo từ tên</p>
            </div>

            <div>
              <FormField
                label="Trạng thái"
                type="select"
                value={formData.status}
                options={statusOptions}
                onChange={(value) => setFormData({ ...formData, status: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Địa điểm"
                type="text"
                value={formData.location}
                placeholder="Ví dụ: Hà Nội"
                onChange={(value) => setFormData({ ...formData, location: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Diện tích (m²)"
                type="number"
                value={formData.area ?? undefined}
                placeholder="0.00"
                step="0.01"
                onChange={(value) => setFormData({ ...formData, area: Number(value) || null })}
              />
            </div>

            <div>
              <FormField
                label="Tên khách hàng"
                type="text"
                value={formData.client_name}
                placeholder="Tên khách hàng"
                onChange={(value) => setFormData({ ...formData, client_name: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Ngân sách (VNĐ)"
                type="number"
                value={formData.budget ?? undefined}
                placeholder="0"
                onChange={(value) => setFormData({ ...formData, budget: Number(value) || null })}
              />
            </div>

            <div>
              <FormField
                label="Ngày bắt đầu"
                type="date"
                value={formData.start_date}
                onChange={(value) => setFormData({ ...formData, start_date: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Ngày kết thúc"
                type="date"
                value={formData.end_date}
                onChange={(value) => setFormData({ ...formData, end_date: value as string })}
              />
            </div>
          </div>

          <div>
            <FormField
              label="Mô tả ngắn"
              type="textarea"
              value={formData.short_description}
              placeholder="Mô tả ngắn về dự án..."
              rows={3}
              onChange={(value) => setFormData({ ...formData, short_description: value as string })}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Mô tả chi tiết</label>
            <CKEditor
              value={formData.description || ""}
              onChange={(value) => setFormData({ ...formData, description: value as string })}
              height="300px"
              placeholder="Nhập mô tả chi tiết về dự án..."
              uploadUrl={userEndpoints.uploads.image}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Ảnh bìa</label>
            <ImageUploader
              value={formData.cover_image}
              defaultUrl={coverImageUrl || undefined}
              onChange={(value) => setFormData({ ...formData, cover_image: value as string | null })}
              onRemove={() => setFormData({ ...formData, cover_image: null })}
            />
            <p className="text-xs text-gray-500 mt-2">
              Định dạng: jpg, png, webp. Kích thước khuyến nghị 1200x630.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Hình ảnh dự án <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setFormData({ ...formData, images: files.map((f) => URL.createObjectURL(f)) });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
            />
            {validationErrors.images && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.images}</p>
            )}
            {getApiError("images") && (
              <p className="mt-1 text-sm text-red-600">{getApiError("images")}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Có thể chọn nhiều ảnh cùng lúc</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                  Dự án nổi bật
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Hiển thị ưu tiên trên trang chủ</p>
            </div>

            <div>
              <FormField
                label="Thứ tự sắp xếp"
                type="number"
                value={formData.sort_order}
                placeholder="0"
                onChange={(value) => setFormData({ ...formData, sort_order: Number(value) || 0 })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 mt-8">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">SEO</h3>
            <p className="text-sm text-gray-600 mt-1">Tối ưu hiển thị trên công cụ tìm kiếm</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                label="Meta Title"
                type="text"
                value={formData.meta_title}
                placeholder="Tiêu đề SEO"
                onChange={(value) => setFormData({ ...formData, meta_title: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Canonical URL"
                type="url"
                value={formData.canonical_url}
                placeholder="https://example.com/page"
                onChange={(value) => setFormData({ ...formData, canonical_url: value as string })}
              />
            </div>
          </div>

          <div>
            <FormField
              label="Meta Description"
              type="textarea"
              value={formData.meta_description}
              placeholder="Mô tả SEO"
              rows={3}
              onChange={(value) => setFormData({ ...formData, meta_description: value as string })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OG Image</label>
            <ImageUploader
              value={formData.og_image}
              defaultUrl={ogImageUrl || undefined}
              onChange={(value) => setFormData({ ...formData, og_image: value as string | null })}
              onRemove={() => setFormData({ ...formData, og_image: null })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Hình ảnh hiển thị khi chia sẻ (khuyến nghị 1200x630px)
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
          >
            {isSubmitting ? "Đang xử lý..." : project ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}


