"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/feedback/Modal";
import FormWrapper from "@/components/ui/forms/FormWrapper";
import FormField from "@/components/ui/forms/FormField";

interface ChangePasswordFormProps {
  show: boolean;
  user?: any;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function ChangePasswordForm({
  show,
  user,
  apiErrors = {},
  onSubmit,
  onCancel,
}: ChangePasswordFormProps) {
  const formTitle = `Đổi mật khẩu cho ${user?.username || "người dùng"}`;

  const defaultValues = {
    password: "",
    password_confirmation: "",
  };

  const handleSubmit = (form: any) => {
    // Validate
    const errors: Record<string, string> = {};
    if (!form.password || form.password.trim() === "") {
      errors.password = "Mật khẩu mới là bắt buộc.";
    } else if (form.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    if (!form.password_confirmation || form.password_confirmation.trim() === "") {
      errors.password_confirmation = "Vui lòng xác nhận mật khẩu mới.";
    } else if (form.password !== form.password_confirmation) {
      errors.password_confirmation = "Mật khẩu xác nhận không khớp.";
    }

    if (Object.keys(errors).length > 0) {
      return;
    }

    onSubmit?.(form);
  };

  const handleClose = () => {
    onCancel?.();
  };

  if (!show) return null;

  return (
    <Modal show={show} onClose={handleClose} title={formTitle} size="lg">
      <div className="space-y-6">
        <header className="border-b border-gray-200 pb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c0-1.657-1.343-3-3-3H7a3 3 0 100 6h2a3 3 0 003-3zm0 0V7m0 4v4"
              ></path>
            </svg>
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Đổi mật khẩu</h3>
            <p className="text-sm text-gray-500">Nhập mật khẩu mới cho người dùng</p>
          </div>
        </header>

        <FormWrapper
          defaultValues={defaultValues}
          apiErrors={apiErrors}
          submitText="Đổi mật khẩu"
          onSubmit={handleSubmit}
          onCancel={handleClose}
        >
          {({ form, errors, clearError }: any) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                value={form.password}
                onChange={(value: string) => {
                  form.password = value;
                  clearError("password");
                }}
                label="Mật khẩu mới"
                name="password"
                type="password"
                error={errors.password || (apiErrors.password ? String(apiErrors.password) : undefined)}
                required
                autocomplete="new-password"
              />
              <FormField
                value={form.password_confirmation}
                onChange={(value: string) => {
                  form.password_confirmation = value;
                  clearError("password_confirmation");
                }}
                label="Xác nhận mật khẩu mới"
                name="password_confirmation"
                type="password"
                error={errors.password_confirmation || (apiErrors.password_confirmation ? String(apiErrors.password_confirmation) : undefined)}
                required
                autocomplete="new-password"
              />
            </div>
          )}
        </FormWrapper>
      </div>
    </Modal>
  );
}
