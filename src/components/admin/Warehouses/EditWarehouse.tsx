"use client";

import { useState, useEffect, useCallback } from "react";
import WarehouseForm from "./WarehouseForm";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface EditWarehouseProps {
  show: boolean;
  warehouse?: any;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}

export default function EditWarehouse({
  show,
  warehouse,
  apiErrors,
  onUpdated,
  onClose,
}: EditWarehouseProps) {
  const [showModal, setShowModal] = useState(false);
  const [warehouseData, setWarehouseData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchWarehouseDetails = useCallback(async () => {
    if (!warehouse?.id) return;

    setLoading(true);
    try {
      const response = await api.get(adminEndpoints.warehouses.show(warehouse.id));
      const data = response.data?.data || response.data;
      setWarehouseData(data);
    } catch (error) {
      setWarehouseData(warehouse);
    } finally {
      setLoading(false);
    }
  }, [warehouse]);

  useEffect(() => {
    setShowModal(show);
    if (show && warehouse?.id) {
      setWarehouseData(warehouse);
      fetchWarehouseDetails();
    } else {
      setWarehouseData(null);
      setLoading(false);
    }
  }, [show, warehouse, fetchWarehouseDetails]);

  const handleSubmit = (formData: any) => {
    onUpdated?.(formData);
  };

  if (!showModal) return null;

  return (
    <WarehouseForm
      show={showModal}
      warehouse={warehouseData}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}

