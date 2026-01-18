"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface Staff {
  id?: number;
  name?: string;
  position?: string;
  department?: string;
  bio?: string;
  avatar?: string | null;
  email?: string;
  phone?: string;
  social_links?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
  experience?: number;
  expertise?: string;
  status?: string;
  sort_order?: number;
}

interface StaffFormProps {
  show: boolean;
  staff?: Staff | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: Partial<Staff>) => void;
  onCancel?: () => void;
}

export default function StaffForm({
  show,
  staff,
  apiErrors = {},
  onSubmit,
  onCancel,
}: StaffFormProps) {
  const formTitle = staff ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới";

  const [formData, setFormData] = useState<Partial<Staff>>({
    name: "",
    position: "",
    department: "",
    bio: "",
    avatar: null,
    email: "",
    phone: "",
    social_links: {
      facebook: "",
      linkedin: "",
      twitter: "",
    },
    experience: 0,
    expertise: "",
    status: "active",
    sort_order: 0,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = useMemo(() => getBasicStatusArray(), []);
  const avatarUrl = useMemo(() => staff?.avatar || null, [staff]);

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || "",
        position: staff.position || "",
        department: staff.department || "",
        bio: staff.bio || "",
        avatar: staff.avatar || null,
        email: staff.email || "",
        phone: staff.phone || "",
        social_links: {
          facebook: staff.social_links?.facebook || "",
          linkedin: staff.social_links?.linkedin || "",
          twitter: staff.social_links?.twitter || "",
        },
        experience: staff.experience || 0,
        expertise: staff.expertise || "",
        status: staff.status || "active",
        sort_order: staff.sort_order || 0,
      });
    } else {
      setFormData({
        name: "",
        position: "",
        department: "",
        bio: "",
        avatar: null,
        email: "",
        phone: "",
        social_links: {
          facebook: "",
          linkedin: "",
          twitter: "",
        },
        experience: 0,
        expertise: "",
        status: "active",
        sort_order: 0,
      });
    }
    setValidationErrors({});
  }, [staff, show]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = "Họ tên là bắt buộc";
    }

    if (!formData.position?.trim()) {
      errors.position = "Chức vụ là bắt buộc";
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
        position: formData.position?.trim(),
        department: formData.department?.trim() || undefined,
        bio: formData.bio?.trim() || undefined,
        avatar: formData.avatar || null,
        email: formData.email?.trim() || undefined,
        phone: formData.phone?.trim() || undefined,
        social_links: {
          facebook: formData.social_links?.facebook?.trim() || undefined,
          linkedin: formData.social_links?.linkedin?.trim() || undefined,
          twitter: formData.social_links?.twitter?.trim() || undefined,
        },
        experience: Number.isFinite(formData.experience) ? Number(formData.experience) : 0,
        expertise: formData.expertise?.trim() || undefined,
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
            <h3 className="text-lg font-semibold text-gray-900">Thông tin nhân viên</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                label="Họ tên"
                type="text"
                value={formData.name}
                placeholder="Nguyễn Văn A"
                required
                error={validationErrors.name || getApiError("name")}
                onChange={(value) => setFormData({ ...formData, name: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Chức vụ"
                type="text"
                value={formData.position}
                placeholder="Giám đốc"
                required
                error={validationErrors.position || getApiError("position")}
                onChange={(value) => setFormData({ ...formData, position: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Phòng ban"
                type="text"
                value={formData.department}
                placeholder="Kỹ thuật"
                onChange={(value) => setFormData({ ...formData, department: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Email"
                type="email"
                value={formData.email}
                placeholder="name@example.com"
                onChange={(value) => setFormData({ ...formData, email: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Số điện thoại"
                type="text"
                value={formData.phone}
                placeholder="0123456789"
                onChange={(value) => setFormData({ ...formData, phone: value as string })}
              />
            </div>

            <div>
              <FormField
                label="Kinh nghiệm (năm)"
                type="number"
                value={formData.experience}
                placeholder="0"
                min={0}
                onChange={(value) => setFormData({ ...formData, experience: Number(value) || 0 })}
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
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
            <ImageUploader
              value={formData.avatar}
              defaultUrl={avatarUrl || undefined}
              onChange={(value) => setFormData({ ...formData, avatar: value as string | null })}
              onRemove={() => setFormData({ ...formData, avatar: null })}
            />
          </div>

          <div>
            <FormField
              label="Tiểu sử"
              type="textarea"
              value={formData.bio}
              placeholder="Tiểu sử ngắn"
              rows={3}
              onChange={(value) => setFormData({ ...formData, bio: value as string })}
            />
          </div>

          <div>
            <FormField
              label="Chuyên môn"
              type="textarea"
              value={formData.expertise}
              placeholder="Chuyên môn chính"
              rows={3}
              onChange={(value) => setFormData({ ...formData, expertise: value as string })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FormField
                label="Facebook"
                type="url"
                value={formData.social_links?.facebook}
                placeholder="https://facebook.com/..."
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    social_links: { ...formData.social_links, facebook: value as string },
                  })
                }
              />
            </div>
            <div>
              <FormField
                label="LinkedIn"
                type="url"
                value={formData.social_links?.linkedin}
                placeholder="https://linkedin.com/..."
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    social_links: { ...formData.social_links, linkedin: value as string },
                  })
                }
              />
            </div>
            <div>
              <FormField
                label="Twitter/X"
                type="url"
                value={formData.social_links?.twitter}
                placeholder="https://twitter.com/..."
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    social_links: { ...formData.social_links, twitter: value as string },
                  })
                }
              />
            </div>
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
            {isSubmitting ? "Đang xử lý..." : staff ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}


