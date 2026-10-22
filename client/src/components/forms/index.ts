import type { ChangeEventHandler, HTMLInputTypeAttribute } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export interface FormProps {
  name: string;
  label: string;
  required?: boolean;
  id?: string;
  className?: string;
  error?: string;
  tooltip?: string;
  disabled?: boolean;
}

export interface InputProps extends FormProps {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  autoComplete?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  maxLength?: number;
  accept?: string;
  register?: UseFormRegisterReturn;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export interface FormSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends FormProps {
  options: Array<string | FormSelectOption>;
  placeholder?: string;
  placeholderValue?: string | number;
  value?: string | number;
  defaultValue?: string | number;
  register?: UseFormRegisterReturn;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
}

export interface TextareaProps extends FormProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  rows?: number;
  maxLength?: number;
  register?: UseFormRegisterReturn;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
}

export interface InputFileProps extends FormProps {
  accept?: string;
  previewUrl?: string | null;
  helperText?: string;
  register?: UseFormRegisterReturn;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
