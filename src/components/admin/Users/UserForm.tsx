"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormWrapper from "@/components/ui/FormWrapper";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import SingleSelectEnhanced from "@/components/ui/SingleSelectEnhanced";
import { formatDate } from "@/utils/formatters";

interface User {
  id?: number;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  name?: string;
  gender?: string;
  birthday?: string;
  address?: string;
  image?: string | null;
  about?: string;
  status?: string;
  remove_image?: boolean;
}

interface UserFormProps {
  show: boolean;
  user?: User | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  genderEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  loading?: boolean;
  onSubmit?: (data: User) => void;
  onCancel?: () => void;
}

export default function UserForm({
  show,
  user,
  statusEnums = [],
  genderEnums = [],
  apiErrors = {},
  loading = false,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const formTitle = user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới";

  const defaultValues = useMemo(() => {
    const obj = user || {};
    return {
      username: "",
      email: "",
      phone: "",
      password: "",
      name: "",
      gender: "",
      birthday: "",
      address: "",
      image: null,
      about: "",
      status: "",
      remove_image: false,
      ...obj,
    };
  }, [user]);

  const imageUrl = useMemo(() => user?.image || null, [user]);

  const validationRules = useMemo(
    () => ({
      username: [{ max: [50, "Tên đăng nhập không được vượt quá 50 ký tự."] }],
      email: [{ email: "Email không hợp lệ." }],
      phone: [{ max: [20, "Số điện thoại không được vượt quá 20 ký tự."] }],
      password: user
        ? []
        : [
          { required: "Mật khẩu là bắt buộc." },
          { min: [6, "Mật khẩu phải có ít nhất 6 ký tự."] },
        ],
      name: [{ max: [255, "Họ tên không được vượt quá 255 ký tự."] }],
      address: [{ max: [255, "Địa chỉ không được vượt quá 255 ký tự."] }],
      about: [{ max: [500, "Giới thiệu không được vượt quá 500 ký tự."] }],
    }),
    [user]
  );

  const statusOptions = useMemo(
    () =>
      Array.isArray(statusEnums)
        ? statusEnums
          .filter((opt) => opt != null)
          .map((opt) => ({
            value: opt?.value ?? (opt as any)?.id ?? "",
            label: opt?.label ?? (opt as any)?.name ?? "",
          }))
        : [],
    [statusEnums]
  );

  const genderOptions = useMemo(
    () =>
      Array.isArray(genderEnums)
        ? genderEnums
          .filter((opt) => opt != null)
          .map((opt) => ({
            value: opt?.value ?? (opt as any)?.id ?? "",
            label: opt?.label ?? (opt as any)?.name ?? "",
          }))
        : [],
    [genderEnums]
  );

  const handleSubmit = (form: User) => {
    onSubmit?.(form);
  };

  return (
    <Modal show={show} onClose={onCancel || (() => { })} title={formTitle} size="xl" loading={loading}>
      <div className="space-y-8">
        <section className="space-y-4">
          <header className="border-b border-gray-200 pb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
              <p className="text-sm text-gray-500">Nhập thông tin đăng nhập và trạng thái</p>
            </div>
          </header>

          <FormWrapper
            defaultValues={defaultValues}
            apiErrors={apiErrors}
            submitText={user ? "Cập nhật" : "Thêm mới"}
            onSubmit={handleSubmit}
            onCancel={onCancel}
          >
            {({ form, errors, clearError }) => (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    value={form.username}
                    onChange={(val) => {
                      form.username = val;
                      clearError("username");
                    }}
                    label="Tên đăng nhập"
                    name="username"
                    error={errors.username as string}
                  />
                  <FormField
                    value={form.email}
                    onChange={(val) => {
                      form.email = val;
                      clearError("email");
                    }}
                    label="Email"
                    name="email"
                    type="email"
                    error={errors.email as string}
                  />
                  <FormField
                    value={form.phone}
                    onChange={(val) => {
                      form.phone = val;
                      clearError("phone");
                    }}
                    label="Số điện thoại"
                    name="phone"
                    type="tel"
                    error={errors.phone as string}
                  />
                  {!user && (
                    <FormField
                      value={form.password}
                      onChange={(val) => {
                        form.password = val;
                        clearError("password");
                      }}
                      label="Mật khẩu"
                      name="password"
                      type="password"
                      required
                      error={errors.password as string}
                    />
                  )}
                  <SingleSelectEnhanced
                    value={form.status}
                    onChange={(val) => {
                      form.status = val as string;
                      clearError("status");
                    }}
                    label="Trạng thái"
                    options={statusOptions}
                    placeholder="-- Chọn trạng thái --"
                    error={errors.status as string}
                    required="required"
                  />
                </div>

                <div className="mt-8 space-y-4">
                  <header className="border-b border-gray-200 pb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Hồ sơ người dùng</h3>
                      <p className="text-sm text-gray-500">Thông tin hiển thị và liên hệ</p>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      value={form.name}
                      onChange={(val) => {
                        form.name = val;
                        clearError("name");
                      }}
                      label="Họ tên"
                      name="name"
                      error={errors.name as string}
                    />
                    <SingleSelectEnhanced
                      value={form.gender}
                      onChange={(val) => {
                        form.gender = val as string;
                        clearError("gender");
                      }}
                      label="Giới tính"
                      options={genderOptions}
                      placeholder="-- Chọn giới tính --"
                      error={errors.gender as string}
                    />
                    <FormField
                      value={form.birthday}
                      onChange={(val) => {
                        form.birthday = val;
                        clearError("birthday");
                      }}
                      label="Ngày sinh"
                      name="birthday"
                      type="date"
                      error={errors.birthday as string}
                    />
                    <FormField
                      value={form.address}
                      onChange={(val) => {
                        form.address = val;
                        clearError("address");
                      }}
                      label="Địa chỉ"
                      name="address"
                      error={errors.address as string}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="user-image">
                        Ảnh đại diện
                      </label>
                      <ImageUploader
                        value={form.image}
                        defaultUrl={imageUrl || undefined}
                        onChange={(val) => {
                          form.image = val as string;
                        }}
                        onRemove={() => {
                          form.remove_image = true;
                        }}
                      />
                    </div>
                    <FormField
                      value={form.about}
                      onChange={(val) => {
                        form.about = val;
                        clearError("about");
                      }}
                      label="Giới thiệu"
                      name="about"
                      type="textarea"
                      error={errors.about as string}
                    />
                  </div>
                </div>
              </>
            )}
          </FormWrapper>
        </section>
      </div>
    </Modal>
  );
}

