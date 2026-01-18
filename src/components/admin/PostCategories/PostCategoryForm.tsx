"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import CKEditor from "@/components/ui/CKEditor";
import { userEndpoints } from "@/lib/api/endpoints";
import SingleSelectEnhanced from "@/components/ui/SingleSelectEnhanced";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface PostCategory {
  id?: number;
  name?: string;
  description?: string;
  image?: string | null;
  og_image?: string | null;
  status?: string;
  sort_order?: number;
  parent_id?: number | null;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
}

interface PostCategoryFormProps {
  show: boolean;
  category?: PostCategory | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: Partial<PostCategory>) => void;
  onCancel?: () => void;
}

export default function PostCategoryForm({
  show,
  category,
  statusEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: PostCategoryFormProps) {
  const formTitle = category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới";

  const [formData, setFormData] = useState<Partial<PostCategory>>({
    name: "",
    description: "",
    image: null,
    og_image: null,
    status: "active",
    sort_order: 0,
    parent_id: null,
    meta_title: "",
    meta_description: "",
    canonical_url: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = useMemo(() => {
    const statusArray = statusEnums && statusEnums.length > 0 ? statusEnums : getBasicStatusArray();
    return statusArray.map((opt) => ({
      value: opt.value,
      label: opt.label || (opt as any).name || opt.value,
    }));
  }, [statusEnums]);

  const imageUrl = useMemo(() => category?.image || null, [category]);
  const ogImageUrl = useMemo(() => category?.og_image || null, [category]);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        image: category.image || null,
        og_image: category.og_image || null,
        status: category.status || "active",
        sort_order: category.sort_order || 0,
        parent_id: category.parent_id || null,
        meta_title: category.meta_title || "",
        meta_description: category.meta_description || "",
        canonical_url: category.canonical_url || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        image: null,
        og_image: null,
        status: "active",
        sort_order: 0,
        parent_id: null,
        meta_title: "",
        meta_description: "",
        canonical_url: "",
      });
    }
    setValidationErrors({});
  }, [category, show]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = "Tên danh mục là bắt buộc";
    }

    if (formData.name && formData.name.length > 255) {
      errors.name = "Tên danh mục không được vượt quá 255 ký tự";
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
        description: formData.description?.trim() || undefined,
        image: formData.image || null,
        og_image: formData.og_image || null,
        status: formData.status || "active",
        sort_order: Number(formData.sort_order) || 0,
        parent_id: formData.parent_id || null,
        meta_title: formData.meta_title?.trim() || undefined,
        meta_description: formData.meta_description?.trim() || undefined,
        canonical_url: formData.canonical_url?.trim() || undefined,
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
            <h3 className="text-lg font-semibold text-gray-900">Thông tin danh mục</h3>
            <p className="text-sm text-gray-600 mt-1">Tên, mô tả và hình ảnh danh mục</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                label="Tên danh mục"
                type="text"
                value={formData.name}
                placeholder="Nhập tên danh mục"
                required
                error={validationErrors.name || getApiError("name")}
                onChange={(value) => setFormData({ ...formData, name: value as string })}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Mô tả</label>
              <CKEditor
                value={formData.description || ""}
                onChange={(value) => setFormData({ ...formData, description: value as string })}
                height="200px"
                placeholder="Nhập mô tả danh mục..."
                uploadUrl={userEndpoints.uploads.image}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh danh mục</label>
              <ImageUploader
                value={formData.image}
                defaultUrl={imageUrl || undefined}
                onChange={(value) => setFormData({ ...formData, image: value as string | null })}
                onRemove={() => setFormData({ ...formData, image: null })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">OG Image</label>
              <ImageUploader
                value={formData.og_image}
                defaultUrl={ogImageUrl || undefined}
                onChange={(value) => setFormData({ ...formData, og_image: value as string | null })}
                onRemove={() => setFormData({ ...formData, og_image: null })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <SingleSelectEnhanced
                value={formData.status}
                options={statusOptions}
                labelField="label"
                valueField="value"
                placeholder="-- Chọn trạng thái --"
                error={validationErrors.status || getApiError("status")}
                onChange={(value) => setFormData({ ...formData, status: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Thứ tự sắp xếp"
                type="number"
                value={formData.sort_order}
                placeholder="0"
                min={0}
                onChange={(value) => setFormData({ ...formData, sort_order: Number(value) || 0 })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
            <CKEditor
              value={formData.meta_description || ""}
              onChange={(value) => setFormData({ ...formData, meta_description: value as string })}
              height="120px"
              placeholder="Mô tả SEO"
              uploadUrl={userEndpoints.uploads.image}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
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
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            {isSubmitting ? "Đang xử lý..." : category ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

