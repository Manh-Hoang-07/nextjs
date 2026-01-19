"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Modal from "@/components/ui/feedback/Modal";
import FormWrapper from "@/components/ui/forms/FormWrapper";
import MultipleSelect from "@/components/ui/forms/MultipleSelect";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface AssignRoleProps {
  show: boolean;
  user?: any;
  onRoleAssigned?: () => void;
  onClose?: () => void;
}

export default function AssignRole({
  show,
  user,
  onRoleAssigned,
  onClose,
}: AssignRoleProps) {
  const [showModal, setShowModal] = useState(false);
  const [userDetail, setUserDetail] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fetchUserDetail = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await api.get(adminEndpoints.users.show(user.id));
      if (response.data?.success && response.data?.data) {
        setUserDetail(response.data.data);
      } else {
        setUserDetail(user || {});
      }
    } catch (error) {
      setUserDetail(user || {});
    }
  }, [user]);

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(adminEndpoints.roles.simple || `${adminEndpoints.roles.list}?limit=1000`);
      if (response.data?.success) {
        setRoles(response.data.data || []);
      } else {
        const fallbackResponse = await api.get(`${adminEndpoints.roles.list}?limit=1000`);
        if (fallbackResponse.data?.success) {
          setRoles(fallbackResponse.data.data || []);
        } else {
          const data = fallbackResponse.data?.data || fallbackResponse.data || [];
          setRoles(Array.isArray(data) ? data : data.items || data.data || []);
        }
      }
    } catch (error) {
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setShowModal(show);
    if (show && user?.id) {
      Promise.all([fetchUserDetail(), loadRoles()]);
    } else if (!show) {
      setApiErrors({});
      setUserDetail(null);
    }
  }, [show, user?.id, fetchUserDetail, loadRoles]);

  const defaultValues = useMemo(() => {
    const obj = userDetail || {};
    let roleIds: any[] = [];

    // Ưu tiên lấy từ user_role_assignments
    if (obj.user_role_assignments && Array.isArray(obj.user_role_assignments)) {
      roleIds = obj.user_role_assignments
        .map((assignment: any) => {
          const roleId = assignment.role_id || assignment.role?.id;
          return typeof roleId === "string" ? parseInt(roleId, 10) : Number(roleId);
        })
        .filter((id: any) => !isNaN(id) && id !== null && id !== undefined);
    }
    // Fallback: lấy từ roles
    else if (obj.roles && Array.isArray(obj.roles)) {
      roleIds = obj.roles
        .map((role: any) => {
          const id = role.id;
          return typeof id === "string" ? parseInt(id, 10) : Number(id);
        })
        .filter((id: any) => !isNaN(id) && id !== null && id !== undefined);
    }

    return {
      role_ids: roleIds,
    };
  }, [userDetail]);


  const roleOptions = useMemo(() => {
    return (roles || [])
      .map((opt: any) => {
        const id: number = typeof opt.id === "string" ? parseInt(opt.id, 10) : Number(opt.id);
        return {
          value: id,
          label: opt.name || opt.label || String(id),
        };
      })
      .filter((opt: any) => !isNaN(opt.value));
  }, [roles]);

  const resetErrors = () => {
    setApiErrors({});
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!user?.id) return;

    resetErrors();

    try {
      const dataToSubmit: any = {
        role_ids: Array.isArray(formData.role_ids) ? formData.role_ids : [formData.role_ids].filter(Boolean),
      };

      await api.put(adminEndpoints.users.assignRoles(user.id), dataToSubmit);
      onRoleAssigned?.();
      onClose?.();
    } catch (error: any) {
      const payload = error?.response?.data;
      if (payload?.errors) {
        const errors: Record<string, string> = {};
        Object.keys(payload.errors).forEach((field) => {
          const value = payload.errors[field];
          errors[field] = Array.isArray(value) ? value[0] : value;
        });
        setApiErrors(errors);
      } else if (Array.isArray(payload?.message) && payload.message.length) {
        setApiErrors({ role_ids: payload.message.join(", ") });
      } else if (typeof payload?.message === "string") {
        setApiErrors({ role_ids: payload.message });
      }
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  if (!showModal) return null;

  return (
    <Modal show={show} onClose={handleClose} title="Phân quyền người dùng" size="lg">
      <div className="space-y-6">
        <header className="border-b border-gray-200 pb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Phân quyền</h3>
            <p className="text-sm text-gray-500">Chọn vai trò áp dụng cho người dùng</p>
          </div>
        </header>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              <span className="font-medium">Tên:</span> {userDetail?.name || userDetail?.username || "N/A"}
            </div>
            <div>
              <span className="font-medium">Email:</span> {userDetail?.email || "N/A"}
            </div>
          </div>
        </div>

        <FormWrapper
          defaultValues={defaultValues}
          apiErrors={apiErrors}
          submitText="Cập nhật quyền"
          onSubmit={handleSubmit}
          onCancel={handleClose}
        >
          {({ form, errors, clearError }: any) => (
            <MultipleSelect
              value={form.role_ids || []}
              onChange={(value: Array<string | number>) => {
                form.role_ids = value;
                clearError("role_ids");
              }}
              options={roleOptions}
              label="Vai trò"
              placeholder="Chọn vai trò..."
              error={errors.role_ids}
            />
          )}
        </FormWrapper>
      </div>
    </Modal>
  );
}
