"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Testimonial {
  id?: number;
  client_name?: string;
  client_position?: string;
  client_company?: string;
  client_avatar?: string | null;
  content?: string;
  rating?: number | null;
  project_id?: number | null;
  featured?: boolean;
  status?: string;
  sort_order?: number;
}

interface TestimonialFormProps {
  show: boolean;
  testimonial?: Testimonial | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: Partial<Testimonial>) => void;
  onCancel?: () => void;
}

export default function TestimonialForm({
  show,
  testimonial,
  apiErrors = {},
  onSubmit,
  onCancel,
}: TestimonialFormProps) {
  const formTitle = testimonial ? "Chỉnh sửa đánh giá" : "Thêm đánh giá mới";

  const [formData, setFormData] = useState<Partial<Testimonial>>({
    client_name: "",
    client_position: "",
    client_company: "",
    client_avatar: null,
    content: "",
    rating: null,
    project_id: null,
    featured: false,
    status: "active",
    sort_order: 0,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = useMemo(() => getBasicStatusArray(), []);
  const ratingOptions = useMemo(
    () => [
      { value: "", label: "Không đánh giá" },
      { value: "1", label: "1 sao" },
      { value: "2", label: "2 sao" },
      { value: "3", label: "3 sao" },
      { value: "4", label: "4 sao" },
      { value: "5", label: "5 sao" },
    ],
    []
  );
  const avatarUrl = useMemo(() => testimonial?.client_avatar || null, [testimonial]);

  useEffect(() => {
    if (testimonial) {
      setFormData({
        client_name: testimonial.client_name || "",
        client_position: testimonial.client_position || "",
        client_company: testimonial.client_company || "",
        client_avatar: testimonial.client_avatar || null,
        content: testimonial.content || "",
        rating: testimonial.rating ?? null,
        project_id: testimonial.project_id ?? null,
        featured: Boolean(testimonial.featured),
        status: testimonial.status || "active",
        sort_order: testimonial.sort_order || 0,
      });
    } else {
      setFormData({
        client_name: "",
        client_position: "",
        client_company: "",
        client_avatar: null,
        content: "",
        rating: null,
        project_id: null,
        featured: false,
        status: "active",
        sort_order: 0,
      });
    }
    setValidationErrors({});
  }, [testimonial, show]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.client_name?.trim()) {
      errors.client_name = "Tên khách hàng là bắt buộc";
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
        client_name: formData.client_name?.trim(),
        client_position: formData.client_position?.trim() || undefined,
        client_company: formData.client_company?.trim() || undefined,
        client_avatar: formData.client_avatar || null,
        content: formData.content?.trim(),
        rating: formData.rating ? Number(formData.rating) : null,
        project_id: formData.project_id ? Number(formData.project_id) : null,
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
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin lời chứng thực</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                label="Tên khách hàng"
                type="text"
                value={formData.client_name}
                placeholder="Nhập tên khách hàng"
                required
                error={validationErrors.client_name || getApiError("client_name")}
                onChange={(value) => setFormData({ ...formData, client_name: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Công ty"
                type="text"
                value={formData.client_company}
                placeholder="Công ty XYZ"
                onChange={(value) => setFormData({ ...formData, client_company: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Chức vụ"
                type="text"
                value={formData.client_position}
                placeholder="Giám đốc"
                onChange={(value) => setFormData({ ...formData, client_position: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Dự án liên quan (ID)"
                type="number"
                value={formData.project_id ?? ""}
                placeholder="1"
                min={0}
                onChange={(value) => setFormData({ ...formData, project_id: Number(value) || null })}
              />
            </div>

            <div>
              <FormField
                label="Đánh giá"
                type="select"
                value={formData.rating ? String(formData.rating) : ""}
                options={ratingOptions}
                onChange={(value) =>
                  setFormData({ ...formData, rating: value ? Number(value) : null })
                }
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
            <label className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
            <ImageUploader
              value={formData.client_avatar}
              defaultUrl={avatarUrl || undefined}
              onChange={(value) => setFormData({ ...formData, client_avatar: value as string | null })}
              onRemove={() => setFormData({ ...formData, client_avatar: null })}
            />
          </div>

          <div>
            <FormField
              label="Nội dung"
              type="textarea"
              value={formData.content}
              placeholder="Lời chứng thực..."
              rows={4}
              required
              error={validationErrors.content || getApiError("content")}
              onChange={(value) => setFormData({ ...formData, content: value as string })}
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
            {isSubmitting ? "Đang xử lý..." : testimonial ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}


