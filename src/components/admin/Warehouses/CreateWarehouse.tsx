"use client";

import { useState, useEffect } from "react";
import WarehouseForm from "./WarehouseForm";

interface CreateWarehouseProps {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}

export default function CreateWarehouse({
  show,
  apiErrors,
  onCreated,
  onClose,
}: CreateWarehouseProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleSubmit = (formData: any) => {
    onCreated?.(formData);
  };

  if (!showModal) return null;

  return (
    <WarehouseForm
      show={showModal}
      apiErrors={apiErrors}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
}

