"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import SearchableSelect from "@/components/ui/SearchableSelect";
import SingleSelectEnhanced from "@/components/ui/SingleSelectEnhanced";
import MultipleSelect from "@/components/ui/MultipleSelect";
import { adminEndpoints } from "@/lib/api/endpoints";
import api from "@/lib/api/client";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Role {
  id?: number;
  code?: string;
  name?: string;
  parent_id?: number | null;
  status?: string;
  context_ids?: number[];
  contexts?: Array<{ id: number; name: string; type: string }>;
}

interface RoleFormProps {
  show: boolean;
  role?: Role | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  loading?: boolean;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function RoleForm({
  show,
  role,
  statusEnums = [],
  apiErrors = {},
  loading = false,
  onSubmit,
  onCancel,
}: RoleFormProps) {
  const formTitle = role ? "Chỉnh sửa vai trò" : "Thêm vai trò mới";

  const [formData, setFormData] = useState<Partial<Role>>({
    code: "",
    name: "",
    parent_id: null,
    status: "active",
    context_ids: [],
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contexts, setContexts] = useState<Array<{ id: number; name: string; type: string }>>([]);

  const statusOptions = useMemo(() => {
    const statusArray = statusEnums && statusEnums.length > 0 ? statusEnums : getBasicStatusArray();
    return statusArray.map((opt) => ({
      value: opt.value,
      label: opt.label || (opt as any).name || opt.value,
    }));
  }, [statusEnums]);

  const contextOptions = useMemo(() => {
    return contexts.map((ctx) => ({
      value: ctx.id,
      label: `${ctx.name} (${ctx.type})`,
    }));
  }, [contexts]);

  useEffect(() => {
    if (show) {
      loadContexts();
    }
  }, [show]);

  useEffect(() => {
    if (role) {
      setFormData({
        code: role.code || "",
        name: role.name || "",
        parent_id: role.parent_id || null,
        status: role.status || "active",
        context_ids:
          role.context_ids && Array.isArray(role.context_ids)
            ? role.context_ids
            : role.contexts && Array.isArray(role.contexts)
              ? role.contexts.map((ctx) => ctx.id)
              : [],
      });
    } else {
      setFormData({
        code: "",
        name: "",
        parent_id: null,
        status: "active",
        context_ids: [],
      });
    }
    setValidationErrors({});
  }, [role, show]);

  const loadContexts = async () => {
    try {
      const response = await api.get(adminEndpoints.contexts.list);
      let contextsData: any[] = [];
      if (Array.isArray(response.data)) {
        contextsData = response.data;
      } else if (response.data?.success && Array.isArray(response.data.data)) {
        contextsData = response.data.data;
      } else if (Array.isArray(response.data?.data)) {
        contextsData = response.data.data;
      }
      setContexts(contextsData || []);
    } catch (error) {
      setContexts([]);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.code?.trim()) {
      errors.code = "Mã code là bắt buộc";
    } else if (formData.code.length > 100) {
      errors.code = "Mã code không được vượt quá 100 ký tự";
    }

    if (formData.name && formData.name.length > 150) {
      errors.name = "Tên vai trò không được vượt quá 150 ký tự";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData: any = {
        code: formData.code,
        status: formData.status || "active",
      };

      if (formData.name) {
        submitData.name = formData.name;
      }

      if (formData.parent_id) {
        submitData.parent_id = formData.parent_id;
      }

      if (formData.context_ids && formData.context_ids.length > 0) {
        submitData.context_ids = formData.context_ids;
      }

      onSubmit?.(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onCancel?.();
  };

  if (!show) return null;

  return (
    <Modal show={show} onClose={handleClose} title={formTitle} size="xl" loading={isSubmitting || loading}>
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8" onClick={(e) => e.stopPropagation()}>
          {/* Thông tin vai trò */}
          <section className="space-y-4">
            <header className="border-b border-gray-200 pb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Thông tin vai trò</h3>
                <p className="text-sm text-gray-500">Nhập mã code, tên và trạng thái</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mã code */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Mã code <span className="text-red-500">*</span>
                </label>
                <input
                  id="code"
                  type="text"
                  value={formData.code || ""}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  disabled={!!role}
                  placeholder="Ví dụ: admin, manager, editor"
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.code || apiErrors.code
                      ? "border-red-500 ring-2 ring-red-200"
                      : "border-gray-300"
                    } ${role ? "bg-gray-100" : ""}`}
                />
                {validationErrors.code && <p className="mt-2 text-sm text-red-600">{validationErrors.code}</p>}
                {apiErrors.code && !validationErrors.code && (
                  <p className="mt-2 text-sm text-red-600">
                    {Array.isArray(apiErrors.code) ? apiErrors.code[0] : apiErrors.code}
                  </p>
                )}
                {role && <p className="mt-1 text-xs text-gray-500">Không thể thay đổi mã code sau khi tạo</p>}
              </div>

              {/* Tên vai trò */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên vai trò
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Admin, Manager, Editor"
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.name || apiErrors.name ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                    }`}
                />
                {validationErrors.name && <p className="mt-2 text-sm text-red-600">{validationErrors.name}</p>}
                {apiErrors.name && !validationErrors.name && (
                  <p className="mt-2 text-sm text-red-600">
                    {Array.isArray(apiErrors.name) ? apiErrors.name[0] : apiErrors.name}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Liên kết & trạng thái */}
          <section className="space-y-4">
            <header className="border-b border-gray-200 pb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4.553-4.553a1 1 0 00-1.414-1.414L13 8.172M5 13l-4.553 4.553a1 1 0 001.414 1.414L7 15.828"
                  ></path>
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Liên kết & trạng thái</h3>
                <p className="text-sm text-gray-500">Chọn vai trò cha và trạng thái</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vai trò cha */}
              <div>
                <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò cha
                </label>
                <SearchableSelect
                  value={formData.parent_id}
                  onChange={(value) => setFormData({ ...formData, parent_id: value as number | null })}
                  searchApi={adminEndpoints.roles.list}
                  placeholder="Tìm kiếm vai trò cha..."
                  error={
                    validationErrors.parent_id ||
                    (apiErrors.parent_id ? String(apiErrors.parent_id) : undefined)
                  }
                  excludeId={role?.id}
                  labelField="name"
                />
                {validationErrors.parent_id && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.parent_id}</p>
                )}
                {apiErrors.parent_id && !validationErrors.parent_id && (
                  <p className="mt-2 text-sm text-red-600">
                    {Array.isArray(apiErrors.parent_id) ? apiErrors.parent_id[0] : apiErrors.parent_id}
                  </p>
                )}
              </div>

              {/* Trạng thái */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <SingleSelectEnhanced
                  value={formData.status || "active"}
                  onChange={(value) => setFormData({ ...formData, status: value as string })}
                  options={statusOptions}
                  placeholder="-- Chọn trạng thái --"
                  error={
                    validationErrors.status || (apiErrors.status ? String(apiErrors.status) : undefined)
                  }
                  required
                />
                {validationErrors.status && <p className="mt-2 text-sm text-red-600">{validationErrors.status}</p>}
                {apiErrors.status && !validationErrors.status && (
                  <p className="mt-2 text-sm text-red-600">
                    {Array.isArray(apiErrors.status) ? apiErrors.status[0] : apiErrors.status}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Contexts */}
          <section className="space-y-4">
            <header className="border-b border-gray-200 pb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Contexts</h3>
                <p className="text-sm text-gray-500">
                  Chọn contexts mà role này sẽ được gán (để trống nếu chỉ dành cho system admin)
                </p>
              </div>
            </header>

            <div>
              <label htmlFor="context_ids" className="block text-sm font-medium text-gray-700 mb-2">
                Contexts
              </label>
              <MultipleSelect
                value={formData.context_ids || []}
                onChange={(value) => setFormData({ ...formData, context_ids: value as number[] })}
                options={contextOptions}
                placeholder="Chọn contexts..."
                error={validationErrors.context_ids || (apiErrors.context_ids ? String(apiErrors.context_ids) : undefined)}
              />
              {validationErrors.context_ids && (
                <p className="mt-2 text-sm text-red-600">{validationErrors.context_ids}</p>
              )}
              {apiErrors.context_ids && !validationErrors.context_ids && (
                <p className="mt-2 text-sm text-red-600">
                  {Array.isArray(apiErrors.context_ids) ? apiErrors.context_ids[0] : apiErrors.context_ids}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Nếu không chọn contexts, role này chỉ hiển thị cho system admin
              </p>
            </div>
          </section>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : role ? "Cập nhật vai trò" : "Thêm vai trò mới"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

