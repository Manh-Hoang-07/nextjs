"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import SingleSelectEnhanced from "@/components/ui/SingleSelectEnhanced";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface Group {
  id?: number;
  type?: string;
  context_id?: number | null;
  code?: string;
  name?: string;
  description?: string;
  metadata?: Record<string, any>;
}

interface GroupFormProps {
  show: boolean;
  group?: Group | null;
  apiErrors?: Record<string, string | string[]>;
  loading?: boolean;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const getTypeLabel = (type?: string): string => {
  if (!type) return type || "";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export default function GroupForm({
  show,
  group,
  apiErrors = {},
  loading = false,
  onSubmit,
  onCancel,
}: GroupFormProps) {
  const formTitle = group ? "Chỉnh sửa group" : "Thêm group mới";

  const [formData, setFormData] = useState<Partial<Group>>({
    type: "",
    context_id: null,
    code: "",
    name: "",
    description: "",
    metadata: {},
  });

  const [metadataJson, setMetadataJson] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contexts, setContexts] = useState<Array<{ id: number; name: string; type: string }>>([]);

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
    if (group) {
      setFormData({
        type: group.type || "",
        context_id: group.context_id || null,
        code: group.code || "",
        name: group.name || "",
        description: group.description || "",
        metadata: group.metadata ? { ...group.metadata } : {},
      });
      setMetadataJson(group.metadata ? JSON.stringify(group.metadata, null, 2) : "");
    } else {
      setFormData({
        type: "",
        context_id: null,
        code: "",
        name: "",
        description: "",
        metadata: {},
      });
      setMetadataJson("");
    }
    setValidationErrors({});
  }, [group, show]);

  const loadContexts = async () => {
    try {
      const response = await api.get(`${adminEndpoints.contexts.list}?limit=1000`);
      let contextsData: any[] = [];
      if (response.data?.success && Array.isArray(response.data.data)) {
        contextsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        contextsData = response.data;
      } else if (Array.isArray(response.data?.data)) {
        contextsData = response.data.data;
      }
      setContexts(contextsData || []);
    } catch (error) {
      setContexts([]);
    }
  };

  const parseMetadataJson = () => {
    try {
      if (metadataJson.trim()) {
        const parsed = JSON.parse(metadataJson);
        setFormData((prev) => ({ ...prev, metadata: parsed }));
      } else {
        setFormData((prev) => ({ ...prev, metadata: {} }));
      }
    } catch (e) {
      // Invalid JSON, keep current metadata
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.type?.trim()) {
      errors.type = "Loại group là bắt buộc";
    }

    if (!group && !formData.context_id) {
      errors.context_id = "Context là bắt buộc";
    }

    if (!formData.code?.trim()) {
      errors.code = "Mã code là bắt buộc";
    } else if (formData.code.length > 100) {
      errors.code = "Mã code không được vượt quá 100 ký tự";
    }

    if (!formData.name?.trim()) {
      errors.name = "Tên group là bắt buộc";
    } else if (formData.name.length > 255) {
      errors.name = "Tên group không được vượt quá 255 ký tự";
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = "Mô tả không được vượt quá 500 ký tự";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Prepare metadata based on type
      let metadata: Record<string, any> = {};
      if (formData.type === "shop") {
        metadata = {
          address: formData.metadata?.address || undefined,
          phone: formData.metadata?.phone || undefined,
          email: formData.metadata?.email || undefined,
        };
        Object.keys(metadata).forEach((key) => metadata[key] === undefined && delete metadata[key]);
      } else if (formData.type === "team") {
        metadata = {
          leader: formData.metadata?.leader || undefined,
          members_count: formData.metadata?.members_count || undefined,
        };
        Object.keys(metadata).forEach((key) => metadata[key] === undefined && delete metadata[key]);
      } else if (formData.metadata && Object.keys(formData.metadata).length > 0) {
        metadata = formData.metadata;
      }

      if (group) {
        // For update, only send allowed fields
        const updateData: any = {};
        if (formData.name) updateData.name = formData.name;
        if (formData.description !== undefined) updateData.description = formData.description;
        if (Object.keys(metadata).length > 0) updateData.metadata = metadata;
        onSubmit?.(updateData);
      } else {
        // For create
        const submitData: any = {
          type: formData.type,
          code: formData.code,
          name: formData.name,
        };

        if (formData.context_id) {
          submitData.context_id = formData.context_id;
        }

        if (formData.description) {
          submitData.description = formData.description;
        }

        if (Object.keys(metadata).length > 0) {
          submitData.metadata = metadata;
        }

        onSubmit?.(submitData);
      }
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
          {/* Thông tin group */}
          <section className="space-y-4">
            <header className="border-b border-gray-200 pb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Thông tin group</h3>
                <p className="text-sm text-gray-500">Nhập loại, mã code, tên và mô tả</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Loại group */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Loại group <span className="text-red-500">*</span>
                </label>
                <input
                  id="type"
                  type="text"
                  value={formData.type || ""}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  disabled={!!group}
                  placeholder="Ví dụ: shop, team, project, department..."
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.type || apiErrors.type ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                  } ${group ? "bg-gray-100" : ""}`}
                />
                {validationErrors.type && <p className="mt-2 text-sm text-red-600">{validationErrors.type}</p>}
                {apiErrors.type && !validationErrors.type && (
                  <p className="mt-2 text-sm text-red-600">{Array.isArray(apiErrors.type) ? apiErrors.type[0] : apiErrors.type}</p>
                )}
                {group && <p className="mt-1 text-xs text-gray-500">Không thể thay đổi loại group sau khi tạo</p>}
              </div>

              {/* Context */}
              {!group && (
                <div>
                  <label htmlFor="context_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Context <span className="text-red-500">*</span>
                  </label>
                  <SingleSelectEnhanced
                    value={formData.context_id}
                    onChange={(value) => setFormData({ ...formData, context_id: value as number | null })}
                    options={contextOptions}
                    placeholder="-- Chọn context --"
                    error={validationErrors.context_id || (apiErrors.context_id ? String(apiErrors.context_id) : undefined)}
                  />
                  {validationErrors.context_id && <p className="mt-2 text-sm text-red-600">{validationErrors.context_id}</p>}
                  {apiErrors.context_id && !validationErrors.context_id && (
                    <p className="mt-2 text-sm text-red-600">{Array.isArray(apiErrors.context_id) ? apiErrors.context_id[0] : apiErrors.context_id}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Chọn context có sẵn. Nếu chưa có, hãy tạo context trước.</p>
                </div>
              )}

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
                  disabled={!!group}
                  placeholder="Ví dụ: shop-001, team-dev, project-abc"
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.code || apiErrors.code ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                  } ${group ? "bg-gray-100" : ""}`}
                />
                {validationErrors.code && <p className="mt-2 text-sm text-red-600">{validationErrors.code}</p>}
                {apiErrors.code && !validationErrors.code && (
                  <p className="mt-2 text-sm text-red-600">{Array.isArray(apiErrors.code) ? apiErrors.code[0] : apiErrors.code}</p>
                )}
                {group && <p className="mt-1 text-xs text-gray-500">Không thể thay đổi mã code sau khi tạo</p>}
              </div>

              {/* Tên group */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên group <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Shop A, Development Team, Project ABC"
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.name || apiErrors.name ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                  }`}
                />
                {validationErrors.name && <p className="mt-2 text-sm text-red-600">{validationErrors.name}</p>}
                {apiErrors.name && !validationErrors.name && (
                  <p className="mt-2 text-sm text-red-600">{Array.isArray(apiErrors.name) ? apiErrors.name[0] : apiErrors.name}</p>
                )}
              </div>

              {/* Mô tả */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập mô tả về group..."
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.description || apiErrors.description ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                  }`}
                />
                {validationErrors.description && <p className="mt-2 text-sm text-red-600">{validationErrors.description}</p>}
                {apiErrors.description && !validationErrors.description && (
                  <p className="mt-2 text-sm text-red-600">{Array.isArray(apiErrors.description) ? apiErrors.description[0] : apiErrors.description}</p>
                )}
              </div>
            </div>
          </section>

          {/* Metadata */}
          {formData.type && (
            <section className="space-y-4">
              <header className="border-b border-gray-200 pb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Thông tin bổ sung</h3>
                  <p className="text-sm text-gray-500">Metadata cho {getTypeLabel(formData.type)}</p>
                </div>
              </header>

              {formData.type === "shop" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="metadata_address" className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    <input
                      id="metadata_address"
                      type="text"
                      value={formData.metadata?.address || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metadata: { ...formData.metadata, address: e.target.value },
                        })
                      }
                      placeholder="Nhập địa chỉ..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="metadata_phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      id="metadata_phone"
                      type="text"
                      value={formData.metadata?.phone || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metadata: { ...formData.metadata, phone: e.target.value },
                        })
                      }
                      placeholder="Nhập số điện thoại..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="metadata_email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      id="metadata_email"
                      type="email"
                      value={formData.metadata?.email || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metadata: { ...formData.metadata, email: e.target.value },
                        })
                      }
                      placeholder="Nhập email..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {formData.type === "team" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="metadata_leader" className="block text-sm font-medium text-gray-700 mb-2">
                      Leader
                    </label>
                    <input
                      id="metadata_leader"
                      type="text"
                      value={formData.metadata?.leader || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metadata: { ...formData.metadata, leader: e.target.value },
                        })
                      }
                      placeholder="Nhập tên leader..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="metadata_members_count" className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng members
                    </label>
                    <input
                      id="metadata_members_count"
                      type="number"
                      min="0"
                      value={formData.metadata?.members_count || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metadata: { ...formData.metadata, members_count: e.target.value ? parseInt(e.target.value) : undefined },
                        })
                      }
                      placeholder="Nhập số lượng..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {formData.type !== "shop" && formData.type !== "team" && (
                <div>
                  <label htmlFor="metadata_json" className="block text-sm font-medium text-gray-700 mb-2">
                    Metadata (JSON)
                  </label>
                  <textarea
                    id="metadata_json"
                    rows={4}
                    value={metadataJson}
                    onChange={(e) => {
                      setMetadataJson(e.target.value);
                      parseMetadataJson();
                    }}
                    onBlur={parseMetadataJson}
                    placeholder='{"key": "value"}'
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Nhập metadata dưới dạng JSON</p>
                </div>
              )}
            </section>
          )}

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
              {isSubmitting ? "Đang xử lý..." : group ? "Cập nhật group" : "Thêm group mới"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

