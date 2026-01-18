"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import SingleSelectEnhanced from "@/components/ui/SingleSelectEnhanced";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { adminEndpoints } from "@/lib/api/endpoints";

interface Menu {
  id?: number;
  code?: string;
  name?: string;
  path?: string | null;
  api_path?: string | null;
  icon?: string | null;
  type?: string;
  status?: string;
  parent_id?: number | string | null;
  sort_order?: number;
  is_public?: boolean;
  show_in_menu?: boolean;
  required_permission_id?: number | string | null;
}

interface MenuFormProps {
  show: boolean;
  menu?: Menu | null;
  statusEnums?: Array<{ value: string; label?: string }>;
  parentMenus?: Array<any>;
  permissions?: Array<{ id: number; name: string; code: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: Menu) => void;
  onCancel?: () => void;
}

export default function MenuForm({
  show,
  menu,
  statusEnums = [],
  parentMenus = [],
  permissions = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: MenuFormProps) {
  const [formData, setFormData] = useState<Menu>({
    code: "",
    name: "",
    path: null,
    api_path: null,
    icon: null,
    type: "route",
    status: "active",
    parent_id: null,
    sort_order: 0,
    is_public: false,
    show_in_menu: true,
    required_permission_id: null,
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = !!menu;
  const formTitle = isEdit ? "Chỉnh sửa menu" : "Thêm menu mới";

  const flattenMenus = useCallback((menusArray: any[], level = 0): any[] => {
    const result: any[] = [];
    if (!Array.isArray(menusArray) || menusArray.length === 0) return result;
    menusArray.forEach((m) => {
      if (!m?.id) return;
      const prefix = "  ".repeat(level);
      result.push({
        ...m,
        displayName: `${prefix}${m.name || ""}`,
      });
      if (m.children && Array.isArray(m.children) && m.children.length > 0) {
        result.push(...flattenMenus(m.children, level + 1));
      }
    });
    return result;
  }, []);

  const getMenuPath = useCallback((m: any): string => {
    return m.displayName || m.name || "";
  }, []);

  const filteredParentMenus = useMemo(() => {
    const menus = Array.isArray(parentMenus) ? parentMenus : [];
    if (menus.length === 0) return [];

    if (!isEdit || !menu?.id) {
      return flattenMenus(menus);
    }

    const excludeIds = [menu.id];
    const getChildrenIds = (m: any) => {
      if (m?.children && Array.isArray(m.children) && m.children.length > 0) {
        m.children.forEach((child: any) => {
          if (child?.id) {
            excludeIds.push(child.id);
            getChildrenIds(child);
          }
        });
      }
    };

    const findAndExclude = (menusArr: any[]) => {
      if (!Array.isArray(menusArr) || menusArr.length === 0) return;
      menusArr.forEach((m) => {
        if (m?.id === menu.id) {
          getChildrenIds(m);
        } else if (m?.children && Array.isArray(m.children)) {
          findAndExclude(m.children);
        }
      });
    };

    findAndExclude(menus);
    const flattened = flattenMenus(menus);
    return flattened.filter((m) => m?.id && !excludeIds.includes(m.id));
  }, [parentMenus, menu, isEdit, flattenMenus]);

  const statusOptions = useMemo(
    () =>
      Array.isArray(statusEnums)
        ? statusEnums.map((s) => ({ value: s.value, label: s.label || s.value }))
        : [],
    [statusEnums]
  );

  const parentMenuOptions = useMemo(
    () =>
      filteredParentMenus.map((m) => ({
        value: m.id,
        label: getMenuPath(m),
      })),
    [filteredParentMenus, getMenuPath]
  );

  const permissionOptions = useMemo(
    () =>
      permissions.map((p) => ({
        value: p.id,
        label: `${p.name} (${p.code})`,
      })),
    [permissions]
  );

  useEffect(() => {
    if (menu) {
      setFormData({
        code: menu.code || "",
        name: menu.name || "",
        path: menu.path || null,
        api_path: menu.api_path || null,
        icon: menu.icon || null,
        type: menu.type || "route",
        status: menu.status || "active",
        parent_id: menu.parent_id || null,
        sort_order: menu.sort_order || 0,
        is_public: menu.is_public || false,
        show_in_menu: menu.show_in_menu !== false,
        required_permission_id: menu.required_permission_id || null,
      });
    } else {
      setFormData({
        code: "",
        name: "",
        path: null,
        api_path: null,
        icon: null,
        type: "route",
        status: "active",
        parent_id: null,
        sort_order: 0,
        is_public: false,
        show_in_menu: true,
        required_permission_id: null,
      });
    }
    setValidationErrors({});
  }, [menu, show]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.code || formData.code.trim().length < 3) {
      errors.code = "Code phải có ít nhất 3 ký tự";
    } else if (formData.code.length > 120) {
      errors.code = "Code không được vượt quá 120 ký tự";
    }

    if (!formData.name || formData.name.trim().length === 0) {
      errors.name = "Tên menu là bắt buộc";
    } else if (formData.name.length > 150) {
      errors.name = "Tên menu không được vượt quá 150 ký tự";
    }

    if (formData.path && formData.path.length > 255) {
      errors.path = "Path không được vượt quá 255 ký tự";
    }

    if (formData.api_path && formData.api_path.length > 255) {
      errors.api_path = "API Path không được vượt quá 255 ký tự";
    }

    if (formData.icon && formData.icon.length > 120) {
      errors.icon = "Icon không được vượt quá 120 ký tự";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        path: formData.path || null,
        api_path: formData.api_path || null,
        icon: formData.icon || null,
        parent_id: formData.parent_id || null,
        required_permission_id: formData.required_permission_id || null,
      };

      onSubmit?.(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Thông tin cơ bản
            </h3>
            <p className="text-sm text-gray-600 mt-1">Nhập thông tin cơ bản của menu</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                value={formData.code}
                onChange={(val) => setFormData({ ...formData, code: val as string })}
                label="Code"
                name="code"
                required
                disabled={isEdit}
                error={(validationErrors.code || (apiErrors.code as string)) || undefined}
                helpText={isEdit ? "Không thể thay đổi mã code sau khi tạo" : "Mã menu phải unique, 3-120 ký tự"}
              />
            </div>

            <div>
              <FormField
                value={formData.name}
                onChange={(val) => setFormData({ ...formData, name: val as string })}
                label="Tên menu"
                name="name"
                required
                error={(validationErrors.name || (apiErrors.name as string)) || undefined}
              />
            </div>

            <div>
              <FormField
                value={formData.path || ""}
                onChange={(val) => setFormData({ ...formData, path: val as string || null })}
                label="Path"
                name="path"
                placeholder="/admin/dashboard"
                error={(validationErrors.path || (apiErrors.path as string)) || undefined}
                helpText="Đường dẫn route (ví dụ: /admin/dashboard)"
              />
            </div>

            <div>
              <FormField
                value={formData.api_path || ""}
                onChange={(val) => setFormData({ ...formData, api_path: val as string || null })}
                label="API Path"
                name="api_path"
                placeholder="/api/admin/dashboard"
                error={(validationErrors.api_path || (apiErrors.api_path as string)) || undefined}
                helpText="Đường dẫn API (ví dụ: /api/admin/dashboard)"
              />
            </div>

            <div>
              <FormField
                value={formData.icon || ""}
                onChange={(val) => setFormData({ ...formData, icon: val as string || null })}
                label="Icon"
                name="icon"
                placeholder="mdi-view-dashboard hoặc emoji"
                helpText="Icon class/name hoặc emoji (ví dụ: mdi-view-dashboard, 📊)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại menu</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="route">Route</option>
                <option value="group">Group</option>
                <option value="link">Link</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Route: menu route nội bộ, Group: menu group, Link: menu link ngoài</p>
            </div>

            <div>
              <SingleSelectEnhanced
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val as string })}
                label="Trạng thái"
                options={statusOptions}
                placeholder="-- Chọn trạng thái --"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Menu cha</label>
              <select
                value={formData.parent_id || ""}
                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Root (Không có menu cha)</option>
                {parentMenuOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FormField
                value={formData.sort_order}
                onChange={(val) => setFormData({ ...formData, sort_order: Number(val) || 0 })}
                label="Thứ tự sắp xếp"
                name="sort_order"
                type="number"
                min="0"
                helpText="Số càng nhỏ, hiển thị càng trước"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permission bắt buộc</label>
              <SearchableSelect
                value={formData.required_permission_id}
                searchApi={adminEndpoints.permissions.list}
                placeholder="Không có (Menu mặc định)"
                labelField="name"
                onChange={(val) => setFormData({ ...formData, required_permission_id: val as number | null })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={formData.is_public || false}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_public" className="ml-2 text-sm font-medium text-gray-700">
                  Menu công khai
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500 ml-6">Menu có thể truy cập mà không cần permission</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show_in_menu"
                  checked={formData.show_in_menu !== false}
                  onChange={(e) => setFormData({ ...formData, show_in_menu: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="show_in_menu" className="ml-2 text-sm font-medium text-gray-700">
                  Hiển thị trong menu
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500 ml-6">Hiển thị menu trong sidebar</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

