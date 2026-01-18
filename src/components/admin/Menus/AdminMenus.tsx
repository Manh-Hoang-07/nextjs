"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Actions from "@/components/ui/Actions";
import Pagination from "@/components/ui/Pagination";
import MenusFilter from "./MenusFilter";
import CreateMenu from "./CreateMenu";
import EditMenu from "./EditMenu";

interface Menu {
  id: number;
  code: string;
  name: string;
  path?: string;
  type?: string;
  status?: string;
  icon?: string;
  show_in_menu?: boolean;
  deleted_at?: string;
  parent?: { id: number; name: string };
}

interface AdminMenusProps {
  title?: string;
  createButtonText?: string;
}

const getTypeLabel = (type?: string): string => {
  const typeMap: Record<string, string> = {
    route: "Route",
    group: "Group",
    link: "Link",
  };
  return typeMap[type || ""] || type || "—";
};

export default function AdminMenus({ title = "Quản lý menu", createButtonText = "Thêm menu mới" }: AdminMenusProps) {
  const [items, setItems] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [apiErrors, setApiErrors] = useState<Record<string, any>>({});
  const [modals, setModals] = useState({ create: false, edit: false, delete: false });
  const [selectedItem, setSelectedItem] = useState<Menu | null>(null);
  const [statusEnums, setStatusEnums] = useState<any[]>([]);
  const [parentMenus, setParentMenus] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const { showSuccess, showError } = useToastContext();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, ...filters };
      const response = await api.get(adminEndpoints.menus.list, { params });
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
      showError("Không thể tải danh sách menu");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters, showError]);

  const fetchEnums = useCallback(async () => {
    try {
      setStatusEnums([
        { value: "active", label: "Hoạt động" },
        { value: "inactive", label: "Ngừng hoạt động" },
      ]);
    } catch (e) {
      setStatusEnums([]);
    }

    try {
      const response = await api.get(adminEndpoints.menus.tree);
      if (response.data?.success) {
        setParentMenus(response.data.data || []);
      } else {
        setParentMenus(response.data?.data || response.data || []);
      }
    } catch (e) {
      setParentMenus([]);
    }

    try {
      const response = await api.get(adminEndpoints.permissions.list);
      if (response.data?.success) {
        setPermissions(response.data.data || []);
      } else {
        const data = response.data?.data || response.data || [];
        setPermissions(Array.isArray(data) ? data : data.items || data.data || []);
      }
    } catch (e) {
      setPermissions([]);
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

  const openEditModal = (item: Menu) => {
    setSelectedItem(item);
    setModals((prev) => ({ ...prev, edit: true }));
    setApiErrors({});
  };

  const closeEditModal = () => {
    setSelectedItem(null);
    setModals((prev) => ({ ...prev, edit: false }));
    setApiErrors({});
  };

  const confirmDelete = (item: Menu) => {
    setSelectedItem(item);
    setModals((prev) => ({ ...prev, delete: true }));
  };

  const closeDeleteModal = () => {
    setSelectedItem(null);
    setModals((prev) => ({ ...prev, delete: false }));
  };

  const handleMenuCreated = async (formData: any) => {
    try {
      await api.post(adminEndpoints.menus.create, formData);
      showSuccess("Menu đã được tạo thành công");
      closeCreateModal();
      fetchItems();
      fetchEnums(); // Refresh parent menus
    } catch (err: any) {
      const errors = err?.response?.data?.errors || {};
      setApiErrors(errors);
      showError("Không thể tạo menu");
    }
  };

  const handleMenuUpdated = async (formData: any) => {
    if (!selectedItem) return;
    try {
      await api.put(adminEndpoints.menus.update(selectedItem.id), formData);
      showSuccess("Menu đã được cập nhật thành công");
      closeEditModal();
      fetchItems();
      fetchEnums(); // Refresh parent menus
    } catch (err: any) {
      const errors = err?.response?.data?.errors || {};
      setApiErrors(errors);
      showError("Không thể cập nhật menu");
    }
  };

  const deleteMenu = async () => {
    if (!selectedItem) return;
    try {
      await api.delete(adminEndpoints.menus.delete(selectedItem.id));
      showSuccess("Menu đã được xóa thành công");
      closeDeleteModal();
      fetchItems();
    } catch (err: any) {
      showError("Không thể xóa menu");
    }
  };

  const restoreMenu = async (menu: Menu) => {
    try {
      const response = await api.put(adminEndpoints.menus.restore(menu.id));
      if (response.data?.success) {
        showSuccess("Menu đã được khôi phục thành công");
        fetchItems();
      } else {
        showError("Không thể khôi phục menu");
      }
    } catch (error) {
      showError("Không thể khôi phục menu");
    }
  };

  const getStatusLabel = (status?: string): string => {
    const found = statusEnums.find((s) => s.value === status);
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
    <div className="admin-menus">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button onClick={openCreateModal} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
          {createButtonText}
        </button>
      </div>

      <MenusFilter initialFilters={filters} statusEnums={statusEnums} parentMenus={parentMenus} onUpdateFilters={handleFilterUpdate} />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={6} />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((menu, index) => (
                <tr key={menu.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-lg">{menu.icon || "📋"}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{menu.name}</div>
                        <div className="text-sm text-gray-500">{menu.code}</div>
                        {menu.parent && <div className="text-xs text-gray-400">Cha: {menu.parent.name}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="max-w-xs truncate" title={menu.path || "—"}>
                      {menu.path || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{getTypeLabel(menu.type)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(menu.status)}`}>
                        {getStatusLabel(menu.status)}
                      </span>
                      {!menu.show_in_menu && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Ẩn trong menu</span>
                      )}
                      {menu.deleted_at && <div className="text-xs text-red-600">Đã xóa</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Actions
                      item={menu}
                      showView={false}
                      showDelete={false}
                      onEdit={() => openEditModal(menu)}
                      additionalActions={[
                        {
                          label: menu.deleted_at ? "Khôi phục" : "Xóa",
                          action: () => (menu.deleted_at ? restoreMenu(menu) : confirmDelete(menu)),
                          icon: menu.deleted_at ? "refresh" : "trash",
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
        <CreateMenu
          show={modals.create}
          statusEnums={statusEnums}
          parentMenus={parentMenus}
          permissions={permissions}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleMenuCreated}
        />
      )}

      {modals.edit && selectedItem && (
        <EditMenu
          show={modals.edit}
          menu={selectedItem}
          statusEnums={statusEnums}
          parentMenus={parentMenus}
          permissions={permissions}
          apiErrors={apiErrors}
          onClose={closeEditModal}
          onUpdated={handleMenuUpdated}
        />
      )}

      {modals.delete && selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa menu ${selectedItem.name || ""}?`}
          onClose={closeDeleteModal}
          onConfirm={deleteMenu}
        />
      )}
    </div>
  );
}

