"use client";

import AdminFilter from "@/components/admin/Filter/AdminFilter";

interface WarehousesFilterProps {
  initialFilters?: Record<string, any>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function WarehousesFilter({
  initialFilters = {},
  onUpdateFilters,
  onFilterChange,
}: WarehousesFilterProps) {
  const sortOptions = [
    { value: "name:asc", label: "Tên (A-Z)" },
    { value: "name:desc", label: "Tên (Z-A)" },
    { value: "code:asc", label: "Mã (A-Z)" },
    { value: "code:desc", label: "Mã (Z-A)" },
    { value: "priority:desc", label: "Độ ưu tiên (cao nhất)" },
    { value: "priority:asc", label: "Độ ưu tiên (thấp nhất)" },
    { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
    { value: "created_at:asc", label: "Ngày tạo (cũ nhất)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sortBy"
      searchField="search"
      searchPlaceholder="Tìm theo mã, tên kho..."
      hasAdvancedFilters={false}
      onUpdateFilters={onUpdateFilters}
      onFilterChange={onFilterChange}
    />
  );
}


