"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import SingleSelectEnhanced from "@/components/ui/SingleSelectEnhanced";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Permission {
  id?: number;
  code?: string;
  name?: string;
  scope?: string;
  parent_id?: number | null;
  status?: string;
}

interface PermissionFormProps {
  show: boolean;
  permission?: Permission | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: Partial<Permission>) => void;
  onCancel?: () => void;
}

export default function PermissionForm({
  show,
  permission,
  statusEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: PermissionFormProps) {
  const formTitle = permission ? "Chỉnh sửa quyền" : "Thêm quyền mới";

  const [formData, setFormData] = useState<Partial<Permission>>({
    code: "",
    name: "",
    scope: "context",
    parent_id: null,
    status: "active",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = useMemo(() => {
    const statusArray = statusEnums && statusEnums.length > 0 ? statusEnums : getBasicStatusArray();
    return [{ value: "", label: "-- Chọn trạng thái --" }, ...statusArray.map((opt) => ({
      value: opt.value,
      label: opt.label || (opt as any).name || opt.value,
    }))];
  }, [statusEnums]);

  const scopeOptions = [
    { value: "context", label: "Context (Dùng trong shop, group, ...)" },
    { value: "system", label: "System (Chỉ dùng trong system context)" },
  ];

  useEffect(() => {
    if (permission) {
      setFormData({
        code: permission.code || "",
        name: permission.name || "",
        scope: permission.scope || "context",
        parent_id: permission.parent_id || null,
        status: permission.status || "active",
      });
    } else {
      setFormData({
        code: "",
        name: "",
        scope: "context",
        parent_id: null,
        status: "active",
      });
    }
    setValidationErrors({});
  }, [permission, show]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.code?.trim()) {
      errors.code = "Mã code là bắt buộc";
    } else if (formData.code.length > 120) {
      errors.code = "Mã code không được vượt quá 120 ký tự";
    }

    if (formData.name && formData.name.length > 150) {
      errors.name = "Tên quyền không được vượt quá 150 ký tự";
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
        name: formData.name?.trim() || undefined,
        scope: formData.scope || "context",
        parent_id: formData.parent_id || null,
        status: formData.status || "active",
      };
      onSubmit?.(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getApiError = (field: string): string | undefined => {
    if (!apiErrors) return undefined;
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
          <h3 className="text-lg font-semibold text-gray-900">Thông tin quyền</h3>
          <p className="text-sm text-gray-600 mt-1">Nhập thông tin cơ bản cho quyền</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              label="Mã code"
              type="text"
              value={formData.code}
              placeholder="Ví dụ: post.manage, user.create"
              required
              disabled={!!permission}
              error={validationErrors.code || getApiError("code")}
              onChange={(value) => setFormData({ ...formData, code: value as string })}
            />
            {permission && <p className="text-xs text-gray-500 mt-1">Không thể thay đổi mã code sau khi tạo</p>}
          </div>

          <div>
            <FormField
              label="Tên quyền"
              type="text"
              value={formData.name}
              placeholder="Ví dụ: Quản lý bài viết"
              error={validationErrors.name || getApiError("name")}
              onChange={(value) => setFormData({ ...formData, name: value as string })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phạm vi (Scope)</label>
            <select
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {scopeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Chọn phạm vi áp dụng của quyền này</p>
          </div>

          <div>
            <FormField
              label="Trạng thái"
              type="select"
              value={formData.status}
              options={statusOptions}
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
            {isSubmitting ? "Đang xử lý..." : permission ? "Cập nhật quyền" : "Thêm quyền mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

