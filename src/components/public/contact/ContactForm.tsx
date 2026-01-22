"use client";

import { useState } from "react";
import { Button } from "@/components/ui/navigation/Button";
import FormField from "@/components/ui/forms/FormField";

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmitStatus("success");
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                setSubmitStatus("idle");
            }, 5000);
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

            {submitStatus === "error" && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Có lỗi xảy ra. Vui lòng thử lại sau.</span>
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
