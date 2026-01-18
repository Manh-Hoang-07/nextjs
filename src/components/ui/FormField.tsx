"use client";

import { useId } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface FormFieldProps {
  value?: string | number | boolean | Array<string | number>;
  label?: string;
  type?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  maxlength?: number | string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  rows?: number | string;
  options?: Option[];
  multiple?: boolean;
  checkboxLabel?: string;
  labelClass?: string;
  inputClass?: string;
  autocomplete?: string;
  onChange?: (value: any) => void;
}

export default function FormField({
  value,
  label,
  type = "text",
  name,
  id,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  maxlength,
  min,
  max,
  step,
  rows = 3,
  options = [],
  multiple = false,
  checkboxLabel,
  labelClass = "",
  inputClass = "",
  autocomplete,
  onChange,
}: FormFieldProps) {
  const generatedId = useId();
  const fieldId = id || name || generatedId;

  const baseInputClass = `w-full px-4 py-2 border rounded-xl ${error ? "border-red-500" : "border-gray-300"
    } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"} ${inputClass}`;

  const handleChange = (newValue: any) => {
    onChange?.(newValue);
  };

  return (
    <div className={`form-field ${error ? "has-error" : ""}`}>
      {label && type !== "checkbox" && (
        <label htmlFor={fieldId} className={`block text-sm font-medium mb-1 ${labelClass}`}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input text, email, password, number, tel, date */}
      {["text", "email", "password", "number", "tel", "date", "datetime-local"].includes(type) && (
        <input
          id={fieldId}
          name={name}
          type={type}
          value={value as string | number}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={typeof maxlength === "number" ? maxlength : undefined}
          min={min}
          max={max}
          step={step}
          autoComplete={autocomplete}
          className={baseInputClass}
        />
      )}

      {/* Textarea */}
      {type === "textarea" && (
        <textarea
          id={fieldId}
          name={name}
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={typeof maxlength === "number" ? maxlength : undefined}
          rows={typeof rows === "number" ? rows : parseInt(String(rows))}
          className={baseInputClass}
        />
      )}

      {/* Select */}
      {type === "select" && (
        <select
          id={fieldId}
          name={name}
          value={value as string | number}
          onChange={(e) => {
            if (multiple) {
              const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
              handleChange(selectedOptions);
            } else {
              handleChange(e.target.value);
            }
          }}
          disabled={disabled}
          multiple={multiple}
          className={`${baseInputClass} ${multiple ? "min-h-[120px]" : ""}`}
        >
          {!multiple && placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {/* Checkbox */}
      {type === "checkbox" && (
        <div className="flex items-center">
          <input
            id={fieldId}
            name={name}
            type="checkbox"
            checked={!!value}
            onChange={(e) => handleChange(e.target.checked)}
            disabled={disabled}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor={fieldId} className="ml-2 block text-sm text-gray-700">
            {checkboxLabel || label}
          </label>
        </div>
      )}

      {/* Radio group */}
      {type === "radio" && (
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                id={`${fieldId}-${option.value}`}
                name={name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={() => handleChange(option.value)}
                disabled={disabled}
                className="h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor={`${fieldId}-${option.value}`} className="ml-2 block text-sm text-gray-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Help text */}
      {helpText && <div className="mt-1 text-sm text-gray-500">{helpText}</div>}

      {/* Error message */}
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}
