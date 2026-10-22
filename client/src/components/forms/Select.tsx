import { CircleQuestionMark } from "lucide-react";
import type { ChangeEvent } from "react";
import type { FormSelectOption, SelectProps } from ".";

const Select = ({
  name,
  label,
  required = false,
  className = "",
  error,
  options,
  tooltip,
  placeholder,
  placeholderValue = "",
  id,
  disabled = false,
  value,
  defaultValue,
  register,
  onChange,
}: SelectProps) => {
  const selectId = id ?? name;

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    void register?.onChange(event);
    onChange?.(event);
  };

  const normalizedOptions: FormSelectOption[] = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  return (
    <div className="mb-2 flex flex-col gap-1">
      <label htmlFor={selectId} className="label py-1">
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

      <select
        id={selectId}
        name={register?.name ?? name}
        ref={register?.ref}
        onBlur={register?.onBlur}
        onChange={register ? handleChange : onChange}
        className={`select select-bordered w-full ${className} ${error ? "select-error" : ""}`.trim()}
        required={required}
        disabled={disabled}
        {...(value !== undefined
          ? { value: String(value) }
          : {
              defaultValue:
                defaultValue === undefined ? "" : String(defaultValue),
            })}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${selectId}-error` : undefined}
      >
        {placeholder && (
          <option value={String(placeholderValue)} disabled>
            {placeholder}
          </option>
        )}
        {normalizedOptions.map((option) => (
          <option
            key={String(option.value)}
            value={String(option.value)}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <span
          id={`${selectId}-error`}
          className="text-sm text-error"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
