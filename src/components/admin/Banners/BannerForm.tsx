"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import ImageUploader from "@/components/ui/ImageUploader";
import SingleSelectEnhanced from "@/components/ui/SingleSelectEnhanced";
import { adminEndpoints } from "@/lib/api/endpoints";

interface BannerFormProps {
  show: boolean;
  banner?: any;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  locationEnums?: Array<{ value: number; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function BannerForm({
  show,
  banner,
  statusEnums = [],
  locationEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: BannerFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: null as string | null,
    mobile_image: null as string | null,
    link: "",
    link_target: "_self",
    button_text: "",
    button_color: "#ff6b6b",
    text_color: "#ffffff",
    location_id: null as number | null,
    sort_order: 1,
    status: "active",
    start_date: null as string | null,
    end_date: null as string | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [mobileImageUrl, setMobileImageUrl] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      errors.title = "Tiêu đề là bắt buộc";
    }

    if (!formData.image) {
      errors.image = "Hình ảnh desktop là bắt buộc";
    }

    if (!formData.location_id) {
      errors.location_id = "Vị trí banner là bắt buộc";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || "",
        subtitle: banner.subtitle || "",
        description: banner.description || "",
        image: banner.image && !banner.image.includes("via.placeholder") ? banner.image : null,
        mobile_image: banner.mobile_image && !banner.mobile_image.includes("via.placeholder") ? banner.mobile_image : null,
        link: banner.link || "",
        link_target: banner.link_target || "_self",
        button_text: banner.button_text || "",
        button_color: banner.button_color || "#ff6b6b",
        text_color: banner.text_color || "#ffffff",
        location_id: banner.location_id || null,
        sort_order: banner.sort_order || 1,
        status: banner.status || "active",
        start_date: banner.start_date ? new Date(banner.start_date).toISOString().slice(0, 16) : null,
        end_date: banner.end_date ? new Date(banner.end_date).toISOString().slice(0, 16) : null,
      });
      setImageUrl(banner.image || null);
      setMobileImageUrl(banner.mobile_image || null);
    } else {
      resetForm();
    }
  }, [banner]);

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      image: null,
      mobile_image: null,
      link: "",
      link_target: "_self",
      button_text: "",
      button_color: "#ff6b6b",
      text_color: "#ffffff",
      location_id: null,
      sort_order: 1,
      status: "active",
      start_date: null,
      end_date: null,
    });
    setImageUrl(null);
    setMobileImageUrl(null);
    setValidationErrors({});
  };

  const statusOptions = useMemo(() => {
    const options = [{ value: "", label: "Chọn trạng thái" }];
    statusEnums.forEach((item) => {
      options.push({ value: item.value, label: item.label || (item as any).name || item.value });
    });
    return options;
  }, [statusEnums]);

  const locationOptions = useMemo(() => {
    const options = [{ value: "", label: "Chọn vị trí" }];
    locationEnums.forEach((item) => {
      options.push({ value: String(item.value), label: item.label || (item as any).name || String(item.value) });
    });
    return options;
  }, [locationEnums]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData: any = {
        title: formData.title,
        status: formData.status,
        location_id: formData.location_id,
        sort_order: parseInt(String(formData.sort_order)) || 1,
      };

      if (formData.subtitle) submitData.subtitle = formData.subtitle;
      if (formData.description) submitData.description = formData.description;
      if (formData.image) submitData.image = formData.image;
      if (formData.mobile_image) submitData.mobile_image = formData.mobile_image;
      if (formData.link) submitData.link = formData.link;
      submitData.link_target = formData.link_target;
      if (formData.button_text) submitData.button_text = formData.button_text;
      if (formData.button_color) submitData.button_color = formData.button_color;
      if (formData.text_color) submitData.text_color = formData.text_color;
      if (formData.start_date) submitData.start_date = new Date(formData.start_date).toISOString();
      if (formData.end_date) submitData.end_date = new Date(formData.end_date).toISOString();

      onSubmit?.(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formTitle = banner ? "Chỉnh sửa banner" : "Thêm banner mới";

  if (!show) return null;

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={isSubmitting}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Thông tin cơ bản
            </h3>
            <p className="text-sm text-gray-600 mt-1">Nhập thông tin cơ bản của banner</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nhập tiêu đề banner"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.title || apiErrors.title ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                  }`}
              />
              {validationErrors.title && <p className="mt-2 text-sm text-red-600">{validationErrors.title}</p>}
              {apiErrors.title && <p className="mt-2 text-sm text-red-600">{Array.isArray(apiErrors.title) ? apiErrors.title[0] : apiErrors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">Phụ đề</label>
              <input
                id="subtitle"
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Nhập phụ đề banner"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.subtitle || apiErrors.subtitle ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                  }`}
              />
              {validationErrors.subtitle && <p className="mt-2 text-sm text-red-600">{validationErrors.subtitle}</p>}
              {apiErrors.subtitle && <p className="mt-2 text-sm text-red-600">{Array.isArray(apiErrors.subtitle) ? apiErrors.subtitle[0] : apiErrors.subtitle}</p>}
            </div>

            <div>
              <SingleSelectEnhanced
                value={formData.location_id}
                onChange={(value) => setFormData({ ...formData, location_id: value ? Number(value) : null })}
                searchApi={adminEndpoints.bannerLocations.list}
                label="Vị trí banner"
                labelField="name"
                valueField="id"
                placeholder="-- Chọn vị trí banner --"
                error={validationErrors.location_id || (apiErrors.location_id ? String(apiErrors.location_id) : undefined)}
                required
              />
            </div>

            <div>
              <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700 mb-2">Thứ tự hiển thị</label>
              <input
                id="sort_order"
                type="number"
                min="0"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
                placeholder="1"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.sort_order || apiErrors.sort_order ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                  }`}
              />
              <p className="text-xs text-gray-500 mt-1">Số càng nhỏ càng được hiển thị trước</p>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả chi tiết về banner..."
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.description || apiErrors.description ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                }`}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Hình ảnh & liên kết</h3>
            <p className="text-sm text-gray-600 mt-1">Upload hình ảnh và thiết lập liên kết</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh desktop <span className="text-red-500">*</span>
              </label>
              <ImageUploader
                value={formData.image}
                defaultUrl={imageUrl || undefined}
                onChange={(url) => {
                  setFormData({ ...formData, image: url as string });
                  if (url) setImageUrl(url as string);
                }}
                onRemove={() => {
                  setFormData({ ...formData, image: null });
                  setImageUrl(null);
                }}
              />
              {validationErrors.image && <p className="mt-2 text-sm text-red-600">{validationErrors.image}</p>}
              {apiErrors.image && <p className="mt-2 text-sm text-red-600">{Array.isArray(apiErrors.image) ? apiErrors.image[0] : apiErrors.image}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh mobile</label>
              <ImageUploader
                value={formData.mobile_image}
                defaultUrl={mobileImageUrl || undefined}
                onChange={(url) => {
                  setFormData({ ...formData, mobile_image: url as string });
                  if (url) setMobileImageUrl(url as string);
                }}
                onRemove={() => {
                  setFormData({ ...formData, mobile_image: null });
                  setMobileImageUrl(null);
                }}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">Link</label>
              <input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="link_target" className="block text-sm font-medium text-gray-700 mb-2">Target</label>
              <select
                id="link_target"
                value={formData.link_target}
                onChange={(e) => setFormData({ ...formData, link_target: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="_self">Same window</option>
                <option value="_blank">New window</option>
              </select>
            </div>

            <div>
              <label htmlFor="button_text" className="block text-sm font-medium text-gray-700 mb-2">Button text</label>
              <input
                id="button_text"
                type="text"
                value={formData.button_text}
                onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                placeholder="Click here"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="button_color" className="block text-sm font-medium text-gray-700 mb-2">Button color</label>
              <input
                id="button_color"
                type="color"
                value={formData.button_color}
                onChange={(e) => setFormData({ ...formData, button_color: e.target.value })}
                className="w-full h-12 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="text_color" className="block text-sm font-medium text-gray-700 mb-2">Text color</label>
              <input
                id="text_color"
                type="color"
                value={formData.text_color}
                onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                className="w-full h-12 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Lịch trình & trạng thái</h3>
            <p className="text-sm text-gray-600 mt-1">Thiết lập thời gian hiển thị và trạng thái</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
              <input
                id="start_date"
                type="datetime-local"
                value={formData.start_date || ""}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value || null })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
              <input
                id="end_date"
                type="datetime-local"
                value={formData.end_date || ""}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value || null })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <SingleSelectEnhanced
                value={formData.status}
                onChange={(value) => setFormData({ ...formData, status: (value as string) || "active" })}
                options={statusOptions}
                label="Trạng thái"
                labelField="label"
                valueField="value"
                placeholder="-- Chọn trạng thái --"
                error={validationErrors.status || (apiErrors.status ? String(apiErrors.status) : undefined)}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-lg shadow transition-all duration-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            {isSubmitting ? "Đang xử lý..." : banner ? "Cập nhật banner" : "Thêm banner mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

