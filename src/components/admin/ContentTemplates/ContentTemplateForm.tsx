"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { ContentTemplate } from "@/types/api";

interface FormProps {
    initialData?: Partial<ContentTemplate>;
    onSubmit: (data: any) => void;
    apiErrors?: any;
    loading?: boolean;
}

export default function ContentTemplateForm({
    initialData,
    onSubmit,
    apiErrors,
    loading = false,
}: FormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: initialData || {
            status: "active",
            category: "render",
            type: "email",
        },
    });

    const category = watch("category");

    useEffect(() => {
        if (initialData) {
            Object.entries(initialData).forEach(([key, value]) => {
                let val = value;
                if (key === 'metadata' && value && typeof value === 'object') {
                    val = JSON.stringify(value, null, 2);
                }
                if (key === 'variables' && Array.isArray(value)) {
                    val = value.join(', ');
                }
                setValue(key as any, val);
            });
        }
    }, [initialData, setValue]);

    const onFormSubmit = (data: any) => {
        const formattedData = { ...data };

        // Parse variables if they are a string
        if (typeof formattedData.variables === "string") {
            try {
                formattedData.variables = formattedData.variables
                    .split(',')
                    .map((v: string) => v.trim())
                    .filter(Boolean);
            } catch (e) {
                console.error("Failed to parse variables", e);
            }
        }

        // Parse metadata if it's a string
        if (typeof formattedData.metadata === 'string' && formattedData.metadata.trim()) {
            try {
                formattedData.metadata = JSON.parse(formattedData.metadata);
            } catch (e) {
                console.error("Failed to parse metadata", e);
            }
        }

        onSubmit(formattedData);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8 max-h-[70vh] overflow-y-auto px-1 pr-3 scrollbar-thin">
            {/* SECTION 1: THÔNG TIN CƠ BẢN */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <div className="w-1 h-5 bg-blue-600 rounded-full" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Thông tin cơ bản</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Mã (Code) *</label>
                        <input
                            {...register("code", { required: "Vui lòng nhập mã" })}
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder="Ví dụ: registration_success"
                        />
                        {errors.code && <p className="text-[10px] text-red-500 font-medium">{errors.code.message as string}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Tên mẫu *</label>
                        <input
                            {...register("name", { required: "Vui lòng nhập tên" })}
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder="Ví dụ: Xác nhận đăng ký"
                        />
                        {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name.message as string}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Phân loại *</label>
                        <select
                            {...register("category", { required: "Vui lòng chọn phân loại" })}
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                        >
                            <option value="render">Render (HTML/Text Content)</option>
                            <option value="file">File (Word/Excel/PDF Path)</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Kênh/Loại *</label>
                        <select
                            {...register("type", { required: "Vui lòng chọn loại" })}
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                        >
                            <option value="email">Email</option>
                            <option value="telegram">Telegram</option>
                            <option value="zalo">Zalo</option>
                            <option value="sms">SMS</option>
                            <option value="pdf_generated">PDF Generated</option>
                            <option value="file_word">File Word</option>
                            <option value="file_excel">File Excel</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Trạng thái</label>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="radio" {...register("status")} value="active" className="w-4 h-4 text-blue-600 focus:ring-0 border-gray-300" />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Hoạt động</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="radio" {...register("status")} value="inactive" className="w-4 h-4 text-blue-600 focus:ring-0 border-gray-300" />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-red-500 transition-colors">Tạm ngưng</span>
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: NỘI DUNG */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <div className="w-1 h-5 bg-blue-600 rounded-full" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Nội dung Template</h3>
                </div>

                {category === 'render' ? (
                    <div className="space-y-1">
                        <textarea
                            {...register("content")}
                            rows={8}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono text-sm bg-gray-50/50"
                            placeholder="Nhập nội dung template, hỗ trợ biến dạng {{variable_name}}"
                        />
                        <p className="text-[10px] text-gray-400 italic">Mẹo: Sử dụng cú pháp <code className="text-blue-600 bg-blue-50 px-1 rounded">{"{{variable}}"}</code> để chèn biến động.</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Đường dẫn File (Path)</label>
                        <input
                            {...register("file_path")}
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder="Ví dụ: templates/contract_v1.docx"
                        />
                    </div>
                )}
            </section>

            {/* SECTION 3: METADATA & BIẾN */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <div className="w-1 h-5 bg-blue-600 rounded-full" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Metadata & Biến</h3>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Biến khả dụng (Variables)</label>
                        <input
                            {...register("variables")}
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder="Ví dụ: name, email, otp (cách nhau bởi dấu phẩy)"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Metadata (JSON format)</label>
                        <textarea
                            {...register("metadata")}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono text-sm bg-gray-50/50"
                            placeholder='{"subject": "Chào mừng thành viên mới"}'
                        />
                        <p className="text-[10px] text-gray-400 italic">Cấu hình JSON bổ sung (Ví dụ Email cần subject, Telegram cần chatId,...)</p>
                    </div>
                </div>
            </section>

            <div className="flex justify-end gap-3 pt-6 sticky bottom-0 bg-white border-t border-gray-50 py-4 -mx-1">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-10 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-sm"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Đang xử lý...
                        </div>
                    ) : (
                        initialData?.id ? "Cập nhật mẫu" : "Tạo mẫu mới"
                    )}
                </button>
            </div>

            {apiErrors && Object.keys(apiErrors).length > 0 && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs border border-red-100 font-medium animate-in fade-in slide-in-from-top-1">
                    {typeof apiErrors === 'string'
                        ? apiErrors
                        : (apiErrors.message || apiErrors.error || 'Đã xảy ra lỗi, vui lòng kiểm tra lại.')}
                </div>
            )}
        </form>
    );
}
