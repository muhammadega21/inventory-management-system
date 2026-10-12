export interface FormProps {
  name: string;
  label: string;
  required: boolean;
  className?: string;
  error?: string;
  value?: string | number;
  tooltip?: string;
}

export interface InputProps extends FormProps {
  type?: "text" | "number" | "email" | "password";
  placeholder?: string;
}

export interface SelectProps extends FormProps {
  options: string[];
}
