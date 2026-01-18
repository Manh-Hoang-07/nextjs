"use client";

import { useState, useMemo, useCallback } from "react";
import apiClient from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";

export interface Coupon {
  id: number;
  code: string;
  name: string;
  discount_type: "percentage" | "fixed_amount" | "shipping" | "buy_x_get_y";
  discount_value: number;
  minimum_order_amount?: number;
  maximum_discount_amount?: number;
  start_date: string;
  end_date: string;
  usage_limit?: number;
  usage_count?: number;
  is_active: boolean;
  can_use?: boolean;
}

export interface AppliedCoupon {
  coupon_id: number;
  coupon_code: string;
  discount_amount: number;
  applied_at: string;
}

export function useDiscount() {
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showSuccess, showError } = useToastContext();

  // Computed properties
  const hasAvailableCoupons = useMemo(
    () => availableCoupons.length > 0,
    [availableCoupons.length]
  );

  const hasAppliedCoupon = useMemo(() => !!appliedCoupon, [appliedCoupon]);

  const usableCoupons = useMemo(
    () => availableCoupons.filter((coupon) => coupon.can_use),
    [availableCoupons]
  );

  // Fetch available coupons
  const fetchAvailableCoupons = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(
        publicEndpoints.discounts.available
      );

      if (response.data.success) {
        setAvailableCoupons(response.data.data);
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Không thể tải danh sách mã giảm giá"
        );
      }
    } catch (error: any) {
      const errorMsg =
        error.message || "Không thể tải danh sách mã giảm giá";
      setErrorMessage(errorMsg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply coupon to cart
  const applyCoupon = useCallback(
    async (
      cartUuid: string,
      couponCode: string,
      cartId?: number
    ): Promise<any> => {
      try {
        setIsLoading(true);
        const requestBody: any = {
          coupon_code: couponCode,
        };

        // Use cart_id if available, otherwise use cart_uuid
        if (cartId) {
          requestBody.cart_id = cartId;
        } else {
          requestBody.cart_uuid = cartUuid;
        }

        const response = await apiClient.post(
          publicEndpoints.discounts.applyCoupon,
          requestBody
        );

        if (response.data.success) {
          // Update applied coupon with the response data
          setAppliedCoupon(response.data.data.applied_coupon);
          showSuccess("Áp dụng mã giảm giá thành công!");
          return response.data.data;
        } else {
          throw new Error(
            response.data.message || "Không thể áp dụng mã giảm giá"
          );
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Không thể áp dụng mã giảm giá";
        setErrorMessage(errorMessage);
        showError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [showSuccess, showError]
  );

  // Remove coupon from cart
  const removeCoupon = useCallback(
    async (cartUuidOrId: string | number) => {
      try {
        setIsLoading(true);
        const endpoint = publicEndpoints.discounts.remove(cartUuidOrId);
        const response = await apiClient.delete(endpoint);

        if (response.data.success) {
          setAppliedCoupon(null);
          showSuccess("Xóa mã giảm giá thành công!");
          return response.data.data;
        } else {
          throw new Error(
            response.data.message || "Không thể xóa mã giảm giá"
          );
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Không thể xóa mã giảm giá";
        setErrorMessage(errorMessage);
        showError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [showSuccess, showError]
  );

  // Validate coupon
  const validateCoupon = useCallback(
    async (couponCode: string, cartTotal?: number) => {
      try {
        const response = await apiClient.post(
          publicEndpoints.discounts.validateCoupon,
          {
            coupon_code: couponCode,
            cart_total: cartTotal || 0,
          }
        );

        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(
            response.data.message || "Mã giảm giá không hợp lệ"
          );
        }
      } catch (error: any) {
        throw error;
      }
    },
    []
  );

  // Find coupon by code
  const findCouponByCode = useCallback(
    (code: string): Coupon | undefined => {
      return availableCoupons.find(
        (coupon) => coupon.code.toLowerCase() === code.toLowerCase()
      );
    },
    [availableCoupons]
  );

  // Check if coupon is applicable for cart total
  const isCouponApplicable = useCallback(
    (coupon: Coupon, cartTotal: number): boolean => {
      if (!coupon.is_active) return false;
      if (
        coupon.minimum_order_amount &&
        cartTotal < coupon.minimum_order_amount
      )
        return false;
      if (coupon.usage_limit && (coupon.usage_count || 0) >= coupon.usage_limit)
        return false;
      if (new Date(coupon.end_date) < new Date()) return false;
      if (new Date(coupon.start_date) > new Date()) return false;
      return true;
    },
    []
  );

  // Calculate discount amount
  const calculateDiscountAmount = useCallback(
    (coupon: Coupon, cartTotal: number): number => {
      if (!isCouponApplicable(coupon, cartTotal)) return 0;

      let discountAmount = 0;

      switch (coupon.discount_type) {
        case "percentage":
          discountAmount = cartTotal * (coupon.discount_value / 100);
          break;
        case "fixed_amount":
          discountAmount = Math.min(coupon.discount_value, cartTotal);
          break;
        case "shipping":
          discountAmount = coupon.discount_value;
          break;
        case "buy_x_get_y":
          discountAmount = coupon.discount_value;
          break;
        default:
          discountAmount = 0;
      }

      // Apply maximum discount limit if set
      if (coupon.maximum_discount_amount) {
        discountAmount = Math.min(
          discountAmount,
          coupon.maximum_discount_amount
        );
      }

      return discountAmount;
    },
    [isCouponApplicable]
  );

  // Format discount display text
  const formatDiscountText = useCallback((coupon: Coupon): string => {
    switch (coupon.discount_type) {
      case "percentage":
        return `Giảm ${coupon.discount_value}%`;
      case "fixed_amount":
        return `Giảm ${new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(coupon.discount_value)}`;
      case "shipping":
        return "Miễn phí vận chuyển";
      case "buy_x_get_y":
        return `Mua X tặng Y`;
      default:
        return "Giảm giá";
    }
  }, []);

  // Clear applied coupon
  const clearAppliedCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // Reset discount state
  const resetDiscountState = useCallback(() => {
    setAvailableCoupons([]);
    setAppliedCoupon(null);
  }, []);

  return {
    // State
    availableCoupons,
    appliedCoupon,
    isLoading,
    errorMessage,

    // Computed properties
    hasAvailableCoupons,
    hasAppliedCoupon,
    usableCoupons,

    // Methods
    fetchAvailableCoupons,
    applyCoupon,
    removeCoupon,
    validateCoupon,
    findCouponByCode,
    isCouponApplicable,
    calculateDiscountAmount,
    formatDiscountText,
    clearAppliedCoupon,
    resetDiscountState,
  };
}

