"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Actions from "@/components/ui/Actions";
import Pagination from "@/components/ui/Pagination";
import WarehousesFilter from "./WarehousesFilter";
import CreateWarehouse from "./CreateWarehouse";
import EditWarehouse from "./EditWarehouse";
import { useRouter } from "next/navigation";

interface Warehouse {
  id: number;
  code: string;
  name: string;
  address?: string;
  city?: string;
  district?: string;
  phone?: string;
  manager_name?: string;
  priority?: number;
  is_active?: boolean;
}

interface AdminWarehousesProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminWarehouses({
  title = "Quản lý kho hàng",
  createButtonText = "Thêm kho mới",
}: AdminWarehousesProps) {
  const router = useRouter();
  const [items, setItems] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [apiErrors, setApiErrors] = useState<Record<string, any>>({});
  const [modals, setModals] = useState({ create: false, edit: false, delete: false });
  const [selectedItem, setSelectedItem] = useState<Warehouse | null>(null);
  const { showSuccess, showError } = useToastContext();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, ...filters };
      const response = await api.get(adminEndpoints.warehouses.list, { params });
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
      showError("Không thể tải danh sách kho hàng");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters, showError]);

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

  const openEditModal = (item: Warehouse) => {
    setSelectedItem(item);
    setModals((prev) => ({ ...prev, edit: true }));
    setApiErrors({});
  };

  const closeEditModal = () => {
    setSelectedItem(null);
    setModals((prev) => ({ ...prev, edit: false }));
    setApiErrors({});
  };

  const confirmDelete = (item: Warehouse) => {
    setSelectedItem(item);
    setModals((prev) => ({ ...prev, delete: true }));
  };

  const closeDeleteModal = () => {
    setSelectedItem(null);
    setModals((prev) => ({ ...prev, delete: false }));
  };

  const handleWarehouseCreated = async (formData: any) => {
    try {
      await api.post(adminEndpoints.warehouses.create, formData);
      showSuccess("Kho hàng đã được tạo thành công");
      closeCreateModal();
      fetchItems();
    } catch (err: any) {
      const errors = err?.response?.data?.errors || {};
      setApiErrors(errors);
      showError("Không thể tạo kho hàng");
    }
  };

  const handleWarehouseUpdated = async (formData: any) => {
    if (!selectedItem) return;
    try {
      await api.put(adminEndpoints.warehouses.update(selectedItem.id), formData);
      showSuccess("Kho hàng đã được cập nhật thành công");
      closeEditModal();
      fetchItems();
    } catch (err: any) {
      const errors = err?.response?.data?.errors || {};
      setApiErrors(errors);
      showError("Không thể cập nhật kho hàng");
    }
  };

  const deleteWarehouse = async () => {
    if (!selectedItem) return;
    try {
      await api.delete(adminEndpoints.warehouses.delete(selectedItem.id));
      showSuccess("Kho hàng đã được xóa thành công");
      closeDeleteModal();
      fetchItems();
    } catch (err: any) {
      showError("Không thể xóa kho hàng");
    }
  };

  const viewInventory = (warehouse: Warehouse) => {
    router.push(`/admin/warehouses/${warehouse.id}/inventory`);
  };

  const getSerialNumber = (index: number): number => {
    return (pagination.page - 1) * 10 + index + 1;
  };

  const hasData = items.length > 0;

  return (
    <div className="admin-warehouses">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <WarehousesFilter initialFilters={filters} onUpdateFilters={handleFilterUpdate} />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={8} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã kho</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên kho</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người quản lý</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Độ ưu tiên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((warehouse, index) => (
                  <tr key={warehouse.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">{warehouse.code}</code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{warehouse.name}</div>
                      {(warehouse.city || warehouse.district) && (
                        <div className="text-sm text-gray-500">
                          {[warehouse.city, warehouse.district].filter(Boolean).join(", ")}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{warehouse.address || "—"}</div>
                      {warehouse.phone && <div className="text-sm text-gray-500">{warehouse.phone}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warehouse.manager_name || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warehouse.priority || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${warehouse.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {warehouse.is_active ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Actions
                        item={warehouse}
                        showView={false}
                        showDelete={false}
                        onEdit={() => openEditModal(warehouse)}
                        additionalActions={[
                          {
                            label: "Xem tồn kho",
                            action: () => viewInventory(warehouse),
                            icon: "box",
                          },
                          {
                            label: "Xóa",
                            action: () => confirmDelete(warehouse),
                            icon: "trash",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
        <CreateWarehouse show={modals.create} apiErrors={apiErrors} onClose={closeCreateModal} onCreated={handleWarehouseCreated} />
      )}

      {modals.edit && selectedItem && (
        <EditWarehouse show={modals.edit} warehouse={selectedItem} apiErrors={apiErrors} onClose={closeEditModal} onUpdated={handleWarehouseUpdated} />
      )}

      {modals.delete && selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa kho ${selectedItem.name || ""}?`}
          onClose={closeDeleteModal}
          onConfirm={deleteWarehouse}
        />
      )}
    </div>
  );
}

