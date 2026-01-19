"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/navigation/Button";
import FormField from "@/components/ui/forms/FormField";

// 1. Define Register Schema
const registerSchema = z.object({
  name: z.string().min(1, "Họ và tên là bắt buộc").max(100, "Họ và tên tối đa 100 ký tự"),
  username: z.string().max(50, "Tên đăng nhập tối đa 50 ký tự").optional().nullable().or(z.literal("")),
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ").max(255, "Email quá dài"),
  phone: z.string().regex(/^[0-9+]{9,15}$/, "Số điện thoại không hợp lệ").optional().nullable().or(z.literal("")),
  password: z.string().min(1, "Mật khẩu là bắt buộc").min(6, "Mật khẩu phải có ít nhất 6 ký tự").max(100, "Mật khẩu quá dài"),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
  agreeTerms: z.boolean().refine(val => val === true, "Bạn phải đồng ý với điều khoản sử dụng"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setServerError(null);
    setSuccess(null);

    try {
      // TODO: Implement actual registration API call
      console.log("Registering with:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setServerError(err.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản mới
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{" "}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              đăng nhập vào tài khoản hiện có
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {serverError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {serverError}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
              {success}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              {...register("name")}
              error={errors.name?.message}
              required
            />

            <FormField
              label="Tên đăng nhập (tùy chọn)"
              placeholder="Nhập tên đăng nhập"
              {...register("username")}
              error={errors.username?.message}
            />

            <FormField
              label="Email"
              type="email"
              placeholder="nhap@email.com"
              {...register("email")}
              error={errors.email?.message}
              required
            />

            <FormField
              label="Số điện thoại"
              type="tel"
              placeholder="Nhập số điện thoại"
              {...register("phone")}
              error={errors.phone?.message}
            />

            <FormField
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
              required
            />

            <FormField
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              required
            />

            <div className="space-y-1">
              <FormField
                type="checkbox"
                checkboxLabel={
                  <span className="text-sm text-gray-900">
                    Tôi đồng ý với{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-500">điều khoản sử dụng</a> và{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-500">chính sách bảo mật</a>
                  </span>
                }
                {...register("agreeTerms")}
                required
              />
              {errors.agreeTerms && (
                <p className="text-xs text-red-500">{errors.agreeTerms.message}</p>
              )}
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
