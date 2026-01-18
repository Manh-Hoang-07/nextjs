"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import CKEditor from "@/components/ui/CKEditor";
import { userEndpoints } from "@/lib/api/endpoints";

// Enum helpers
const getAboutSectionTypeArray = () => [
  { value: "history", label: "Lịch sử" },
  { value: "mission", label: "Sứ mệnh" },
  { value: "vision", label: "Tầm nhìn" },
  { value: "values", label: "Giá trị cốt lõi" },
  { value: "culture", label: "Văn hóa" },
  { value: "achievement", label: "Thành tựu" },
  { value: "other", label: "Khác" },
];

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface AboutSection {
  id?: number;
  title?: string;
  slug?: string;
  content?: string;
  image?: string | null;
  video_url?: string;
  section_type?: string;
  status?: string;
  sort_order?: number;
}

interface AboutSectionFormProps {
  show: boolean;
  section?: AboutSection | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: Partial<AboutSection>) => void;
  onCancel?: () => void;
}

export default function AboutSectionForm({
  show,
  section,
  apiErrors = {},
  onSubmit,
  onCancel,
}: AboutSectionFormProps) {
  const formTitle = section ? "Chỉnh sửa section" : "Thêm section mới";

  const [formData, setFormData] = useState<Partial<AboutSection>>({
    title: "",
    slug: "",
    content: "",
    image: null,
    video_url: "",
    section_type: "history",
    status: "active",
    sort_order: 0,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectionTypeOptions = useMemo(() => getAboutSectionTypeArray(), []);
  const statusOptions = useMemo(() => getBasicStatusArray(), []);
  const imageUrl = useMemo(() => section?.image || null, [section]);

  useEffect(() => {
    if (section) {
      setFormData({
        title: section.title || "",
        slug: section.slug || "",
        content: section.content || "",
        image: section.image || null,
        video_url: section.video_url || "",
        section_type: section.section_type || "history",
        status: section.status || "active",
        sort_order: section.sort_order || 0,
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        content: "",
        image: null,
        video_url: "",
        section_type: "history",
        status: "active",
        sort_order: 0,
      });
    }
    setValidationErrors({});
  }, [section, show]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      errors.title = "Tiêu đề là bắt buộc";
    }

    if (!formData.content?.trim()) {
      errors.content = "Nội dung là bắt buộc";
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
        content: formData.content?.trim(),
        image: formData.image || null,
        video_url: formData.video_url?.trim() || undefined,
        section_type: formData.section_type,
        status: formData.status,
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
            <h3 className="text-lg font-semibold text-gray-900">Thông tin section</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
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
                placeholder="Tùy chọn, hệ thống tự tạo nếu bỏ trống"
                error={getApiError("slug")}
                onChange={(value) => setFormData({ ...formData, slug: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Loại section"
                type="select"
                value={formData.section_type}
                options={sectionTypeOptions}
                onChange={(value) => setFormData({ ...formData, section_type: value as string })}
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
                onChange={(value) => setFormData({ ...formData, sort_order: Number(value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <CKEditor
              value={formData.content || ""}
              placeholder="Nhập nội dung..."
              height="400px"
              uploadUrl={userEndpoints.uploads.image}
              onChange={(value) => setFormData({ ...formData, content: value })}
            />
            {validationErrors.content && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.content}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
            <ImageUploader
              value={formData.image}
              defaultUrl={imageUrl || undefined}
              onChange={(value) => setFormData({ ...formData, image: value as string | null })}
              onRemove={() => setFormData({ ...formData, image: null })}
            />
          </div>

          <div>
            <FormField
              label="Video URL"
              type="text"
              value={formData.video_url}
              placeholder="https://..."
              onChange={(value) => setFormData({ ...formData, video_url: value as string })}
            />
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
            {isSubmitting ? "Đang xử lý..." : section ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}


