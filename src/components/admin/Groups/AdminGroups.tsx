"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Actions from "@/components/ui/Actions";
import Pagination from "@/components/ui/Pagination";
import GroupsFilter from "./GroupsFilter";
import CreateGroup from "./CreateGroup";
import EditGroup from "./EditGroup";
import { useRouter } from "next/navigation";

interface Group {
  id: number;
  type?: string;
  code: string;
  name?: string;
  status?: string;
}

interface AdminGroupsProps {
  title?: string;
  createButtonText?: string;
}

const getTypeLabel = (type?: string): string => {
  const typeMap: Record<string, string> = {
    shop: "Shop",
    team: "Team",
    project: "Project",
    department: "Department",
    organization: "Organization",
  };
  return typeMap[type || ""] || type || "—";
};

export default function AdminGroups({ title = "Quản lý Groups", createButtonText = "Thêm group mới" }: AdminGroupsProps) {
  const router = useRouter();
  const [items, setItems] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [apiErrors, setApiErrors] = useState<Record<string, any>>({});
  const [modals, setModals] = useState({ create: false, edit: false, delete: false });
  const [selectedItem, setSelectedItem] = useState<Group | null>(null);
  const [statusEnums, setStatusEnums] = useState<any[]>([]);
  const { showSuccess, showError } = useToastContext();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, ...filters };
      const response = await api.get(adminEndpoints.groups.list, { params });
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
      showError("Không thể tải danh sách groups");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters, showError]);

  const fetchEnums = useCallback(async () => {
    try {
      const response = await api.get(adminEndpoints.enums.byName("basic_status"));
      if (response.data?.success) {
        setStatusEnums(response.data.data || []);
      } else {
        setStatusEnums([]);
      }
    } catch (e) {
      setStatusEnums([]);
    }
  }, []);

  useEffect(() => {
    fetchEnums();
  }, [fetchEnums]);

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

  const openEditModal = (item: Group) => {
    setSelectedItem(item);
    setModals((prev) => ({ ...prev, edit: true }));
    setApiErrors({});
  };

  const closeEditModal = () => {
    setSelectedItem(null);
    setModals((prev) => ({ ...prev, edit: false }));
    setApiErrors({});
  };

  const confirmDelete = (item: Group) => {
    setSelectedItem(item);
    setModals((prev) => ({ ...prev, delete: true }));
  };

  const closeDeleteModal = () => {
    setSelectedItem(null);
    setModals((prev) => ({ ...prev, delete: false }));
  };

  const handleGroupCreated = async (formData: any) => {
    try {
      await api.post(adminEndpoints.groups.create, formData);
      showSuccess("Group đã được tạo thành công");
      closeCreateModal();
      fetchItems();
    } catch (err: any) {
      const errors = err?.response?.data?.errors || {};
      setApiErrors(errors);
      showError("Không thể tạo group");
    }
  };

  const handleGroupUpdated = async (formData: any) => {
    if (!selectedItem) return;
    try {
      await api.put(adminEndpoints.groups.update(selectedItem.id), formData);
      showSuccess("Group đã được cập nhật thành công");
      closeEditModal();
      fetchItems();
    } catch (err: any) {
      const errors = err?.response?.data?.errors || {};
      setApiErrors(errors);
      showError("Không thể cập nhật group");
    }
  };

  const deleteGroup = async () => {
    if (!selectedItem) return;
    try {
      await api.delete(adminEndpoints.groups.delete(selectedItem.id));
      showSuccess("Group đã được xóa thành công");
      closeDeleteModal();
      fetchItems();
    } catch (err: any) {
      showError("Không thể xóa group");
    }
  };

  const navigateToMembers = (groupId: number) => {
    router.push(`/admin/groups/${groupId}/members`);
  };

  const getStatusLabel = (status?: string): string => {
    const found = statusEnums.find((s) => s.value === status || s.id === status);
    return found?.label || found?.name || status || "Không xác định";
  };

  const getStatusClass = (status?: string): string => {
    const found = statusEnums.find((s) => s.value === status);
    return found?.class || found?.badge_class || found?.color_class || "bg-gray-100 text-gray-800";
  };

  const getSerialNumber = (index: number): number => {
    return (pagination.page - 1) * 10 + index + 1;
  };

  const hasData = items.length > 0;

  return (
    <div className="admin-groups">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button onClick={openCreateModal} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
          {createButtonText}
        </button>
      </div>

      <GroupsFilter initialFilters={filters} statusEnums={statusEnums} onUpdateFilters={handleFilterUpdate} />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={6} />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((group, index) => (
                <tr key={group.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{getTypeLabel(group.type)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <code className="px-2 py-1 bg-gray-100 rounded text-xs">{group.code}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.name || "—"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(group.status)}`}>
                      {getStatusLabel(group.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Actions
                      item={group}
                      showView={false}
                      showDelete={false}
                      onEdit={() => openEditModal(group)}
                      additionalActions={[
                        {
                          label: "Quản lý members",
                          action: () => navigateToMembers(group.id),
                          icon: "users",
                        },
                        {
                          label: "Xóa",
                          action: () => confirmDelete(group),
                          icon: "trash",
                        },
                      ]}
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

      {hasData && <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} totalItems={pagination.totalItems} onPageChange={handlePageChange} />}

      {modals.create && (
        <CreateGroup show={modals.create} apiErrors={apiErrors} onClose={closeCreateModal} onCreated={handleGroupCreated} />
      )}

      {modals.edit && selectedItem && (
        <EditGroup show={modals.edit} group={selectedItem} apiErrors={apiErrors} onClose={closeEditModal} onUpdated={handleGroupUpdated} />
      )}

      {modals.delete && selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa group ${selectedItem.name || selectedItem.code || ""}?`}
          onClose={closeDeleteModal}
          onConfirm={deleteGroup}
        />
      )}
    </div>
  );
}

