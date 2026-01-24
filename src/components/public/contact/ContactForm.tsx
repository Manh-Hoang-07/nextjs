"use client";

import { useState } from "react";
import { Button } from "@/components/ui/navigation/Button";
import FormField from "@/components/ui/forms/FormField";
import { submitContact } from "@/lib/api/contact";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().min(1, "Họ và tên là bắt buộc").max(255, "Họ và tên tối đa 255 ký tự"),
    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ").max(255, "Email tối đa 255 ký tự"),
    phone: z.string().max(20, "Số điện thoại tối đa 20 ký tự").optional().or(z.literal("")),
    subject: z.string().max(255, "Chủ đề tối đa 255 ký tự").optional().or(z.literal("")),
    message: z.string().min(1, "Nội dung là bắt buộc"),
});

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("idle");
        setErrors({});
        setGeneralError(null);

        // Validate Client-side
        const validation = contactSchema.safeParse(formData);
        if (!validation.success) {
            const newErrors: Record<string, string> = {};
            validation.error.errors.forEach(err => {
                if (err.path[0]) {
                    newErrors[err.path[0] as string] = err.message;
                }
            });
            setErrors(newErrors);
            setIsSubmitting(false);
            setSubmitStatus("error");
            return;
        }

        try {
            await submitContact(formData);
            setSubmitStatus("success");
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });

            // Tự động ẩn thông báo thành công sau 5 giây
            setTimeout(() => {
                setSubmitStatus("idle");
            }, 5000);
        } catch (error: any) {
            setSubmitStatus("error");
            console.error("Submit contact error:", error);

            if (error.response?.data?.message) {
                const msg = error.response.data.message;

                if (Array.isArray(msg)) {
                    const newErrors: Record<string, string> = {};
                    msg.forEach((err: string) => {
                        if (err.toLowerCase().includes("email")) newErrors.email = err;
                        else if (err.toLowerCase().includes("name")) newErrors.name = err;
                        else if (err.toLowerCase().includes("phone")) newErrors.phone = err;
                        else if (err.toLowerCase().includes("subject")) newErrors.subject = err;
                        else if (err.toLowerCase().includes("message")) newErrors.message = err;
                        else setGeneralError(prev => prev ? `${prev}, ${err}` : err);
                    });

                    if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                    } else if (!generalError) {
                        setGeneralError(msg.join(", "));
                    }
                } else {
                    setGeneralError(msg);
                }
            } else {
                setGeneralError("Có lỗi xảy ra. Vui lòng thử lại sau.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="bg-white rounded-xl shadow-lg p-8 h-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Gửi tin nhắn cho chúng tôi</h2>

            {submitStatus === "success" && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.</span>
                </div>
            )}

            {submitStatus === "error" && generalError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{generalError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        id="name"
                        name="name"
                        type="text"
                        label="Họ và tên"
                        placeholder="Nhập họ tên của bạn"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        error={errors.name}
                    />

                    <FormField
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        error={errors.email}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        id="phone"
                        name="phone"
                        type="tel"
                        label="Số điện thoại"
                        placeholder="090 123 4567"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                    />

                    <FormField
                        id="subject"
                        name="subject"
                        type="text"
                        label="Chủ đề"
                        placeholder="Bạn quan tâm đến dịch vụ nào?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        error={errors.subject}
                    />
                </div>

                <FormField
                    id="message"
                    name="message"
                    type="textarea"
                    label="Nội dung tin nhắn"
                    placeholder="Mô tả chi tiết yêu cầu của bạn..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    error={errors.message}
                />

                <div className="pt-4">
                    <Button
                        type="submit"
                        className="w-full md:w-auto px-8"
                        isLoading={isSubmitting}
                    >
                        Gửi tin nhắn
                    </Button>
                </div>
            </form>
        </div>
    );
}
