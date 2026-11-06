import { useForm, type Resolver } from "react-hook-form";
import {
  useCreateCategory,
  useGetCategoryById,
  useUpdateCategory,
} from "../../hook/useCategory";
import {
  categoryFormSchema,
  type CategoryFormData,
} from "../../schemas/category.schema";
import type { CategoryItem } from "../../type/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { showAlert } from "../../utils/swal";
import { getApiErrorMessage } from "../../utils/apiError";
import Modal from "./Modal";
import Input from "../forms/Input";
import Textarea from "../forms/Textarea";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  data?: CategoryItem;
}

const defaultValues: CategoryFormData = {
  name: "",
  description: "",
  is_active: true,
};

const ModalCategory = ({ isOpen, onClose, mode, data }: CategoryModalProps) => {
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const detailQuery = useGetCategoryById(
    data?.id ?? 0,
    isOpen && mode === "edit",
  );

  const category = detailQuery.data?.data;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema) as Resolver<CategoryFormData>,
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "add") {
      reset(defaultValues);
      return;
    }

    if (category && category.id === data?.id) {
      reset({
        name: category.name,
        description: category.description ?? "",
        is_active: category.is_active,
      });
    }
  }, [isOpen, mode, category, data?.id, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handleFormSubmit = async (formData: CategoryFormData) => {
    if (mode === "edit" && (!category || category.id !== data?.id)) {
      showAlert.alert(
        "error",
        "Data kategori belum tersedia",
        "Coba muat ulang detail kategori sebelum menyimpan.",
      );

      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description?.trim() ?? "",
      is_active: formData.is_active,
    };

    try {
      if (mode === "add") {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync({
          id: category!.id,
          payload,
        });
      }

      showAlert.toast(
        "success",
        mode === "add"
          ? "Kategori berhasil ditambahkan"
          : "Kategori berhasil diperbarui",
      );
      handleClose();
    } catch (error) {
      showAlert.alert(
        "error",
        mode === "add"
          ? "Gagal menambahkan kategori"
          : "Gagal memperbarui kategori",
        getApiErrorMessage(error),
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      id="category-modal"
      isOpen={isOpen}
      onClose={handleClose}
      type={mode}
      modalTitle="Kategori"
      onSubmit={handleSubmit(handleFormSubmit)}
      isSubmitting={isSaving}
      submitDisabled={
        isSaving ||
        (mode === "edit" && (!category || category.id !== data?.id)) ||
        detailQuery.isLoading ||
        detailQuery.isError
      }
      noValidate
    >
      {mode === "edit" && detailQuery.isLoading ? (
        <div className="flex items-center justify-center gap-3 py-12">
          <span className="loading loading-spinner loading-md" />
          <span>Memuat detail kategori...</span>
        </div>
      ) : detailQuery.isError && mode === "edit" ? (
        <div className="py-6">
          <p className="text-sm text-error">Detail kategori gagal dimuat.</p>
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
          <Input
            name="name"
            id="category-name"
            label="Nama Kategori"
            placeholder="Contoh: Aksesoris Komputer, Alat Tulis Kantor"
            autoComplete="off"
            required
            register={register("name")}
            error={errors.name?.message}
          />
          <Textarea
            name="description"
            id="category-description"
            label="Deskripsi"
            rows={3}
            maxLength={500}
            placeholder="Deskripsi singkat kategori (opsional)"
            register={register("description")}
            error={errors.description?.message}
          />
          <label
            htmlFor="category-active"
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-base-300 p-3"
          >
            <input
              id="category-active"
              type="checkbox"
              className="checkbox checkbox-primary"
              disabled={isSaving}
              {...register("is_active")}
            />
            <span>
              <span className="block font-semibold">Kategori aktif</span>
              <span className="text-xs text-gray-500">
                Kategori aktif dapat digunakan pada proses operasional.
              </span>
            </span>
          </label>
        </fieldset>
      )}
    </Modal>
  );
};

export default ModalCategory;
