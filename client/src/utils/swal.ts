import Swal, { type SweetAlertIcon } from "sweetalert2";

const CONFIRM_COLOR = "#4F46E5";
const DANGER_COLOR = "#EF4444";

const ToastInstance = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const showAlert = {
  toast: (icon: SweetAlertIcon, title: string) => {
    ToastInstance.fire({ icon, title, showCloseButton: true });
  },

  alert: (icon: SweetAlertIcon, title: string, text?: string) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: CONFIRM_COLOR,
    });
  },

  confirmDelete: async (title: string, text: string): Promise<boolean> => {
    const res = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: DANGER_COLOR,
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Delete!",
      cancelButtonText: "Cancel",
    });

    return res.isConfirmed;
  },
};
