"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import SingleSelectEnhanced from "@/components/ui/SingleSelectEnhanced";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface BannerLocation {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  status?: string;
}

interface BannerLocationFormProps {
  show: boolean;
  location?: BannerLocation | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: Partial<BannerLocation>) => void;
  onCancel?: () => void;
}

export default function BannerLocationForm({
  show,
  location,
  statusEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: BannerLocationFormProps) {
  const formTitle = location ? "Chỉnh sửa vị trí banner" : "Thêm vị trí banner mới";

  const [formData, setFormData] = useState<Partial<BannerLocation>>({
    code: "",
    name: "",
    description: "",
    status: "active",
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
    if (location) {
      setFormData({
        code: location.code || "",
        name: location.name || "",
        description: location.description || "",
        status: location.status || "active",
      });
    } else {
      setFormData({
        code: "",
        name: "",
        description: "",
        status: "active",
      });
    }
    setValidationErrors({});
  }, [location, show]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.code?.trim()) {
      errors.code = "Mã vị trí là bắt buộc";
    } else if (!/^[a-z_]+$/.test(formData.code)) {
      errors.code = "Mã vị trí chỉ chứa chữ thường và dấu gạch dưới";
    }

    if (!formData.name?.trim()) {
      errors.name = "Tên vị trí là bắt buộc";
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
        code: formData.code?.trim(),
        name: formData.name?.trim(),
        description: formData.description?.trim() || undefined,
        status: formData.status || "active",
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
          <p className="text-sm text-gray-600 mt-1">Nhập thông tin cơ bản của vị trí banner</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormField
              label="Mã vị trí"
              type="text"
              value={formData.code}
              placeholder="home_slider"
              required
              disabled={!!location}
              error={validationErrors.code || getApiError("code")}
              onChange={(value) => setFormData({ ...formData, code: value as string })}
            />
            {location && <p className="text-xs text-gray-500 mt-1">Mã vị trí không thể thay đổi sau khi tạo</p>}
          </div>

          <div>
            <FormField
              label="Tên vị trí"
              type="text"
              value={formData.name}
              placeholder="Slider trang chủ"
              required
              error={validationErrors.name || getApiError("name")}
              onChange={(value) => setFormData({ ...formData, name: value as string })}
            />
          </div>
        </div>

        <div>
          <FormField
            label="Mô tả"
            type="textarea"
            value={formData.description}
            placeholder="Mô tả chi tiết về vị trí banner này..."
            rows={3}
            onChange={(value) => setFormData({ ...formData, description: value as string })}
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

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition-all duration-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            {isSubmitting ? "Đang xử lý..." : location ? "Cập nhật vị trí" : "Thêm vị trí mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

