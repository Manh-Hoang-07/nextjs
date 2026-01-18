"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import { useAuthStore } from "@/lib/store/authStore";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFieldChange = (field: string) => (value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        remember: formData.rememberMe,
      });
      
      if (result.success) {
        // Redirect to dashboard
        router.push("/dashboard/admin");
      } else {
        // Handle errors from API
        if (result.errors) {
          const apiErrors: Record<string, string> = {};
          Object.keys(result.errors).forEach(key => {
            const errorMessages = result.errors![key];
            if (Array.isArray(errorMessages) && errorMessages.length > 0) {
              apiErrors[key] = errorMessages[0];
            }
          });
          setErrors(apiErrors);
        } else {
          setErrors({ form: result.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin." });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ form: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{" "}
            <a href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              đăng ký tài khoản mới
            </a>
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {errors.form && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.form}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormField
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="nhap@email.com"
              value={formData.email}
              onChange={handleFieldChange("email")}
              error={errors.email}
              required
              autocomplete="email"
            />
            
            <div className="relative">
              <FormField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Mật khẩu"
                placeholder="••••••••••"
                value={formData.password}
                onChange={handleFieldChange("password")}
                error={errors.password}
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c4.9 0 9.112-3.574 10.074-8.125l-1.125-1.125c-.621-.621-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v3.75c0 .621.504 1.125 1.125h1.125l1.125 1.125c.621.621 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-1.125A1.125 1.125 0 0112 18.875z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm4 8a2 2 0 11-4 0 2 2 0 014 0zM2.458 12C3.732 7.943 7.523 5 12 5c1.477 0 2.268.943 3.542 2l.542 2.447a2 2 0 012.477 1.891A8.967 8.967 0 0112 20c-4.477 0-8.268-1.943-9.542-4.542l2.447-2.447A2 2 0 0112.477 10.109 8.967 8.967 0 018.954 4.542z" />
                  </svg>
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FormField
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checkboxLabel="Ghi nhớ đăng nhập"
                  value={formData.rememberMe}
                  onChange={handleFieldChange("rememberMe")}
                />
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </div>
          </form>
        </div>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Hoặc đăng nhập với</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-1.35-1.1-2.44-2.44-2.44H4.44c-1.34 0-2.44 1.09-2.44 2.44v4.44c0 1.35 1.1 2.44 2.44h15.12c1.34 0 2.44-1.09 2.44-2.44v-4.44z"/>
                <path d="M15.67 10.43c0-1.35-1.1-2.44-2.44-2.44H8.33c-1.34 0-2.44 1.09-2.44 2.44v4.44c0 1.35 1.1 2.44 2.44h4.89c1.35 0 2.44-1.09 2.44-2.44v-4.44z"/>
                <path d="M15.67 16.56c0-1.35-1.1-2.44-2.44-2.44H8.33c-1.34 0-2.44 1.09-2.44 2.44v4.44c0 1.35 1.1 2.44 2.44h4.89c1.35 0 2.44-1.09 2.44-2.44v-4.44z"/>
              </svg>
              Google
            </button>
            
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.406.398.859-.267 1.657-.716 2.306-1.324-.814-1.484-1.31-2.206z"/>
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




