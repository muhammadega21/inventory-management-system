import { CircleQuestionMark } from "lucide-react";
import type { ChangeEvent } from "react";
import type { TextareaProps } from ".";

const Textarea = ({
  name,
  label,
  required = false,
  placeholder,
  className = "",
  error,
  value,
  defaultValue,
  tooltip,
  id,
  disabled = false,
  rows = 3,
  maxLength,
  register,
  onChange,
}: TextareaProps) => {
  const textareaId = id ?? name;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    void register?.onChange(event);
    onChange?.(event);
  };

  return (
    <div className="mb-2 flex flex-col gap-1">
      <label htmlFor={textareaId} className="label py-1">
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

      <textarea
        id={textareaId}
        name={register?.name ?? name}
        ref={register?.ref}
        onBlur={register?.onBlur}
        onChange={register ? handleChange : onChange}
        rows={rows}
        maxLength={maxLength}
        className={`textarea textarea-bordered w-full ${className} ${error ? "textarea-error" : ""}`.trim()}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        {...(value !== undefined ? { value } : { defaultValue })}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${textareaId}-error` : undefined}
      />

      {error && (
        <span
          id={`${textareaId}-error`}
          className="text-sm text-error"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Textarea;
