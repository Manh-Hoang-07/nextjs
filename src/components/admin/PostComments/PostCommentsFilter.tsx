import { useMemo } from "react";
import AdminFilter from "@/components/admin/Filter/AdminFilter";
import SelectFilter from "@/components/ui/filters/SelectFilter";

interface PostCommentsFilterProps {
    initialFilters: any;
    onUpdateFilters: (filters: any) => void;
}

export default function PostCommentsFilter({
    initialFilters,
    onUpdateFilters,
}: PostCommentsFilterProps) {
    const statusOptions = [
        { value: "", label: "Tất cả trạng thái" },
        { value: "visible", label: "Công khai" },
        { value: "hidden", label: "Đang ẩn" },
    ];

    const sortOptions = [
        { value: "created_at:desc", label: "Mới nhất" },
        { value: "created_at:asc", label: "Cũ nhất" },
    ];

    return (
        <AdminFilter
            initialFilters={initialFilters}
            sortOptions={sortOptions}
            sortField="sort"
            searchField="search"
            searchPlaceholder="Tìm kiếm nội dung, người gửi..."
            onUpdateFilters={onUpdateFilters}
            hasAdvancedFilters={true}
            advancedFilters={({ filters, onChange }) => (
                <div className="flex gap-4">
                    <div className="w-full md:w-48">
                        <SelectFilter
                            value={filters["status"] || ""}
                            options={statusOptions}
                            placeholder="Trạng thái"
                            onChange={(value) => {
                                filters["status"] = value;
                                onChange();
                            }}
                        />
                    </div>
                </div>
            )}
        />
    );
}
