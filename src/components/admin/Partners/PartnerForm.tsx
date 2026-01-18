"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";

const getPartnerTypeArray = () => [
  { value: "supplier", label: "Nhà cung cấp" },
  { value: "client", label: "Khách hàng" },
  { value: "partner", label: "Đối tác" },
  { value: "sponsor", label: "Nhà tài trợ" },
  { value: "other", label: "Khác" },
];

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Partner {
  id?: number;
  name?: string;
  logo?: string | null;
  website?: string;
  description?: string;
  type?: string;
  status?: string;
  sort_order?: number;
}

interface PartnerFormProps {
  show: boolean;
  partner?: Partner | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: Partial<Partner>) => void;
  onCancel?: () => void;
}

export default function PartnerForm({
  show,
  partner,
  apiErrors = {},
  onSubmit,
  onCancel,
}: PartnerFormProps) {
  const formTitle = partner ? "Chỉnh sửa đối tác" : "Thêm đối tác mới";

  const [formData, setFormData] = useState<Partial<Partner>>({
    name: "",
    logo: null,
    website: "",
    description: "",
    type: "client",
    status: "active",
    sort_order: 0,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = useMemo(() => getBasicStatusArray(), []);
  const typeOptions = useMemo(() => getPartnerTypeArray(), []);
  const logoUrl = useMemo(() => partner?.logo || null, [partner]);

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name || "",
        logo: partner.logo || null,
        website: partner.website || "",
        description: partner.description || "",
        type: partner.type || "client",
        status: partner.status || "active",
        sort_order: partner.sort_order || 0,
      });
    } else {
      setFormData({
        name: "",
        logo: null,
        website: "",
        description: "",
        type: "client",
        status: "active",
        sort_order: 0,
      });
    }
    setValidationErrors({});
  }, [partner, show]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = "Tên đối tác là bắt buộc";
    }

    if (!formData.logo) {
      errors.logo = "Logo là bắt buộc";
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
        logo: formData.logo,
        website: formData.website?.trim() || undefined,
        description: formData.description?.trim() || undefined,
        type: formData.type || "client",
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
            <h3 className="text-lg font-semibold text-gray-900">Thông tin đối tác</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                label="Tên đối tác"
                type="text"
                value={formData.name}
                placeholder="Nhập tên đối tác"
                required
                error={validationErrors.name || getApiError("name")}
                onChange={(value) => setFormData({ ...formData, name: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Loại đối tác"
                type="select"
                value={formData.type}
                options={typeOptions}
                onChange={(value) => setFormData({ ...formData, type: value as string })}
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

            <div>
              <FormField
                label="Website"
                type="url"
                value={formData.website}
                placeholder="https://example.com"
                onChange={(value) => setFormData({ ...formData, website: value as string })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Logo <span className="text-red-500">*</span>
            </label>
            <ImageUploader
              value={formData.logo}
              defaultUrl={logoUrl || undefined}
              onChange={(value) => setFormData({ ...formData, logo: value as string | null })}
              onRemove={() => setFormData({ ...formData, logo: null })}
            />
            {validationErrors.logo && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.logo}</p>
            )}
            {getApiError("logo") && (
              <p className="mt-1 text-sm text-red-600">{getApiError("logo")}</p>
            )}
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
            {isSubmitting ? "Đang xử lý..." : partner ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}


