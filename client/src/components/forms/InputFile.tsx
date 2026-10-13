import type { InputProps } from ".";
import { CircleQuestionMark, CloudUpload } from "lucide-react";
import noImageIcon from "../../assets/no-image-icon.webp";

const InputFile = ({ name, label, error, tooltip, required }: InputProps) => {
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
      <div>
        <label htmlFor={name} className="cursor-pointer">
          <div className="flex gap-2">
            <div className="p-2 rounded bg-gray-200 flex items-center justify-center">
              <img
                src={noImageIcon}
                alt="no-image"
                className="w-24 object-cover rounded overflow-hidden"
              />
            </div>
            <div className="bg-gray-200 text-center px-4 py-3 w-full rounded">
              <div className="flex justify-center">
                <CloudUpload size={20} className="text-primary" />
              </div>
              <p className="text-sm font-semibold">
                Pilih file foto atau seret ke sini
              </p>
              <p className="text-xs text-gray-700">
                JPG, PNG atau WebP (Maks. 2MB)
              </p>
            </div>
          </div>
        </label>
        <input
          type="file"
          name={name}
          id={name}
          className="hidden"
          required={required}
        />
      </div>
      {error && <span className="text-sm text-error">{error}</span>}
    </div>
  );
};

export default InputFile;
