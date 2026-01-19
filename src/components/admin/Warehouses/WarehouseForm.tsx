"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/ui/feedback/Modal";
import FormField from "@/components/ui/forms/FormField";

// 1. Define Warehouse Schema
const warehouseSchema = z.object({
  code: z.string().min(1, "Mã kho là bắt buộc").max(100, "Mã kho tối đa 100 ký tự"),
  name: z.string().min(1, "Tên kho là bắt buộc").max(255, "Tên kho tối đa 255 ký tự"),
  address: z.string().max(500, "Địa chỉ tối đa 500 ký tự").optional().nullable(),
  city: z.string().max(100, "Thành phố tối đa 100 ký tự").optional().nullable(),
  district: z.string().max(100, "Quận/Huyện tối đa 100 ký tự").optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  phone: z.string().max(20, "Số điện thoại tối đa 20 ký tự").optional().nullable(),
  manager_name: z.string().max(255, "Tên quản lý tối đa 255 ký tự").optional().nullable(),
  priority: z.coerce.number().int().min(0, "Độ ưu tiên không được âm").default(0),
  is_active: z.boolean().default(true),
});

type WarehouseFormValues = z.infer<typeof warehouseSchema>;

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
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
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
    },
  });

  // Reset/Initialize
  useEffect(() => {
    if (show) {
      if (warehouse) {
        reset({
          code: warehouse.code || "",
          name: warehouse.name || "",
          address: warehouse.address || "",
          city: warehouse.city || "",
          district: warehouse.district || "",
          latitude: warehouse.latitude,
          longitude: warehouse.longitude,
          phone: warehouse.phone || "",
          manager_name: warehouse.manager_name || "",
          priority: warehouse.priority || 0,
          is_active: warehouse.is_active !== undefined ? warehouse.is_active : true,
        });
      } else {
        reset({
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
    }
  }, [warehouse, show, reset]);

  // Map API Errors
  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = warehouse ? "Chỉnh sửa kho hàng" : "Thêm kho hàng mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8 p-1">

        {/* SECTION: THÔNG TIN CƠ BẢN */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thông tin cơ bản</h3>
              <p className="text-xs text-gray-500">Mã định danh và tên gọi của kho</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Mã kho"
              {...register("code")}
              placeholder="Ví dụ: WH-HCM-01"
              error={errors.code?.message}
              required
              disabled={!!warehouse}
              helpText={warehouse ? "Mã kho không thể thay đổi" : undefined}
            />
            <FormField
              label="Tên kho"
              {...register("name")}
              placeholder="Ví dụ: Kho Tổng Miền Nam"
              error={errors.name?.message}
              required
            />
          </div>
        </section>

        {/* SECTION: ĐỊA CHỈ & LIÊN HỆ */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Địa chỉ & Liên hệ</h3>
              <p className="text-xs text-gray-500">Thông tin vị trí vật lý và phương thức kết nối</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                label="Địa chỉ chi tiết"
                {...register("address")}
                placeholder="Số nhà, tên đường, phường/xã..."
                error={errors.address?.message}
              />
            </div>
            <FormField
              label="Thành phố / Tỉnh"
              {...register("city")}
              placeholder="Ví dụ: TP. Hồ Chí Minh"
              error={errors.city?.message}
            />
            <FormField
              label="Quận / Huyện"
              {...register("district")}
              placeholder="Ví dụ: Quận 7"
              error={errors.district?.message}
            />
            <FormField
              label="Vĩ độ (Latitude)"
              type="number"
              step="0.0000001"
              {...register("latitude")}
              placeholder="10.7300000"
              error={errors.latitude?.message}
            />
            <FormField
              label="Kinh độ (Longitude)"
              type="number"
              step="0.0000001"
              {...register("longitude")}
              placeholder="106.7200000"
              error={errors.longitude?.message}
            />
            <FormField
              label="Số điện thoại"
              {...register("phone")}
              placeholder="028 xxxx xxxx"
              error={errors.phone?.message}
            />
            <FormField
              label="Người quản lý"
              {...register("manager_name")}
              placeholder="Nguyễn Văn A"
              error={errors.manager_name?.message}
            />
          </div>
        </section>

        {/* SECTION: CẤU HÌNH VẬN HÀNH */}
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <header className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Cấu hình vận hành</h3>
              <p className="text-xs text-gray-500">Thiết lập trạng thái và độ ưu tiên điều phối</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <FormField
              label="Độ ưu tiên điều phối"
              type="number"
              {...register("priority")}
              helpText="Giá trị càng lớn, kho càng được ưu tiên"
              error={errors.priority?.message}
            />
            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200">
              <input
                type="checkbox"
                id="is_active"
                {...register("is_active")}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-sm font-bold text-gray-700 cursor-pointer">
                Kho đang hoạt động
              </label>
            </div>
          </div>
        </section>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Đang xử lý..." : warehouse ? "Cập nhật kho hàng" : "Thêm kho hàng"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

