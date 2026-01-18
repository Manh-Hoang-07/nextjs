"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import SingleSelectEnhanced from "@/components/ui/SingleSelectEnhanced";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Context {
  id?: number;
  type?: string;
  code?: string;
  name?: string;
  status?: string;
}

interface ContextFormProps {
  show: boolean;
  context?: Context | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: Partial<Context>) => void;
  onCancel?: () => void;
}

export default function ContextForm({
  show,
  context,
  statusEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: ContextFormProps) {
  const formTitle = context ? "Chỉnh sửa context" : "Thêm context mới";

  const [formData, setFormData] = useState<Partial<Context>>({
    type: "",
    code: "",
    name: "",
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
    if (context) {
      setFormData({
        type: context.type || "",
        code: context.code || "",
        name: context.name || "",
        status: context.status || "active",
      });
    } else {
      setFormData({
        type: "",
        code: "",
        name: "",
        status: "active",
      });
    }
    setValidationErrors({});
  }, [context, show]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.type?.trim()) {
      errors.type = "Loại context là bắt buộc";
    }

    if (!formData.name?.trim()) {
      errors.name = "Tên context là bắt buộc";
    }

    if (formData.name && formData.name.length > 255) {
      errors.name = "Tên context không được vượt quá 255 ký tự";
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
        type: formData.type?.trim(),
        code: formData.code?.trim() || undefined,
        name: formData.name?.trim(),
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
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-900">Thông tin context</h3>
          <p className="text-sm text-gray-600 mt-1">Nhập thông tin cơ bản cho context</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              label="Loại context"
              type="text"
              value={formData.type}
              placeholder="Ví dụ: system, shop, team, comic..."
              required
              disabled={!!context}
              error={validationErrors.type || getApiError("type")}
              onChange={(value) => setFormData({ ...formData, type: value as string })}
            />
            {context && <p className="text-xs text-gray-500 mt-1">Không thể thay đổi loại context sau khi tạo</p>}
          </div>

          <div>
            <FormField
              label="Mã code"
              type="text"
              value={formData.code}
              placeholder="Nếu không nhập, hệ thống sẽ tự động tạo"
              disabled={!!context}
              error={validationErrors.code || getApiError("code")}
              onChange={(value) => setFormData({ ...formData, code: value as string })}
            />
            {context && <p className="text-xs text-gray-500 mt-1">Không thể thay đổi mã code sau khi tạo</p>}
          </div>

          <div>
            <FormField
              label="Tên context"
              type="text"
              value={formData.name}
              placeholder="Ví dụ: Shop Context, Team Context"
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
            {isSubmitting ? "Đang xử lý..." : context ? "Cập nhật context" : "Thêm context mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

