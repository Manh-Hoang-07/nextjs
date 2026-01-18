"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface FAQ {
  id?: number;
  question?: string;
  answer?: string;
  status?: string;
  sort_order?: number;
}

interface FAQFormProps {
  show: boolean;
  faq?: FAQ | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: Partial<FAQ>) => void;
  onCancel?: () => void;
}

export default function FAQForm({
  show,
  faq,
  apiErrors = {},
  onSubmit,
  onCancel,
}: FAQFormProps) {
  const formTitle = faq ? "Chỉnh sửa FAQ" : "Thêm FAQ mới";

  const [formData, setFormData] = useState<Partial<FAQ>>({
    question: "",
    answer: "",
    status: "active",
    sort_order: 0,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = useMemo(() => getBasicStatusArray(), []);

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question || "",
        answer: faq.answer || "",
        status: faq.status || "active",
        sort_order: faq.sort_order || 0,
      });
    } else {
      setFormData({
        question: "",
        answer: "",
        status: "active",
        sort_order: 0,
      });
    }
    setValidationErrors({});
  }, [faq, show]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.question?.trim()) {
      errors.question = "Câu hỏi là bắt buộc";
    }

    if (!formData.answer?.trim()) {
      errors.answer = "Câu trả lời là bắt buộc";
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
        question: formData.question?.trim(),
        answer: formData.answer?.trim(),
        status: formData.status,
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
    <Modal show={show} onClose={onCancel || (() => {})} title={formTitle} size="lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin FAQ</h3>
          </div>

          <div className="space-y-4">
            <FormField
              label="Câu hỏi"
              type="text"
              value={formData.question}
              placeholder="Nhập câu hỏi"
              required
              error={validationErrors.question || getApiError("question")}
              onChange={(value) => setFormData({ ...formData, question: value as string })}
            />

            <FormField
              label="Câu trả lời"
              type="textarea"
              value={formData.answer}
              placeholder="Nhập câu trả lời"
              rows={5}
              required
              error={validationErrors.answer || getApiError("answer")}
              onChange={(value) => setFormData({ ...formData, answer: value as string })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Trạng thái"
                type="select"
                value={formData.status}
                options={statusOptions}
                onChange={(value) => setFormData({ ...formData, status: value as string })}
              />

              <FormField
                label="Thứ tự"
                type="number"
                value={formData.sort_order}
                placeholder="0"
                onChange={(value) => setFormData({ ...formData, sort_order: Number(value) || 0 })}
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
            {isSubmitting ? "Đang xử lý..." : faq ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}


