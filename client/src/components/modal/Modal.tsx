import { X } from "lucide-react";
import React from "react";

export interface ModalProps {
  id: string;
  type: "add" | "edit";
  modalTitle: string;
  children?: React.ReactNode;
}

const Modal = ({ id, modalTitle, type, children }: ModalProps) => {
  return (
    <div className="modal" id={id} popover="auto">
      <form className="modal-box">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {type === "add" ? "Tambah" : "Edit"} {modalTitle}
          </h2>

          <button
            className="btn btn-sm btn-circle btn-ghost"
            popoverTarget={id}
            popoverTargetAction="hide"
            type="button"
          >
            <X />
          </button>
        </div>

        <div className="pt-4">{children}</div>

        <div className="modal-action">
          <button
            className="btn btn-ghost"
            popoverTarget={id}
            popoverTargetAction="hide"
            type="button"
          >
            Batal
          </button>
          <button className="btn btn-primary">
            {type === "add" ? "Tambah" : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Modal;
