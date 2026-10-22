import { CircleQuestionMark } from "lucide-react";
import type { ChangeEvent } from "react";
import type { InputProps } from ".";

const Input = ({
  name,
  label,
  required = false,
  type = "text",
  placeholder,
  className = "",
  error,
  value,
  defaultValue,
  tooltip,
  id,
  disabled = false,
  autoComplete,
  min,
  max,
  step,
  maxLength,
  accept,
  register,
  onChange,
}: InputProps) => {
  const inputId = id ?? name;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    void register?.onChange(event);
    onChange?.(event);
  };

  return (
    <div className="mb-2 flex flex-col gap-1">
      <label htmlFor={inputId} className="label py-1">
        <span className="label-text font-semibold text-gray-700">{label}</span>
        {tooltip && (
          <span className="tooltip tooltip-left" data-tip={tooltip}>
            <CircleQuestionMark
              size={14}
              className="text-gray-600"
              aria-hidden="true"
            />
          </span>
        )}
      </label>

      <input
        id={inputId}
        name={register?.name ?? name}
        ref={register?.ref}
        onBlur={register?.onBlur}
        onChange={register ? handleChange : onChange}
        type={type}
        className={`input input-bordered w-full ${className} ${error ? "input-error" : ""}`.trim()}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        min={min}
        max={max}
        step={step}
        maxLength={maxLength}
        accept={accept}
        disabled={disabled}
        {...(value !== undefined ? { value } : { defaultValue })}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />

      {error && (
        <span
          id={`${inputId}-error`}
          className="text-sm text-error"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
