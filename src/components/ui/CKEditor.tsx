"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "ckeditor5/ckeditor5.css";

// Dynamic import for CKEditor to avoid SSR issues
const CKEditorComponent = dynamic(
  () =>
    Promise.all([
      import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
      // @ts-ignore
      import("ckeditor5/ckeditor5.js"),
    ]).then(([CKEditor, ckeditor5]) => {
      return function CKEditorWrapper({
        value,
        onChange,
        disabled,
        height,
        placeholder,
      }: any) {
        const {
          ClassicEditor,
          Essentials,
          Paragraph,
          Bold,
          Italic,
          Link,
          List,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageResize,
          ImageUpload,
          LinkImage,
          BlockQuote,
          Heading,
          MediaEmbed,
          Table,
          TableToolbar,
          Indent,
        } = ckeditor5;

        return (
          <CKEditor
            editor={ClassicEditor}
            data={value}
            disabled={disabled}
            config={{
              plugins: [
                Essentials, Paragraph, Bold, Italic, Link, List,
                Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize, ImageUpload,
                LinkImage, BlockQuote, Heading, MediaEmbed, Table, TableToolbar, Indent
              ],
              toolbar: [
                "undo", "redo", "|",
                "heading", "|",
                "bold", "italic", "link", "bulletedList", "numberedList", "blockQuote", "|",
                "insertTable", "mediaEmbed", "imageUpload", "outdent", "indent"
              ],
              placeholder: placeholder,
            }}
            onChange={(_event: any, editor: any) => {
              const data = editor.getData();
              onChange?.(data);
            }}
          />
        );
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="ckeditor-wrapper flex items-center justify-center p-8 border border-gray-300 rounded bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Đang tải trình soạn thảo...</p>
        </div>
      </div>
    ),
  }
);

interface CKEditorProps {
  value?: string;
  placeholder?: string;
  height?: string;
  disabled?: boolean;
  readonly?: boolean;
  uploadUrl?: string;
  maxFileSize?: number;
  onChange?: (value: string) => void;
  onReady?: (editor: any) => void;
}

export default function CKEditor({
  value = "",
  placeholder = "Nhập nội dung...",
  height = "300px",
  disabled = false,
  readonly = false,
  onChange,
}: CKEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className={`ckeditor-container ${readonly ? "ck-readonly" : ""}`}>
      <CKEditorComponent
        value={value}
        onChange={onChange}
        disabled={disabled || readonly}
        height={height}
        placeholder={placeholder}
      />
      <style jsx global>{`
        .ck-editor__editable_inline {
          min-height: ${height};
        }
        .ck-readonly .ck-toolbar {
          display: none;
        }
      `}</style>
    </div>
  );
}


