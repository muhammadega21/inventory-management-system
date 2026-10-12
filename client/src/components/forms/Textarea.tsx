import React from "react";
import type { InputProps } from ".";
import { CircleQuestionMark } from "lucide-react";

const Textarea = ({
  name,
  label,
  required,
  placeholder,
  className,
  error,
  value,
  tooltip,
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1 mb-2">
      <label className="font-semibold w-max relative">
        {label}
        {tooltip && (
          <span
            className="mx-1 absolute -right-6 tooltip tooltip-start"
            data-tip={tooltip}
          >
            <CircleQuestionMark size={14} className="text-gray-600" />
          </span>
        )}
      </label>

      <textarea
        name={name}
        className={`textarea w-full ${className} ${error ? "input-error" : ""}`}
        required={required}
        placeholder={placeholder}
        value={value}
      />
      {error && <span className="text-sm text-error">{error}</span>}
    </div>
  );
};

export default Textarea;
