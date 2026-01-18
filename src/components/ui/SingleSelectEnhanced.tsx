"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api/client";

interface Option {
  value: string | number;
  label: string;
}

interface SingleSelectEnhancedProps {
  value?: string | number | null;
  searchApi?: string;
  labelField?: string;
  valueField?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  helpText?: string;
  disabled?: boolean;
  required?: boolean | string;
  options?: Option[];
  loading?: boolean;
  onChange?: (value: string | number | null) => void;
}

export default function SingleSelectEnhanced({
  value,
  searchApi,
  labelField = "label",
  valueField = "value",
  label,
  placeholder = "-- Chọn --",
  error,
  helpText,
  disabled = false,
  required,
  options = [],
  loading: externalLoading,
  onChange,
}: SingleSelectEnhancedProps) {
  const [localOptions, setLocalOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const finalOptions = options.length > 0 ? options : localOptions;
  const loading = externalLoading || isLoading;

  const fetchOptions = useCallback(async () => {
    if (!searchApi) return;

    setIsLoading(true);
    try {
      const response = await api.get(searchApi);
      if (response.data?.success) {
        const data = response.data.data || [];
        setLocalOptions(
          data.map((item: any) => ({
            value: item[valueField],
            label: item[labelField] || String(item[valueField] || ""),
          }))
        );
      }
    } catch (error) {
      setLocalOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchApi, valueField, labelField]);

  useEffect(() => {
    if (searchApi && options.length === 0) {
      fetchOptions();
    }
  }, [searchApi, options.length, fetchOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rawValue = e.target.value;
    if (!rawValue || rawValue === "") {
      onChange?.(null);
    } else {
      const selectedOption = finalOptions.find(
        (opt) => String(opt.value) === String(rawValue)
      );
      if (selectedOption) {
        onChange?.(selectedOption.value);
      } else {
        const numValue = Number(rawValue);
        onChange?.(isNaN(numValue) ? rawValue : numValue);
      }
    }
  };

  return (
    <div className="single-select-enhanced w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          value={value || ""}
          onChange={handleChange}
          disabled={disabled || loading}
          className={`w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 appearance-none cursor-pointer ${error
            ? "border-red-500 ring-2 ring-red-200"
            : "border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-md"
            } ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white"}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {finalOptions.map((option, index) => (
            <option key={index} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {loading && (
          <div className="absolute inset-y-0 right-8 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
          </div>
        )}
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      {helpText && <div className="text-gray-500 text-xs mt-1">{helpText}</div>}
    </div>
  );
}

