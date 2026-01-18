"use client";

import { useState, useCallback } from "react";
import apiClient from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";

export interface CreatePaymentUrlRequest {
  order_id: number;
  payment_method_id: number;
  return_url?: string;
  cancel_url?: string;
}

export interface CreatePaymentUrlResponse {
  success: boolean;
  message: string;
  data: {
    payment_id: number;
    payment_url: string;
    expires_at: string;
  };
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data: {
    order_id: number;
    order_number: string;
    payment_status: string;
    transaction_id?: string;
    amount: string;
  };
}

export interface Payment {
  id: number;
  order_id: number;
  payment_method_id: number;
  status: "pending" | "processing" | "completed" | "failed";
  amount: string;
  transaction_id: string | null;
  paid_at: string | null;
  payment_method?: {
    id: number;
    name: string;
    code: string;
  };
}

export function usePayments() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showSuccess, showError } = useToastContext();

  /**
   * Tạo payment URL cho online payment (VNPay, MoMo, etc.)
   * API: POST /api/public/payments/create-url
   */
  const createPaymentUrl = useCallback(
    async (
      request: CreatePaymentUrlRequest
    ): Promise<CreatePaymentUrlResponse["data"]> => {
      try {
        setIsLoading(true);
        const response = await apiClient.post<CreatePaymentUrlResponse>(
          publicEndpoints.payments.createUrl,
          request
        );

        if (response.data.success) {
          return response.data.data;
        }

        throw new Error(
          response.data.message || "Không thể tạo payment URL"
        );
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Không thể tạo payment URL";
        setErrorMessage(errorMessage);
        showError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [showError]
  );

  /**
   * Xác minh thanh toán từ payment gateway (return URL)
   * API: GET /api/public/payments/verify/:gateway
   */
  const verifyPayment = useCallback(
    async (
      gateway: string,
      queryParams: Record<string, string>
    ): Promise<VerifyPaymentResponse["data"]> => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams(queryParams);
        const response = await apiClient.get<VerifyPaymentResponse>(
          `${publicEndpoints.payments.verify(gateway)}?${params.toString()}`
        );

        if (response.data.success) {
          showSuccess("Xác minh thanh toán thành công");
          return response.data.data;
        }

        throw new Error(
          response.data.message || "Xác minh thanh toán thất bại"
        );
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Không thể xác minh thanh toán";
        setErrorMessage(errorMessage);
        showError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [showSuccess, showError]
  );

  /**
   * Lấy danh sách payments
   * API: GET /api/public/payments
   */
  const fetchPayments = useCallback(
    async (filters?: { order_id?: number; status?: string }) => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (filters?.order_id)
          params.set("order_id", filters.order_id.toString());
        if (filters?.status) params.set("status", filters.status);

        const response = await apiClient.get<{
          success: boolean;
          data: Payment[];
        }>(
          `${publicEndpoints.payments.list}${params.toString() ? `?${params.toString()}` : ""
          }`
        );

        if (response.data.success) {
          return response.data.data;
        }

        return [];
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Không thể lấy danh sách thanh toán";
        setErrorMessage(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Lấy chi tiết payment
   * API: GET /api/public/payments/:id
   */
  const fetchPayment = useCallback(
    async (paymentId: number): Promise<Payment | null> => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<{
          success: boolean;
          data: Payment;
        }>(publicEndpoints.payments.show(paymentId));

        if (response.data.success) {
          return response.data.data;
        }

        return null;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Không thể lấy chi tiết thanh toán";
        setErrorMessage(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    errorMessage,
    createPaymentUrl,
    verifyPayment,
    fetchPayments,
    fetchPayment,
  };
}

