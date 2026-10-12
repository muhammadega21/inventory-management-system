import type { SelectProps } from ".";
import { CircleQuestionMark } from "lucide-react";

const Select = ({
  name,
  label,
  required,
  className,
  error,
  options,
  tooltip,
}: SelectProps) => {
  return (
    <div className="flex flex-col gap-1 mb-2">
      <label className="font-semibold">{label}</label>
      {tooltip && (
        <span
          className="mx-1 absolute -right-6 tooltip tooltip-start"
          data-tip={tooltip}
        >
          <CircleQuestionMark size={14} className="text-gray-600" />
        </span>
      )}
      <select
        name={name}
        className={`select w-full ${className} ${error ? "input-error" : ""}`}
        required={required}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-error">{error}</span>}
    </div>
  );
};

export default Select;
