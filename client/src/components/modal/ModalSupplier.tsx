import { useForm, type Resolver } from "react-hook-form";
import {
  useCreateSupplier,
  useGetSupplierById,
  useUpdateSupplier,
} from "../../hook/useSupplier";
import {
  supplierFormSchema,
  type SupplierFormData,
} from "../../schemas/supplier.schema";
import type { SupplierItem } from "../../type/supplier";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { showAlert } from "../../utils/swal";
import { getApiErrorMessage } from "../../utils/apiError";
import Modal from "./Modal";
import Input from "../forms/Input";
import Textarea from "../forms/Textarea";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  data?: SupplierItem;
}

const defaultValues: SupplierFormData = {
  name: "",
  address: "",
  phone: "",
  email: "",
  city: "",
  contact_person: "",
  is_active: true,
};

const ModalSupplier = ({ isOpen, onClose, mode, data }: SupplierModalProps) => {
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();

  const detailQuery = useGetSupplierById(
    data?.id ?? 0,
    isOpen && mode === "edit",
  );

  const supplier = detailQuery.data?.data;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema) as Resolver<SupplierFormData>,
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "add") {
      reset(defaultValues);
      return;
    }

    if (supplier && supplier.id === data?.id) {
      reset({
        name: supplier.name,
        phone: supplier.phone ?? "",
        address: supplier.address,
        email: supplier.email,
        city: supplier.city,
        contact_person: supplier.contact_person,
        is_active: supplier.is_active,
      });
    }
  }, [isOpen, mode, supplier, data?.id, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handleFormSubmit = async (formData: SupplierFormData) => {
    if (mode === "edit" && (!supplier || supplier.id !== data?.id)) {
      showAlert.alert(
        "error",
        "Data supplier belum tersedia",
        "Coba muat ulang detail supplier sebelum menyimpan.",
      );

      return;
    }

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone?.trim() ?? "",
      address: formData.address.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
      contact_person: formData.contact_person.trim(),
      is_active: formData.is_active,
    };

    try {
      if (mode === "add") {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync({
          id: supplier!.id,
          payload,
        });
      }

      showAlert.toast(
        "success",
        mode === "add"
          ? "Supplier berhasil ditambahkan"
          : "Supplier berhasil diperbarui",
      );
      handleClose();
    } catch (error) {
      showAlert.alert(
        "error",
        mode === "add"
          ? "Gagal menambahkan supplier"
          : "Gagal memperbarui supplier",
        getApiErrorMessage(error),
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      id="supplier-modal"
      isOpen={isOpen}
      onClose={handleClose}
      type={mode}
      modalTitle="Supplier"
      onSubmit={handleSubmit(handleFormSubmit)}
      isSubmitting={isSaving}
      submitDisabled={
        isSaving ||
        (mode === "edit" && (!supplier || supplier.id !== data?.id)) ||
        detailQuery.isLoading ||
        detailQuery.isError
      }
      noValidate
    >
      {mode === "edit" && detailQuery.isLoading ? (
        <div className="flex items-center justify-center gap-3 py-12">
          <span className="loading loading-spinner loading-md" />
          <span>Memuat detail supplier...</span>
        </div>
      ) : detailQuery.isError && mode === "edit" ? (
        <div className="py-6">
          <p className="text-sm text-error">Detail supplier gagal dimuat.</p>
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
            id="supplier-name"
            label="Nama Supplier"
            placeholder="Contoh: Go Air, Garuda Indonesia, Lion Air"
            autoComplete="off"
            required
            register={register("name")}
            error={errors.name?.message}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              name="contact_person"
              id="supplier-contact"
              label="Kontak Supplier"
              placeholder="Contoh: John Doe"
              autoComplete="off"
              required
              register={register("contact_person")}
              error={errors.contact_person?.message}
            />
            <Input
              name="phone"
              id="supplier-phone"
              label="No. Hp Supplier"
              placeholder="Contoh: 08123456789 (opsional)"
              autoComplete="off"
              required={false}
              register={register("phone")}
              error={errors.phone?.message}
              type="tel"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              name="email"
              id="supplier-email"
              label="Email Supplier"
              placeholder="Contoh: GoAir@example.com"
              autoComplete="off"
              required
              register={register("email")}
              error={errors.email?.message}
              type="email"
            />
            <Input
              name="city"
              id="supplier-city"
              label="Kota Supplier"
              placeholder="Contoh: Jakarta, Surabaya, Padang"
              autoComplete="off"
              required
              register={register("city")}
              error={errors.city?.message}
            />
          </div>
          <Textarea
            name="address"
            id="supplier-address"
            label="Alamat Supplier"
            rows={3}
            maxLength={500}
            placeholder="Alamat lengkap supplier"
            register={register("address")}
            error={errors.address?.message}
          />
          <label
            htmlFor="supplier-active"
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-base-300 p-3"
          >
            <input
              id="supplier-active"
              type="checkbox"
              className="checkbox checkbox-primary"
              disabled={isSaving}
              {...register("is_active")}
            />
            <span>
              <span className="block font-semibold">Supplier aktif</span>
              <span className="text-xs text-gray-500">
                Supplier aktif dapat digunakan pada proses operasional.
              </span>
            </span>
          </label>
        </fieldset>
      )}
    </Modal>
  );
};

export default ModalSupplier;
