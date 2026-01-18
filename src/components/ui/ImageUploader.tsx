"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUpload } from "@/hooks/useUpload";

interface ImageUploaderProps {
  value?: File | string | null;
  defaultUrl?: string;
  maxSize?: number; // bytes, default 10MB
  autoUpload?: boolean;
  onChange?: (value: string | File | null) => void;
  onRemove?: () => void;
  onUploaded?: (response: any) => void;
  onError?: (error: Error) => void;
}

export default function ImageUploader({
  value,
  defaultUrl,
  maxSize = 10 * 1024 * 1024,
  autoUpload = true,
  onChange,
  onRemove,
  onUploaded,
  onError,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading, error: uploadError, progress } = useUpload();

  const getImageUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;
    if (typeof path === "string" && (path.startsWith("http://") || path.startsWith("https://"))) {
      return path;
    }
    if (typeof path === "string" && path.startsWith("/")) {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      return `${apiBase}${path}`;
    }
    return path || null;
  };

  useEffect(() => {
    if (value instanceof File) {
      const blobUrl = URL.createObjectURL(value);
      setPreviewUrl(blobUrl);
      return () => URL.revokeObjectURL(blobUrl);
    } else if (typeof value === "string" && value) {
      setPreviewUrl(getImageUrl(value));
    } else {
      setPreviewUrl(defaultUrl ? getImageUrl(defaultUrl) : null);
    }
  }, [value, defaultUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError?.(new Error("Chỉ chấp nhận file ảnh"));
      return;
    }

    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
      onError?.(new Error(`File vượt quá kích thước tối đa ${maxSizeMB}MB`));
      return;
    }

    setSelectedFile(file);
    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);

    if (autoUpload) {
      try {
        const response = await uploadFile(file, {
          maxSize,
          allowedTypes: ["image/*"],
        });
        const urlToEmit = response.url || response.path;
        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(getImageUrl(urlToEmit || ""));
        onChange?.(urlToEmit || "");
        onUploaded?.(response);
      } catch (err) {
        onError?.(err as Error);
      }
    } else {
      onChange?.(file);
    }

    e.target.value = "";
  };

  const handleRemove = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    onChange?.(null);
    onRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageError = () => {
    setPreviewUrl(null);
  };

  return (
    <div>
      {previewUrl ? (
        <div className="mb-2 relative inline-block">
          <div className="relative w-20 h-20">
            <Image
              src={previewUrl}
              alt="preview"
              fill
              className="object-cover rounded-full border"
              unoptimized
              onError={handleImageError}
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100 transition"
            style={{ transform: "translate(40%, -40%)" }}
            title="Xóa ảnh"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full border text-gray-400 text-xs">
          No Image
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        disabled={uploading}
        className="mt-2 text-sm"
      />
      {uploading && (
        <div className="text-xs text-gray-500 mt-1">
          Đang upload ảnh... {progress > 0 ? `${progress}%` : ""}
        </div>
      )}
      {uploadError && (
        <div className="text-xs text-red-500 mt-1">{uploadError}</div>
      )}
    </div>
  );
}

