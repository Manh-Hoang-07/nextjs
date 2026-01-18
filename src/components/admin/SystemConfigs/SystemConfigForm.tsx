"use client";

import { useState, useEffect } from "react";
import { useSystemConfig } from "@/hooks/useSystemConfig";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import { api } from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";

interface ConfigField {
    key: string;
    label: string;
    type: "text" | "number" | "textarea" | "image" | "email" | "password" | "checkbox" | "custom";
    placeholder?: string;
    description?: string;
    component?: React.ComponentType<{ value: any; onChange: (value: any) => void }>;
}

interface SystemConfigFormProps {
    group: string;
    fields: ConfigField[];
}

export default function SystemConfigForm({ group, fields }: SystemConfigFormProps) {
    const { data: configData, loading, refresh } = useSystemConfig(group, { isAdmin: true, enableCache: false });
    const { showSuccess, showError } = useToastContext();
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (configData) {
            setFormData(configData);
        }
    }, [configData]);

    const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await api.post(adminEndpoints.systemConfigs.update(group), formData);
            if (response.data.success) {
                showSuccess("Cập nhật cấu hình thành công");
                refresh();
            } else {
                showError(response.data.message || "Đã có lỗi xảy ra");
            }
        } catch (error: any) {
            console.error("Failed to update config:", error);
            showError(error.response?.data?.message || "Lỗi kết nối server");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && !configData) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-gray-500">Đang tải cấu hình...</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                {fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                        {field.type === "image" ? (
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    {field.label}
                                    {field.description && (
                                        <span className="block text-xs font-normal text-gray-500 mt-1">
                                            {field.description}
                                        </span>
                                    )}
                                </label>
                                <ImageUploader
                                    value={formData[field.key]}
                                    defaultUrl={formData[field.key] || undefined}
                                    onChange={(value) => handleChange(field.key, value)}
                                    onRemove={() => handleChange(field.key, null)}
                                />
                            </div>
                        ) : field.type === "custom" && field.component ? (
                            <field.component
                                value={formData[field.key]}
                                onChange={(value) => handleChange(field.key, value)}
                            />
                        ) : (
                            <FormField
                                label={field.label}
                                type={field.type === "textarea" ? "textarea" : field.type}
                                value={field.type === "checkbox" ? !!formData[field.key] : formData[field.key] ?? ""}
                                placeholder={field.placeholder}
                                helpText={field.description}
                                onChange={(value) => handleChange(field.key, value)}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Đang lưu...
                        </>
                    ) : (
                        "Lưu thay đổi"
                    )}
                </button>
            </div>
        </form>
    );
}
