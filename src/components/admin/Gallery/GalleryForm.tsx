"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Gallery {
  id?: number;
  title?: string;
  slug?: string;
  description?: string;
  cover_image?: string | null;
  images?: string[];
  featured?: boolean;
  status?: string;
  sort_order?: number;
}

interface GalleryFormProps {
  show: boolean;
  gallery?: Gallery | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: Partial<Gallery>) => void;
  onCancel?: () => void;
}

export default function GalleryForm({
  show,
  gallery,
  apiErrors = {},
  onSubmit,
  onCancel,
}: GalleryFormProps) {
  const formTitle = gallery ? "Chỉnh sửa gallery" : "Thêm gallery mới";

  const [formData, setFormData] = useState<Partial<Gallery>>({
    title: "",
    slug: "",
    description: "",
    cover_image: null,
    images: [],
    featured: false,
    status: "active",
    sort_order: 0,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = useMemo(() => getBasicStatusArray(), []);
  const coverImageUrl = useMemo(() => gallery?.cover_image || null, [gallery]);

  useEffect(() => {
    if (gallery) {
      setFormData({
        title: gallery.title || "",
        slug: gallery.slug || "",
        description: gallery.description || "",
        cover_image: gallery.cover_image || null,
        images: Array.isArray(gallery.images) ? gallery.images : [],
        featured: Boolean(gallery.featured),
        status: gallery.status || "active",
        sort_order: gallery.sort_order || 0,
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        description: "",
        cover_image: null,
        images: [],
        featured: false,
        status: "active",
        sort_order: 0,
      });
    }
    setValidationErrors({});
  }, [gallery, show]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      errors.title = "Tiêu đề là bắt buộc";
    }

    if (!formData.images || formData.images.length === 0) {
      errors.images = "Vui lòng chọn ít nhất 1 ảnh";
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
        title: formData.title?.trim(),
        slug: formData.slug?.trim() || undefined,
        description: formData.description?.trim() || undefined,
        cover_image: formData.cover_image || null,
        images: formData.images || [],
        featured: Boolean(formData.featured),
        status: formData.status || "active",
        sort_order: Number(formData.sort_order) || 0,
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
            <h3 className="text-lg font-semibold text-gray-900">Thông tin gallery</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                label="Tiêu đề"
                type="text"
                value={formData.title}
                placeholder="Nhập tiêu đề"
                required
                error={validationErrors.title || getApiError("title")}
                onChange={(value) => setFormData({ ...formData, title: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Slug (tùy chọn)"
                type="text"
                value={formData.slug}
                placeholder="Tự tạo nếu bỏ trống"
                onChange={(value) => setFormData({ ...formData, slug: value as string })}
              />
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
                label="Thứ tự"
                type="number"
                value={formData.sort_order}
                placeholder="0"
                onChange={(value) => setFormData({ ...formData, sort_order: Number(value) || 0 })}
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Nổi bật
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Ảnh bìa</label>
            <ImageUploader
              value={formData.cover_image}
              defaultUrl={coverImageUrl || undefined}
              onChange={(value) => setFormData({ ...formData, cover_image: value as string | null })}
              onRemove={() => setFormData({ ...formData, cover_image: null })}
            />
          </div>

          <div>
            <FormField
              label="Mô tả"
              type="textarea"
              value={formData.description}
              placeholder="Mô tả ngắn"
              rows={3}
              onChange={(value) => setFormData({ ...formData, description: value as string })}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Danh sách ảnh <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setFormData({
                  ...formData,
                  images: files.map((f) => URL.createObjectURL(f)),
                });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
            />
            {validationErrors.images && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.images}</p>
            )}
            {getApiError("images") && (
              <p className="mt-1 text-sm text-red-600">{getApiError("images")}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? "Đang xử lý..." : gallery ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}


