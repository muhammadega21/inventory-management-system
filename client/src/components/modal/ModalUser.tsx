import { useForm, type Resolver } from "react-hook-form";
import {
  useCreateUser,
  useGetUserById,
  useUpdateUser,
} from "../../hook/useUser";
import {
  editUserFormSchema,
  userFormSchema,
  type UserFormData,
} from "../../schemas/user.schema";
import type { UserItem } from "../../type/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { showAlert } from "../../utils/swal";
import { getApiErrorMessage } from "../../utils/apiError";
import Modal from "./Modal";
import Input from "../forms/Input";
import Select from "../forms/Select";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  data?: UserItem;
}

const defaultValues: UserFormData = {
  name: "",
  email: "",
  password: "",
  role: "STAFF",
  is_active: true,
};

const ModalUser = ({ isOpen, onClose, mode, data }: UserModalProps) => {
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const detailQuery = useGetUserById(data?.id ?? 0, isOpen && mode === "edit");

  const user = detailQuery.data?.data;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const passwordRequired = mode === "add" ? true : false;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(
      mode === "add" ? userFormSchema : editUserFormSchema,
    ) as Resolver<UserFormData>,
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "add") {
      reset(defaultValues);
      return;
    }

    if (user && user.id === data?.id) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        is_active: user.is_active,
      });
    }
  }, [isOpen, mode, user, data?.id, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handleFormSubmit = async (formData: UserFormData) => {
    if (mode === "edit" && (!user || user.id !== data?.id)) {
      showAlert.alert(
        "error",
        "Data user belum tersedia",
        "Coba muat ulang detail user sebelum menyimpan.",
      );

      return;
    }

    try {
      if (mode === "add") {
        await createMutation.mutateAsync({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          is_active: formData.is_active,
        });
      } else {
        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          ...(formData.password ? { password: formData.password } : {}),
          role: formData.role,
          is_active: formData.is_active,
        };

        await updateMutation.mutateAsync({
          id: user!.id,
          payload,
        });
      }

      showAlert.toast(
        "success",
        mode === "add"
          ? "User berhasil ditambahkan"
          : "User berhasil diperbarui",
      );
      handleClose();
    } catch (error) {
      showAlert.alert(
        "error",
        mode === "add" ? "Gagal menambahkan user" : "Gagal memperbarui user",
        getApiErrorMessage(error),
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      id="user-modal"
      isOpen={isOpen}
      onClose={handleClose}
      type={mode}
      modalTitle="User"
      onSubmit={handleSubmit(handleFormSubmit)}
      isSubmitting={isSaving}
      submitDisabled={
        isSaving ||
        (mode === "edit" && (!user || user.id !== data?.id)) ||
        detailQuery.isLoading ||
        detailQuery.isError
      }
      noValidate
    >
      {mode === "edit" && detailQuery.isLoading ? (
        <div className="flex items-center justify-center gap-3 py-12">
          <span className="loading loading-spinner loading-md" />
          <span>Memuat detail user...</span>
        </div>
      ) : detailQuery.isError && mode === "edit" ? (
        <div className="py-6">
          <p className="text-sm text-error">Detail user gagal dimuat.</p>
          <button
            type="button"
            className="btn btn-sm mt-3"
            onClick={() => void detailQuery.refetch()}
          >
            Coba lagi
          </button>
        </div>
      ) : (
        <fieldset disabled={isSaving} className="space-y-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              name="name"
              id="user-name"
              label="Nama User"
              placeholder="Contoh: John Doe"
              autoComplete="off"
              required
              register={register("name")}
              error={errors.name?.message}
            />
            <Input
              name="email"
              id="user-email"
              label="Email User"
              placeholder="Contoh: JohnDoe@example.com"
              autoComplete="off"
              required
              register={register("email")}
              error={errors.email?.message}
              type="email"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              name="password"
              id="user-password"
              label="Password User"
              placeholder={
                mode === "add"
                  ? "Minimal 6 karakter"
                  : "Kosongkan jika tidak diubah"
              }
              autoComplete="off"
              required={passwordRequired}
              register={register("password", { required: passwordRequired })}
              error={errors.password?.message}
              type="password"
            />
            <Select
              name="role"
              id="user-role"
              label="Role User"
              required
              placeholder="Pilih role user"
              options={[
                { value: "ADMIN", label: "Admin" },
                { value: "STAFF", label: "Staff" },
              ]}
              register={register("role")}
              error={errors.role?.message}
              disabled={isSaving}
            />
          </div>
          <label
            htmlFor="user-active"
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-base-300 p-3"
          >
            <input
              id="user-active"
              type="checkbox"
              className="checkbox checkbox-primary"
              disabled={isSaving}
              {...register("is_active")}
            />
            <span>
              <span className="block font-semibold">User aktif</span>
              <span className="text-xs text-gray-500">
                User aktif dapat digunakan pada proses operasional.
              </span>
            </span>
          </label>
        </fieldset>
      )}
    </Modal>
  );
};

export default ModalUser;
