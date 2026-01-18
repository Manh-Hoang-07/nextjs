"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import CKEditor from "@/components/ui/CKEditor";
import { userEndpoints } from "@/lib/api/endpoints";
import SingleSelectEnhanced from "@/components/ui/SingleSelectEnhanced";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Tag {
  id?: number;
  name?: string;
  description?: string;
  status?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
}

interface TagFormProps {
  show: boolean;
  tag?: Tag | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: Partial<Tag>) => void;
  onCancel?: () => void;
}

export default function TagForm({
  show,
  tag,
  statusEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: TagFormProps) {
  const formTitle = tag ? "Chỉnh sửa thẻ" : "Thêm thẻ mới";

  const [formData, setFormData] = useState<Partial<Tag>>({
    name: "",
    description: "",
    status: "active",
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

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name || "",
        description: tag.description || "",
        status: tag.status || "active",
        meta_title: tag.meta_title || "",
        meta_description: tag.meta_description || "",
        canonical_url: tag.canonical_url || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        status: "active",
        meta_title: "",
        meta_description: "",
        canonical_url: "",
      });
    }
    setValidationErrors({});
  }, [tag, show]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = "Tên thẻ là bắt buộc";
    }

    if (formData.name && formData.name.length > 255) {
      errors.name = "Tên thẻ không được vượt quá 255 ký tự";
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
        status: formData.status || "active",
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
            <h3 className="text-lg font-semibold text-gray-900">Thông tin thẻ</h3>
            <p className="text-sm text-gray-600 mt-1">Tên, mô tả và trạng thái</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                label="Tên thẻ"
                type="text"
                value={formData.name}
                placeholder="Nhập tên thẻ"
                required
                error={validationErrors.name || getApiError("name")}
                onChange={(value) => setFormData({ ...formData, name: value as string })}
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <CKEditor
                value={formData.description || ""}
                onChange={(value) => setFormData({ ...formData, description: value as string })}
                height="180px"
                placeholder="Nhập mô tả thẻ..."
                uploadUrl={userEndpoints.uploads.image}
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
            {isSubmitting ? "Đang xử lý..." : tag ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

