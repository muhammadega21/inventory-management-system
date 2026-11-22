import { useForm, type Resolver } from "react-hook-form";
import {
  useCreateWarehouse,
  useGetWarehouseById,
  useUpdateWarehouse,
} from "../../hook/useWareshouse";
import {
  warehouseFormSchema,
  type WarehouseFormData,
} from "../../schemas/warehouse.schema";
import type { WarehouseDetail, WarehouseListItem } from "../../type/warehouse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { showAlert } from "../../utils/swal";
import { getApiErrorMessage } from "../../utils/apiError";
import Modal from "./Modal";
import Input from "../forms/Input";
import Textarea from "../forms/Textarea";

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  data?: WarehouseListItem;
}

const defaultValues: WarehouseFormData = {
  name: "",
  address: "",
  city: "",
  description: "",
  is_active: true,
};

const ModalWarehouse = ({
  isOpen,
  onClose,
  mode,
  data,
}: WarehouseModalProps) => {
  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();

  const detailQuery = useGetWarehouseById(
    data?.id ?? 0,
    isOpen && mode === "edit",
  );

  const warehouse = detailQuery.data?.data;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseFormSchema) as Resolver<WarehouseFormData>,
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "add") {
      reset(defaultValues);
      return;
    }

    if (warehouse && warehouse.id === data?.id) {
      reset({
        name: warehouse.name,
        address: warehouse.address,
        city: warehouse.city,
        description: warehouse.description ?? "",
        is_active: warehouse.is_active,
      });
    }
  }, [isOpen, mode, warehouse, data?.id, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handleFormSubmit = async (formData: WarehouseFormData) => {
    if (mode === "edit" && (!warehouse || warehouse.id !== data?.id)) {
      showAlert.alert(
        "error",
        "Data warehouse belum tersedia",
        "Coba muat ulang detail warehouse sebelum menyimpan.",
      );

      return;
    }

    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      description: formData.description?.trim(),
      is_active: formData.is_active,
    };

    try {
      if (mode === "add") {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync({
          id: warehouse!.id,
          payload,
        });
      }

      showAlert.toast(
        "success",
        mode === "add"
          ? "Warehouse berhasil ditambahkan"
          : "Warehouse berhasil diperbarui",
      );
      handleClose();
    } catch (error) {
      showAlert.alert(
        "error",
        mode === "add"
          ? "Gagal menambahkan warehouse"
          : "Gagal memperbarui warehouse",
        getApiErrorMessage(error),
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      id="warehouse-modal"
      isOpen={isOpen}
      onClose={handleClose}
      type={mode}
      modalTitle="Gudang"
      onSubmit={handleSubmit(handleFormSubmit)}
      isSubmitting={isSaving}
      submitDisabled={
        isSaving ||
        (mode === "edit" && (!warehouse || warehouse.id !== data?.id)) ||
        detailQuery.isLoading ||
        detailQuery.isError
      }
      noValidate
    >
      {mode === "edit" && detailQuery.isLoading ? (
        <div className="flex items-center justify-center gap-3 py-12">
          <span className="loading loading-spinner loading-md" />
          <span>Memuat detail warehouse...</span>
        </div>
      ) : detailQuery.isError && mode === "edit" ? (
        <div className="py-6">
          <p className="text-sm text-error">Detail warehouse gagal dimuat.</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              name="name"
              id="warehouse-name"
              label="Nama Gudang"
              placeholder="Contoh: Go Air Warehouse"
              autoComplete="off"
              required
              register={register("name")}
              error={errors.name?.message}
            />
            <Input
              name="city"
              id="warehouse-city"
              label="Kota"
              placeholder="Contoh: Jakarta"
              autoComplete="off"
              required
              register={register("city")}
              error={errors.city?.message}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea
              name="address"
              id="warehosue-address"
              label="Alamat"
              required
              rows={3}
              maxLength={500}
              placeholder="Alamat Lengkap Gudang"
              register={register("address")}
              error={errors.address?.message}
            />
            <Textarea
              name="description"
              id="warehouse-description"
              label="Deskripsi"
              rows={3}
              maxLength={500}
              placeholder="Deskripsi singkat gudang (opsional)"
              register={register("description")}
              error={errors.description?.message}
            />
          </div>
          <label
            htmlFor="warehouse-active"
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-base-300 p-3"
          >
            <input
              id="warehouse-active"
              type="checkbox"
              className="checkbox checkbox-primary"
              disabled={isSaving}
              {...register("is_active")}
            />
            <span>
              <span className="block font-semibold">Gudang aktif</span>
              <span className="text-xs text-gray-500">
                Gudang aktif dapat digunakan pada proses operasional.
              </span>
            </span>
          </label>
        </fieldset>
      )}
    </Modal>
  );
};

export default ModalWarehouse;
