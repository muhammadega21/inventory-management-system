import { useEffect, useState, type ChangeEvent } from "react";
import { CircleQuestionMark, CloudUpload } from "lucide-react";
import noImageIcon from "../../assets/no-image-icon.webp";
import type { InputFileProps } from ".";

const InputFile = ({
  name,
  label,
  error,
  tooltip,
  required = false,
  id,
  disabled = false,
  accept = "image/png,image/jpeg,image/webp",
  previewUrl,
  helperText = "JPG, PNG, atau WebP; maksimum 2 MB.",
  register,
  onChange,
}: InputFileProps) => {
  const inputId = id ?? name;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setSelectedPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setSelectedPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] ?? null);
    void register?.onChange(event);
    onChange?.(event);
  };

  const imagePreview = selectedPreview ?? previewUrl ?? noImageIcon;

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

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded bg-gray-100">
          <img
            src={imagePreview}
            alt={
              selectedFile
                ? "Pratinjau gambar yang dipilih"
                : previewUrl
                  ? "Gambar produk saat ini"
                  : "Belum ada gambar produk"
            }
            className="size-full object-contain"
          />
        </div>

        <label
          htmlFor={inputId}
          className={`flex min-h-24  flex-1 flex-col items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-center ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-gray-100"}`}
        >
          <CloudUpload
            size={22}
            className="mb-1 text-primary "
            aria-hidden="true"
          />
          <span className="text-sm font-semibold break-all">
            {selectedFile?.name ?? "Pilih gambar produk"}
          </span>
          <span className="mt-1 text-xs text-gray-600">{helperText}</span>
        </label>
      </div>

      <input
        id={inputId}
        name={register?.name ?? name}
        ref={register?.ref}
        onBlur={register?.onBlur}
        onChange={register ? handleChange : onChange}
        type="file"
        accept={accept}
        className="sr-only"
        required={required}
        disabled={disabled}
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

export default InputFile;
