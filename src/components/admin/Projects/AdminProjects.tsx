"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Actions from "@/components/ui/Actions";
import Pagination from "@/components/ui/Pagination";
import ProjectsFilter from "./ProjectsFilter";
import CreateProject from "./CreateProject";
import EditProject from "./EditProject";

const getProjectStatusArray = () => [
  { value: "planning", label: "Đang lập kế hoạch" },
  { value: "in_progress", label: "Đang thực hiện" },
  { value: "completed", label: "Hoàn thành" },
  { value: "on_hold", label: "Tạm dừng" },
  { value: "cancelled", label: "Đã hủy" },
];

const getProjectStatusLabel = (value: string): string => {
  const status = getProjectStatusArray().find((s) => s.value === value);
  return status?.label || value;
};

const getProjectStatusClass = (value: string): string => {
  const classes: Record<string, string> = {
    planning: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    on_hold: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return classes[value] || "bg-gray-100 text-gray-800";
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("vi-VN");
};

interface Project {
  id: number;
  name: string;
  location?: string;
  status?: string;
  featured?: boolean;
  created_at?: string;
}

interface AdminProjectsProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminProjects({
  title = "Quản lý dự án",
  createButtonText = "Thêm dự án mới",
}: AdminProjectsProps) {
  const [items, setItems] = useState<Project[]>([]);
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
  const [selectedItem, setSelectedItem] = useState<Project | null>(null);
  const [statusEnums, setStatusEnums] = useState<Array<{ value: string; label?: string; name?: string }>>([]);
  const { showSuccess, showError } = useToastContext();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        ...filters,
      };

      const response = await api.get(adminEndpoints.projects.list, { params });
      const result = response.data;

      if (result.success) {
        setItems(result.data || []);
        const meta = result.meta || result.pagination;
        if (meta) {
          setPagination({
            page: meta.page || 1,
            totalPages: meta.totalPages || 1,
            totalItems: meta.totalItems || 0,
          });
        }
      } else {
        setItems([]);
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
    setStatusEnums(getProjectStatusArray());
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

  const openEditModal = async (item: Project) => {
    try {
      const response = await api.get(adminEndpoints.projects.show(item.id));
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

  const confirmDelete = (item: Project) => {
    setSelectedItem(item);
    setModals((prev) => ({ ...prev, delete: true }));
  };

  const closeDeleteModal = () => {
    setSelectedItem(null);
    setModals((prev) => ({ ...prev, delete: false }));
  };

  const handleCreated = async (formData: any) => {
    try {
      await api.post(adminEndpoints.projects.create, formData);
      showSuccess("Dự án đã được tạo thành công");
      closeCreateModal();
      fetchItems();
    } catch (err: any) {
      const errors = err?.response?.data?.errors || {};
      setApiErrors(errors);
      showError("Không thể tạo dự án");
    }
  };

  const handleUpdated = async (formData: any) => {
    if (!selectedItem) return;

    try {
      await api.put(adminEndpoints.projects.update(selectedItem.id), formData);
      showSuccess("Dự án đã được cập nhật thành công");
      closeEditModal();
      fetchItems();
    } catch (err: any) {
      const errors = err?.response?.data?.errors || {};
      setApiErrors(errors);
      showError("Không thể cập nhật dự án");
    }
  };

  const deleteProject = async () => {
    if (!selectedItem) return;

    try {
      await api.delete(adminEndpoints.projects.delete(selectedItem.id));
      showSuccess("Dự án đã được xóa thành công");
      closeDeleteModal();
      fetchItems();
    } catch (err: any) {
      showError("Không thể xóa dự án");
    }
  };

  const getSerialNumber = (index: number): number => {
    return (pagination.page - 1) * 10 + index + 1;
  };

  const hasData = items.length > 0;

  return (
    <div className="admin-projects">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <ProjectsFilter
        initialFilters={filters}
        statusEnums={statusEnums}
        onUpdateFilters={handleFilterUpdate}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={8} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên dự án
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Địa điểm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nổi bật
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((project, index) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getSerialNumber(index)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{project.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.location || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getProjectStatusClass(
                          project.status || ""
                        )}`}
                      >
                        {getProjectStatusLabel(project.status || "")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.featured ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Nổi bật
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(project.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Actions
                        item={project}
                        showView={false}
                        showDelete={false}
                        onEdit={() => openEditModal(project)}
                        additionalActions={[
                          {
                            label: project.featured ? "Bỏ nổi bật" : "Đánh dấu nổi bật",
                            action: () => { },
                            icon: "star",
                          },
                          {
                            label: "Xóa",
                            action: () => confirmDelete(project),
                            icon: "trash",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
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
        <CreateProject
          show={modals.create}
          statusEnums={statusEnums}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreated}
        />
      )}

      {modals.edit && selectedItem && (
        <EditProject
          show={modals.edit}
          project={selectedItem}
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
          message={`Bạn có chắc chắn muốn xóa dự án ${selectedItem.name || ""}?`}
          onClose={closeDeleteModal}
          onConfirm={deleteProject}
        />
      )}
    </div>
  );
}


