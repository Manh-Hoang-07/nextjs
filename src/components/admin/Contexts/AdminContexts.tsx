"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Actions from "@/components/ui/Actions";
import Pagination from "@/components/ui/Pagination";
import ContextsFilter from "./ContextsFilter";
import CreateContext from "./CreateContext";
import EditContext from "./EditContext";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

const getTypeLabel = (value: string): string => {
  const labels: Record<string, string> = {
    system: "System",
    shop: "Shop",
    team: "Team",
    project: "Project",
    department: "Department",
    organization: "Organization",
  };
  return labels[value] || value;
};

const getStatusLabel = (value: string): string => {
  const status = getBasicStatusArray().find((s) => s.value === value);
  return status?.label || value;
};

const getStatusClass = (value: string): string => {
  const classes: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
  };
  return classes[value] || "bg-gray-100 text-gray-800";
};

interface Context {
  id: number;
  type?: string;
  code?: string;
  name?: string;
  status?: string;
}

interface AdminContextsProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminContexts({
  title = "Quản lý contexts",
  createButtonText = "Thêm context mới",
}: AdminContextsProps) {
  const [items, setItems] = useState<Context[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [apiErrors, setApiErrors] = useState<Record<string, any>>({});
  const [modals, setModals] = useState({
    create: false,
    edit: false,
    delete: false,
  });
  const [selectedItem, setSelectedItem] = useState<Context | null>(null);
  const [statusEnums, setStatusEnums] = useState<Array<{ value: string; label?: string; name?: string }>>([]);
  const { showSuccess, showError } = useToastContext();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        ...filters,
      };

      const response = await api.get(adminEndpoints.contexts.list, { params });
      const data = response.data?.data || response.data || {};

      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems(data.items || data.data || []);
        if (data.pagination) {
          setPagination({
            page: data.pagination.page || 1,
            totalPages: data.pagination.totalPages || 1,
            totalItems: data.pagination.totalItems || 0,
          });
        }
      }
      setApiErrors({});
    } catch (err: any) {
      showError("Không thể tải danh sách");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters, showError]);

  useEffect(() => {
    setStatusEnums(getBasicStatusArray());
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleFilterUpdate = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const openCreateModal = () => {
    setModals((prev) => ({ ...prev, create: true }));
    setApiErrors({});
  };

  const closeCreateModal = () => {
    setModals((prev) => ({ ...prev, create: false }));
    setApiErrors({});
  };

  const openEditModal = async (item: Context) => {
    try {
      const response = await api.get(adminEndpoints.contexts.show(item.id));
      const data = response.data?.data || response.data;
      setSelectedItem(data);
      setModals((prev) => ({ ...prev, edit: true }));
      setApiErrors({});
    } catch (err: any) {
      showError("Không thể tải thông tin chi tiết");
      setSelectedItem(item);
      setModals((prev) => ({ ...prev, edit: true }));
    }
  };

  const closeEditModal = () => {
    setSelectedItem(null);
    setModals((prev) => ({ ...prev, edit: false }));
    setApiErrors({});
  };

  const confirmDelete = (item: Context) => {
    setSelectedItem(item);
    setModals((prev) => ({ ...prev, delete: true }));
  };

  const closeDeleteModal = () => {
    setSelectedItem(null);
    setModals((prev) => ({ ...prev, delete: false }));
  };

  const handleCreated = async (formData: any) => {
    try {
      await api.post(adminEndpoints.contexts.create, formData);
      showSuccess("Đã tạo thành công");
      closeCreateModal();
      fetchItems();
    } catch (err: any) {
      const errors = err?.response?.data?.errors || {};
      setApiErrors(errors);
      showError("Có lỗi xảy ra khi tạo mới");
    }
  };

  const handleUpdated = async (formData: any) => {
    if (!selectedItem) return;

    try {
      await api.put(adminEndpoints.contexts.update(selectedItem.id), formData);
      showSuccess("Đã cập nhật thành công");
      closeEditModal();
      fetchItems();
    } catch (err: any) {
      const errors = err?.response?.data?.errors || {};
      setApiErrors(errors);
      showError("Có lỗi xảy ra khi cập nhật");
    }
  };

  const deleteContext = async () => {
    if (!selectedItem) return;

    try {
      await api.delete(adminEndpoints.contexts.delete(selectedItem.id));
      showSuccess("Đã xóa thành công");
      closeDeleteModal();
      fetchItems();
    } catch (err: any) {
      showError("Không thể xóa");
    }
  };

  const getSerialNumber = (index: number): number => {
    return (pagination.page - 1) * 10 + index + 1;
  };

  const hasData = items.length > 0;

  return (
    <div className="admin-contexts">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <ContextsFilter
        initialFilters={filters}
        statusEnums={statusEnums}
        onUpdateFilters={handleFilterUpdate}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={6} />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((context, index) => (
                <tr key={context.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getSerialNumber(index)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <code className="px-2 py-1 bg-gray-100 rounded text-xs">{context.id}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getTypeLabel(context.type || "")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{context.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        context.status || ""
                      )}`}
                    >
                      {getStatusLabel(context.status || "")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Actions
                      item={context}
                      onEdit={() => openEditModal(context)}
                      onDelete={() => confirmDelete(context)}
                    />
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {hasData && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          onPageChange={handlePageChange}
        />
      )}

      {modals.create && (
        <CreateContext
          show={modals.create}
          statusEnums={statusEnums}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreated}
        />
      )}

      {modals.edit && selectedItem && (
        <EditContext
          show={modals.edit}
          context={selectedItem}
          statusEnums={statusEnums}
          apiErrors={apiErrors}
          onClose={closeEditModal}
          onUpdated={handleUpdated}
        />
      )}

      {modals.delete && selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa context ${selectedItem.name || ""}?`}
          onClose={closeDeleteModal}
          onConfirm={deleteContext}
        />
      )}
    </div>
  );
}

