"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";

const getCertificateTypeArray = () => [
  { value: "iso", label: "ISO" },
  { value: "quality", label: "Chất lượng" },
  { value: "safety", label: "An toàn" },
  { value: "environment", label: "Môi trường" },
  { value: "license", label: "Giấy phép" },
  { value: "other", label: "Khác" },
];

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Certificate {
  id?: number;
  name?: string;
  image?: string | null;
  issued_by?: string;
  issued_date?: string;
  expiry_date?: string;
  certificate_number?: string;
  description?: string;
  type?: string;
  status?: string;
  sort_order?: number;
}

interface CertificateFormProps {
  show: boolean;
  certificate?: Certificate | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: Partial<Certificate>) => void;
  onCancel?: () => void;
}

export default function CertificateForm({
  show,
  certificate,
  apiErrors = {},
  onSubmit,
  onCancel,
}: CertificateFormProps) {
  const formTitle = certificate ? "Chỉnh sửa chứng chỉ" : "Thêm chứng chỉ mới";

  const [formData, setFormData] = useState<Partial<Certificate>>({
    name: "",
    image: null,
    issued_by: "",
    issued_date: "",
    expiry_date: "",
    certificate_number: "",
    description: "",
    type: "license",
    status: "active",
    sort_order: 0,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const certificateTypeOptions = useMemo(() => getCertificateTypeArray(), []);
  const statusOptions = useMemo(() => getBasicStatusArray(), []);
  const imageUrl = useMemo(() => certificate?.image || null, [certificate]);

  useEffect(() => {
    if (certificate) {
      setFormData({
        name: certificate.name || "",
        image: certificate.image || null,
        issued_by: certificate.issued_by || "",
        issued_date: normalizeDate(certificate.issued_date),
        expiry_date: normalizeDate(certificate.expiry_date),
        certificate_number: certificate.certificate_number || "",
        description: certificate.description || "",
        type: certificate.type || "license",
        status: certificate.status || "active",
        sort_order: certificate.sort_order || 0,
      });
    } else {
      setFormData({
        name: "",
        image: null,
        issued_by: "",
        issued_date: "",
        expiry_date: "",
        certificate_number: "",
        description: "",
        type: "license",
        status: "active",
        sort_order: 0,
      });
    }
    setValidationErrors({});
  }, [certificate, show]);

  const normalizeDate = (value?: string): string => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    const iso = d.toISOString();
    return iso.slice(0, 16);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = "Tên chứng chỉ là bắt buộc";
    }

    if (!formData.image) {
      errors.image = "Ảnh chứng chỉ là bắt buộc";
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
        image: formData.image,
        issued_by: formData.issued_by?.trim() || undefined,
        issued_date: formData.issued_date ? new Date(formData.issued_date).toISOString() : undefined,
        expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : undefined,
        certificate_number: formData.certificate_number?.trim() || undefined,
        description: formData.description?.trim() || undefined,
        type: formData.type || "license",
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
            <h3 className="text-lg font-semibold text-gray-900">Thông tin chứng chỉ</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                label="Tên chứng chỉ"
                type="text"
                value={formData.name}
                placeholder="Nhập tên chứng chỉ"
                required
                error={validationErrors.name || getApiError("name")}
                onChange={(value) => setFormData({ ...formData, name: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Loại"
                type="select"
                value={formData.type}
                options={certificateTypeOptions}
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
                label="Cơ quan cấp"
                type="text"
                value={formData.issued_by}
                placeholder="Tên tổ chức cấp"
                onChange={(value) => setFormData({ ...formData, issued_by: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Số chứng chỉ"
                type="text"
                value={formData.certificate_number}
                placeholder="Mã/ số chứng chỉ"
                onChange={(value) => setFormData({ ...formData, certificate_number: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Ngày cấp"
                type="datetime-local"
                value={formData.issued_date}
                onChange={(value) => setFormData({ ...formData, issued_date: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Ngày hết hạn"
                type="datetime-local"
                value={formData.expiry_date}
                onChange={(value) => setFormData({ ...formData, expiry_date: value as string })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Ảnh chứng chỉ <span className="text-red-500">*</span>
            </label>
            <ImageUploader
              value={formData.image}
              defaultUrl={imageUrl || undefined}
              onChange={(value) => setFormData({ ...formData, image: value as string | null })}
              onRemove={() => setFormData({ ...formData, image: null })}
            />
            {validationErrors.image && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.image}</p>
            )}
            {getApiError("image") && (
              <p className="mt-1 text-sm text-red-600">{getApiError("image")}</p>
            )}
          </div>

          <div>
            <FormField
              label="Mô tả"
              type="textarea"
              value={formData.description}
              placeholder="Mô tả thêm về chứng chỉ"
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
            {isSubmitting ? "Đang xử lý..." : certificate ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}


