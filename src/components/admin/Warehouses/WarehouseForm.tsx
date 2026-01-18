"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";

interface Warehouse {
  id?: number;
  code?: string;
  name?: string;
  address?: string;
  city?: string;
  district?: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string;
  manager_name?: string;
  priority?: number;
  is_active?: boolean;
}

interface WarehouseFormProps {
  show: boolean;
  warehouse?: Warehouse | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function WarehouseForm({
  show,
  warehouse,
  apiErrors = {},
  onSubmit,
  onCancel,
}: WarehouseFormProps) {
  const formTitle = warehouse ? "Chỉnh sửa kho hàng" : "Thêm kho hàng mới";

  const [formData, setFormData] = useState<Partial<Warehouse>>({
    code: "",
    name: "",
    address: "",
    city: "",
    district: "",
    latitude: null,
    longitude: null,
    phone: "",
    manager_name: "",
    priority: 0,
    is_active: true,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (warehouse) {
      setFormData({
        code: warehouse.code || "",
        name: warehouse.name || "",
        address: warehouse.address || "",
        city: warehouse.city || "",
        district: warehouse.district || "",
        latitude: warehouse.latitude ? parseFloat(String(warehouse.latitude)) : null,
        longitude: warehouse.longitude ? parseFloat(String(warehouse.longitude)) : null,
        phone: warehouse.phone || "",
        manager_name: warehouse.manager_name || "",
        priority: warehouse.priority || 0,
        is_active: warehouse.is_active !== undefined ? warehouse.is_active : true,
      });
    } else {
      setFormData({
        code: "",
        name: "",
        address: "",
        city: "",
        district: "",
        latitude: null,
        longitude: null,
        phone: "",
        manager_name: "",
        priority: 0,
        is_active: true,
      });
    }
    setValidationErrors({});
  }, [warehouse, show]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.code?.trim()) {
      errors.code = "Mã kho là bắt buộc";
    } else if (formData.code.length > 100) {
      errors.code = "Mã kho tối đa 100 ký tự";
    }

    if (!formData.name?.trim()) {
      errors.name = "Tên kho là bắt buộc";
    } else if (formData.name.length > 255) {
      errors.name = "Tên kho tối đa 255 ký tự";
    }

    if (formData.city && formData.city.length > 100) {
      errors.city = "Thành phố tối đa 100 ký tự";
    }

    if (formData.district && formData.district.length > 100) {
      errors.district = "Quận/Huyện tối đa 100 ký tự";
    }

    if (formData.phone && formData.phone.length > 20) {
      errors.phone = "Số điện thoại tối đa 20 ký tự";
    }

    if (formData.manager_name && formData.manager_name.length > 255) {
      errors.manager_name = "Tên người quản lý tối đa 255 ký tự";
    }

    if (formData.priority !== undefined && formData.priority < 0) {
      errors.priority = "Độ ưu tiên phải >= 0";
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
        name: formData.name,
      };

      if (formData.address) submitData.address = formData.address;
      if (formData.city) submitData.city = formData.city;
      if (formData.district) submitData.district = formData.district;
      if (formData.latitude !== null) submitData.latitude = formData.latitude;
      if (formData.longitude !== null) submitData.longitude = formData.longitude;
      if (formData.phone) submitData.phone = formData.phone;
      if (formData.manager_name) submitData.manager_name = formData.manager_name;
      if (formData.priority !== undefined) submitData.priority = formData.priority;
      if (formData.is_active !== undefined) submitData.is_active = formData.is_active;

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
    <Modal show={show} onClose={handleClose} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit} className="space-y-6" onClick={(e) => e.stopPropagation()}>
        {/* Thông tin cơ bản */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
            <p className="text-sm text-gray-600 mt-1">Nhập thông tin chung cho kho hàng</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mã kho */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Mã kho <span className="text-red-500">*</span>
              </label>
              <input
                id="code"
                type="text"
                value={formData.code || ""}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                disabled={!!warehouse}
                placeholder="Ví dụ: WH-HCM-01, WH-HN-01"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.code || apiErrors.code ? "border-red-500" : "border-gray-300"
                } ${warehouse ? "bg-gray-100" : ""}`}
              />
              {validationErrors.code && <p className="mt-1 text-sm text-red-600">{validationErrors.code}</p>}
              {apiErrors.code && !validationErrors.code && (
                <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.code) ? apiErrors.code[0] : apiErrors.code}</p>
              )}
              {warehouse && <p className="mt-1 text-xs text-gray-500">Mã kho không thể thay đổi sau khi tạo</p>}
            </div>

            {/* Tên kho */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Tên kho <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Kho Chính - TP.HCM"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.name || apiErrors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.name && <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>}
              {apiErrors.name && !validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.name) ? apiErrors.name[0] : apiErrors.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Địa chỉ */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Địa chỉ</h3>
            <p className="text-sm text-gray-600 mt-1">Thông tin địa chỉ và liên hệ của kho</p>
          </div>

          {/* Địa chỉ */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <input
              id="address"
              type="text"
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Ví dụ: 123 Nguyễn Văn Linh, Quận 7"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                validationErrors.address || apiErrors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {validationErrors.address && <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>}
            {apiErrors.address && !validationErrors.address && (
              <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.address) ? apiErrors.address[0] : apiErrors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thành phố */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Thành phố
              </label>
              <input
                id="city"
                type="text"
                value={formData.city || ""}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Ví dụ: TP. Hồ Chí Minh"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.city || apiErrors.city ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.city && <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>}
              {apiErrors.city && !validationErrors.city && (
                <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.city) ? apiErrors.city[0] : apiErrors.city}</p>
              )}
            </div>

            {/* Quận/Huyện */}
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                Quận/Huyện
              </label>
              <input
                id="district"
                type="text"
                value={formData.district || ""}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="Ví dụ: Quận 7"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.district || apiErrors.district ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.district && <p className="mt-1 text-sm text-red-600">{validationErrors.district}</p>}
              {apiErrors.district && !validationErrors.district && (
                <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.district) ? apiErrors.district[0] : apiErrors.district}</p>
              )}
            </div>
          </div>

          {/* Tọa độ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vĩ độ */}
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                Vĩ độ
              </label>
              <input
                id="latitude"
                type="number"
                step="0.0000001"
                value={formData.latitude ?? ""}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="Ví dụ: 10.7300000"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.latitude || apiErrors.latitude ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.latitude && <p className="mt-1 text-sm text-red-600">{validationErrors.latitude}</p>}
              {apiErrors.latitude && !validationErrors.latitude && (
                <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.latitude) ? apiErrors.latitude[0] : apiErrors.latitude}</p>
              )}
            </div>

            {/* Kinh độ */}
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                Kinh độ
              </label>
              <input
                id="longitude"
                type="number"
                step="0.0000001"
                value={formData.longitude ?? ""}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="Ví dụ: 106.7200000"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.longitude || apiErrors.longitude ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.longitude && <p className="mt-1 text-sm text-red-600">{validationErrors.longitude}</p>}
              {apiErrors.longitude && !validationErrors.longitude && (
                <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.longitude) ? apiErrors.longitude[0] : apiErrors.longitude}</p>
              )}
            </div>
          </div>

          {/* Số điện thoại */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              id="phone"
              type="text"
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Ví dụ: 02812345678"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                validationErrors.phone || apiErrors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {validationErrors.phone && <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>}
            {apiErrors.phone && !validationErrors.phone && (
              <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.phone) ? apiErrors.phone[0] : apiErrors.phone}</p>
            )}
          </div>
        </div>

        {/* Thông tin quản lý */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin quản lý</h3>
            <p className="text-sm text-gray-600 mt-1">Thiết lập thông tin quản lý và ưu tiên</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên người quản lý */}
            <div>
              <label htmlFor="manager_name" className="block text-sm font-medium text-gray-700 mb-1">
                Tên người quản lý
              </label>
              <input
                id="manager_name"
                type="text"
                value={formData.manager_name || ""}
                onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                placeholder="Ví dụ: Nguyễn Văn A"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.manager_name || apiErrors.manager_name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.manager_name && <p className="mt-1 text-sm text-red-600">{validationErrors.manager_name}</p>}
              {apiErrors.manager_name && !validationErrors.manager_name && (
                <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.manager_name) ? apiErrors.manager_name[0] : apiErrors.manager_name}</p>
              )}
            </div>

            {/* Độ ưu tiên */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Độ ưu tiên
              </label>
              <input
                id="priority"
                type="number"
                min="0"
                value={formData.priority ?? 0}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.priority || apiErrors.priority ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.priority && <p className="mt-1 text-sm text-red-600">{validationErrors.priority}</p>}
              {apiErrors.priority && !validationErrors.priority && (
                <p className="mt-1 text-sm text-red-600">{Array.isArray(apiErrors.priority) ? apiErrors.priority[0] : apiErrors.priority}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Kho có độ ưu tiên cao hơn sẽ được ưu tiên khi phân phối</p>
            </div>
          </div>

          {/* Trạng thái hoạt động */}
          <div className="flex items-center">
            <input
              id="is_active"
              type="checkbox"
              checked={formData.is_active ?? true}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
              Kho đang hoạt động
            </label>
          </div>
        </div>

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
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : warehouse ? "Cập nhật kho hàng" : "Thêm kho hàng mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

