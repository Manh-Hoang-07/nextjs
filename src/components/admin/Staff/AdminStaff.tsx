"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Actions from "@/components/ui/Actions";
import Pagination from "@/components/ui/Pagination";
import StaffFilter from "./StaffFilter";
import CreateStaff from "./CreateStaff";
import EditStaff from "./EditStaff";

interface Staff {
  id: number;
  name: string;
  position: string;
  department?: string;
  email?: string;
  phone?: string;
  status?: string;
  sort_order?: number;
}

interface AdminStaffProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminStaff({
  title = "Quản lý nhân viên",
  createButtonText = "Thêm nhân viên mới",
}: AdminStaffProps) {
  const [items, setItems] = useState<Staff[]>([]);
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
  const [selectedItem, setSelectedItem] = useState<Staff | null>(null);
  const { showSuccess, showError } = useToastContext();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        ...filters,
      };

      const response = await api.get(adminEndpoints.staff.list, { params });
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

  const openEditModal = async (item: Staff) => {
    try {
      const response = await api.get(adminEndpoints.staff.show(item.id));
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

  const confirmDelete = (item: Staff) => {
    setSelectedItem(item);
    setModals((prev) => ({ ...prev, delete: true }));
  };

  const closeDeleteModal = () => {
    setSelectedItem(null);
    setModals((prev) => ({ ...prev, delete: false }));
  };

  const handleCreated = async (formData: any) => {
    try {
      await api.post(adminEndpoints.staff.create, formData);
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
      await api.put(adminEndpoints.staff.update(selectedItem.id), formData);
      showSuccess("Đã cập nhật thành công");
      closeEditModal();
      fetchItems();
    } catch (err: any) {
      const errors = err?.response?.data?.errors || {};
      setApiErrors(errors);
      showError("Có lỗi xảy ra khi cập nhật");
    }
  };

  const deleteItem = async () => {
    if (!selectedItem) return;

    try {
      await api.delete(adminEndpoints.staff.delete(selectedItem.id));
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
    <div className="admin-staff">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <StaffFilter
        initialFilters={filters}
        onUpdateFilters={handleFilterUpdate}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={8} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Chức vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phòng ban
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thứ tự
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {getSerialNumber(index)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.position}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.department || "-"}</td>
                    <td className="px-6 py-4 text-sm">
                      {item.email ? (
                        <a
                          href={`mailto:${item.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {item.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.status === "active" ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.sort_order ?? 0}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Actions
                        item={item}
                        onEdit={() => openEditModal(item)}
                        showView={false}
                        showDelete={false}
                        additionalActions={[
                          {
                            label: "Xóa",
                            action: () => confirmDelete(item),
                            icon: "trash",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
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
        <CreateStaff
          show={modals.create}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreated}
        />
      )}

      {modals.edit && selectedItem && (
        <EditStaff
          show={modals.edit}
          staff={selectedItem}
          apiErrors={apiErrors}
          onClose={closeEditModal}
          onUpdated={handleUpdated}
        />
      )}

      {modals.delete && selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa ${selectedItem.name || ""}?`}
          onClose={closeDeleteModal}
          onConfirm={deleteItem}
        />
      )}
    </div>
  );
}


