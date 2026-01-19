"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import api from "@/lib/api/client";
import { debounce } from "@/utils/debounce";

interface Option {
  value: string | number;
  label: string;
}

interface SearchableSelectProps {
  value?: string | number | null;
  placeholder?: string;
  searchApi: string;
  disabled?: boolean;
  error?: string | string[];
  minSearchLength?: number;
  excludeId?: string | number | null;
  labelField?: string;
  onChange?: (value: string | number | null) => void;
}

export default function SearchableSelect({
  value,
  placeholder = "Tìm kiếm...",
  searchApi,
  disabled = false,
  error,
  minSearchLength = 2,
  excludeId,
  labelField = "title",
  onChange,
}: SearchableSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getLabel = useCallback((option: any): string => {
    if (labelField && option[labelField]) {
      return option[labelField];
    }
    if (labelField === "display_name") {
      return option.display_name || option.name || option.title || option.label || "Không có tên";
    }
    return option.title || option.name || option.label || "Không có tên";
  }, [labelField]);

  const displayValue = useMemo(() => {
    if (isInteracting || searchQuery.length > 0) {
      return searchQuery;
    }
    if (selectedOption) {
      return selectedOption.label;
    }
    return "";
  }, [isInteracting, searchQuery, selectedOption]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) {
      return options.slice(0, 10);
    }
    return options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, options]);

  const loadDefaultOptions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`${searchApi}?limit=50`);
      const allOptions = response.data?.data || [];

      let transformedOptions: Option[] = allOptions.map((option: any) => ({
        value: option.id,
        label: getLabel(option),
      }));

      if (excludeId) {
        transformedOptions = transformedOptions.filter((option) => option.value != excludeId);
      }

      if (transformedOptions.length <= 50) {
        setOptions(transformedOptions);
      } else {
        setOptions(transformedOptions.slice(0, 50));
      }
    } catch (error) {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [searchApi, excludeId, getLabel]);

  const debouncedSearch = debounce(async () => {
    if (searchQuery.length < minSearchLength) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`${searchApi}?search=${encodeURIComponent(searchQuery)}&limit=50`);
      const searchResults = response.data?.data || [];

      let transformedResults: Option[] = searchResults.map((option: any) => ({
        value: option.id,
        label: getLabel(option),
      }));

      if (excludeId) {
        transformedResults = transformedResults.filter((option) => option.value != excludeId);
      }

      setOptions(transformedResults);
    } catch (error) {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);

    if (selectedOption) {
      setSelectedOption(null);
      onChange?.(null);
    }

    if (newQuery.length >= minSearchLength) {
      debouncedSearch();
    } else {
      setOptions([]);
    }
  };

  const handleFocus = async () => {
    setIsInteracting(true);
    setShowDropdown(true);
    await loadDefaultOptions();
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
      setIsInteracting(false);
      if (!selectedOption && searchQuery === "") {
        onChange?.(null);
      }
    }, 200);
  };

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchQuery.length === 0 && selectedOption) {
      clearSelection();
      setShowDropdown(true);
    }
  };

  const selectOption = (option: Option) => {
    setSelectedOption(option);
    setSearchQuery("");
    setShowDropdown(false);
    onChange?.(option.value);
  };

  const clearSelection = () => {
    setSelectedOption(null);
    setSearchQuery("");
    setShowDropdown(false);
    onChange?.(null);
  };

  useEffect(() => {
    if (value && !selectedOption) {
      const found = options.find((opt) => opt.value == value);
      if (found) {
        setSelectedOption(found);
      } else {
        // Fetch from API
        api
          .get(`${searchApi}?ids=${value}`)
          .then((response) => {
            const data = response.data?.data || [];
            const filtered = data.filter((option: any) => option.id == value);
            if (filtered.length > 0) {
              const option = filtered[0];
              setSelectedOption({
                value: option.id,
                label: getLabel(option),
              });
            }
          })
          .catch(() => { });
      }
    } else if (!value) {
      setSelectedOption(null);
    }
  }, [value, options, searchApi, selectedOption, getLabel]);

  useEffect(() => {
    if (value) {
      api
        .get(`${searchApi}?limit=100`)
        .then((response) => {
          const allOptions = response.data?.data || [];
          const transformed: Option[] = allOptions.map((option: any) => ({
            value: option.id,
            label: getLabel(option),
          }));
          setOptions(transformed);
          const found = transformed.find((opt) => opt.value == value);
          if (found) {
            setSelectedOption(found);
          }
        })
        .catch(() => { });
    } else {
      loadDefaultOptions();
    }
  }, [value, searchApi, getLabel, loadDefaultOptions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div ref={containerRef} className="searchable-select relative">
      <input
        value={displayValue}
        onChange={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleBackspace}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
      />

      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      )}

      {showDropdown && (filteredOptions.length > 0 || searchQuery.length > 0 || selectedOption) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {selectedOption && (
            <div onClick={clearSelection} className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 text-gray-500">
              ✕ Xóa lựa chọn
            </div>
          )}

          {filteredOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => selectOption(option)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              {option.label}
            </div>
          ))}

          {searchQuery.length > 0 && filteredOptions.length === 0 && !loading && (
            <div className="px-3 py-2 text-gray-500">Không tìm thấy kết quả</div>
          )}

          {!searchQuery && options.length > 50 && (
            <div className="px-3 py-2 text-sm text-gray-500 bg-gray-50 border-t">
              Hiển thị 50 items đầu tiên. Vui lòng tìm kiếm để xem thêm.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

