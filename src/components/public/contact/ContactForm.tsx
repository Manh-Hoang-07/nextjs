"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/navigation/Button";
import FormField from "@/components/ui/forms/FormField";
import { submitContact } from "@/lib/api/contact";
import { useToastContext } from "@/contexts/ToastContext";

const contactSchema = z.object({
    name: z.string().min(1, "Họ và tên là bắt buộc").max(255, "Họ và tên tối đa 255 ký tự"),
    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ").max(255, "Email tối đa 255 ký tự"),
    phone: z.string().max(20, "Số điện thoại tối đa 20 ký tự").optional().or(z.literal("")),
    subject: z.string().min(1, "Chủ đề là bắt buộc").max(255, "Chủ đề tối đa 255 ký tự"),
    message: z.string().min(1, "Nội dung là bắt buộc"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
    const { showSuccess, showError } = useToastContext();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        try {
            await submitContact(data);
            showSuccess("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.");
            reset();
        } catch (error: any) {
            console.error("Submit contact error:", error);

            if (error.response?.data?.message) {
                const msg = error.response.data.message;

                if (Array.isArray(msg)) {
                    const otherErrors: string[] = [];

                    msg.forEach((err: string) => {
                        const lowerErr = err.toLowerCase();
                        if (lowerErr.includes("email")) setError("email", { message: err });
                        else if (lowerErr.includes("name")) setError("name", { message: err });
                        else if (lowerErr.includes("phone")) setError("phone", { message: err });
                        else if (lowerErr.includes("subject")) setError("subject", { message: err });
                        else if (lowerErr.includes("message")) setError("message", { message: err });
                        else otherErrors.push(err);
                    });

                    if (otherErrors.length > 0) {
                        showError(otherErrors.join(", "));
                    }
                } else {
                    showError(msg);
                }
            } else {
                showError("Có lỗi xảy ra. Vui lòng thử lại sau.");
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-8 h-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Gửi tin nhắn cho chúng tôi</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        id="name"
                        label="Họ và tên"
                        placeholder="Nhập họ tên của bạn"
                        {...register("name")}
                        required
                        error={errors.name?.message}
                    />

                    <FormField
                        id="email"
                        type="email"
                        label="Email"
                        placeholder="example@email.com"
                        {...register("email")}
                        required
                        error={errors.email?.message}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        id="phone"
                        type="tel"
                        label="Số điện thoại"
                        placeholder="090 123 4567"
                        {...register("phone")}
                        error={errors.phone?.message}
                    />

                    <FormField
                        id="subject"
                        label="Chủ đề"
                        placeholder="Bạn quan tâm đến dịch vụ nào?"
                        {...register("subject")}
                        required
                        error={errors.subject?.message}
                    />
                </div>

                <FormField
                    id="message"
                    type="textarea"
                    label="Nội dung tin nhắn"
                    placeholder="Mô tả chi tiết yêu cầu của bạn..."
                    {...register("message")}
                    required
                    rows={5}
                    error={errors.message?.message}
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
