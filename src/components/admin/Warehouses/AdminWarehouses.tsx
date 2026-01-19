"use client";

import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/ui/feedback/SkeletonLoader";
import ConfirmModal from "@/components/ui/feedback/ConfirmModal";
import Actions from "@/components/ui/data-display/Actions";
import Pagination from "@/components/ui/data-display/Pagination";
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
  const {
    items,
    loading,
    pagination,
    filters,
    apiErrors,
    modals,
    selectedItem,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    updateFilters,
    changePage,
    handleCreate,
    handleUpdate,
    handleDelete,
    getSerialNumber,
    hasData,
  } = useAdminListPage({
    endpoints: {
      list: adminEndpoints.warehouses.list,
      create: adminEndpoints.warehouses.create,
      update: (id) => adminEndpoints.warehouses.update(id),
      delete: (id) => adminEndpoints.warehouses.delete(id),
      show: (id) => adminEndpoints.warehouses.show(id),
    },
    messages: {
      createSuccess: "Kho hàng đã được tạo thành công",
      updateSuccess: "Kho hàng đã được cập nhật thành công",
      deleteSuccess: "Kho hàng đã được xóa thành công",
    },
    fetchDetailBeforeEdit: true,
  });

  const viewInventory = (warehouse: Warehouse) => {
    router.push(`/admin/warehouses/${warehouse.id}/inventory`);
  };

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

      <WarehousesFilter initialFilters={filters} onUpdateFilters={updateFilters} />

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
                {items.map((warehouse: Warehouse, index) => (
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
                            action: () => openDeleteModal(warehouse),
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
          onPageChange={changePage}
        />
      )}

      {modals.create && (
        <CreateWarehouse show={modals.create} apiErrors={apiErrors} onClose={closeCreateModal} onCreated={handleCreate} />
      )}

      {modals.edit && selectedItem && (
        <EditWarehouse show={modals.edit} warehouse={selectedItem} apiErrors={apiErrors} onClose={closeEditModal} onUpdated={(data) => handleUpdate(selectedItem.id, data)} />
      )}

      {selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa kho ${(selectedItem as Warehouse).name || ""}?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}
    </div>
  );
}
