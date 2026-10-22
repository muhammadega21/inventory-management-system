import { X } from "lucide-react";
import { type FormEventHandler, type ReactNode } from "react";

export interface ModalProps {
  id: string;
  isOpen: boolean;
  type: "add" | "edit";
  modalTitle: string;
  onClose: () => void;
  children?: ReactNode;
  description?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  noValidate?: boolean;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  closeDisabled?: boolean;
  maxWidthClassName?: string;
  footer?: ReactNode;
}

const Modal = ({
  id,
  isOpen,
  type,
  modalTitle,
  onClose,
  children,
  description,
  onSubmit,
  noValidate = false,
  isSubmitting = false,
  submitDisabled = false,
  submitLabel,
  cancelLabel = "Batal",
  closeDisabled = false,
  maxWidthClassName = "max-w-2xl",
  footer,
}: ModalProps) => {
  if (!isOpen) return null;

  const defaultFooter = onSubmit ? (
    <div className="modal-action">
      <button
        type="button"
        className="btn btn-ghost"
        onClick={onClose}
        disabled={closeDisabled || isSubmitting}
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={submitDisabled || isSubmitting}
      >
        {isSubmitting && (
          <span className="loading loading-spinner loading-sm" />
        )}
        {submitLabel ?? `${type === "add" ? "Tambah" : "Simpan"} ${modalTitle}`}
      </button>
    </div>
  ) : null;

  return (
    <div className="modal modal-open" role="presentation">
      <div
        className={`modal-box w-full ${maxWidthClassName} max-h-[90vh] overflow-y-auto`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={`${id}-title`} className="text-lg font-semibold">
              {type === "add" ? "Tambah" : "Edit"} {modalTitle}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={closeDisabled || isSubmitting}
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>

        {onSubmit ? (
          <form onSubmit={onSubmit} noValidate={noValidate}>
            <div className="pt-4">{children}</div>
            {footer ?? defaultFooter}
          </form>
        ) : (
          <>
            <div className="pt-4">{children}</div>
            {footer && <div className="modal-action">{footer}</div>}
          </>
        )}
      </div>

      <button
        type="button"
        className="modal-backdrop"
        onClick={onClose}
        disabled={closeDisabled || isSubmitting}
        aria-label="Tutup modal"
      >
        Tutup
      </button>
    </div>
  );
};

export default Modal;
