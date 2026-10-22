import { useForm, type Resolver } from "react-hook-form";
import { useGetCategories } from "../../hook/useCategory";
import {
  useCreateProduct,
  useGetProductById,
  useUpdateProduct,
} from "../../hook/useProduct";
import {
  productFormSchema,
  type ProductFormData,
} from "../../schemas/product.schema";
import type { ProductListItem } from "../../type/product";
import Input from "../forms/Input";
import InputFile from "../forms/InputFile";
import Select from "../forms/Select";
import Textarea from "../forms/Textarea";
import Modal from "./Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { showAlert } from "../../utils/swal";
import { getApiErrorMessage } from "../../utils/apiError";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  data?: ProductListItem;
}

const defaultValues: ProductFormData = {
  category_id: 0,
  name: "",
  unit: "PCS",
  minimum_stock: 0,
  description: "",
  is_active: true,
  image: undefined,
};

const ModalProduct = ({ isOpen, onClose, mode, data }: ProductModalProps) => {
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  // Detail diambil saat mode edit karena list tidak memuat semua field produk.
  const detailQuery = useGetProductById(
    data?.id ?? 0,
    isOpen && mode === "edit",
  );
  const categoryQuery = useGetCategories();

  const product = detailQuery.data?.data;
  const categories = categoryQuery.data?.data ?? [];
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // Saat membuat, hanya kategori aktif yang boleh dipilih.
  // Saat mengedit, kategori lama tetap ditampilkan meski sudah nonaktif.
  const categoryOptions = categories
    .filter(
      (category) =>
        category.is_active ||
        (mode === "edit" && category.id === product?.category.id),
    )
    .map((category) => ({
      value: category.id,
      label: category.is_active ? category.name : `${category.name} (Nonaktif)`,
      disabled: !category.is_active,
    }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema) as Resolver<ProductFormData>,
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "add") {
      reset(defaultValues);
      return;
    }

    if (product && product.id === data?.id) {
      reset({
        category_id: product.category.id,
        name: product.name,
        unit: product.unit,
        minimum_stock: product.minimum_stock,
        description: product.description ?? "",
        is_active: product.is_active,
        image: undefined,
      });
    }
  }, [isOpen, mode, product, data?.id, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handleFormSubmit = async (formData: ProductFormData) => {
    if (mode === "edit" && (!product || product.id !== data?.id)) {
      showAlert.alert(
        "error",
        "Data produk belum tersedia",
        "Coba muat ulang detail produk sebelum menyimpan.",
      );
      return;
    }

    const payload = new FormData();

    // SKU dibuat oleh server, jadi tidak dikirim dari form.
    // Saat edit, category_id hanya dikirim jika memang diganti.
    if (mode === "add" || formData.category_id !== product?.category.id) {
      payload.append("category_id", String(formData.category_id));
    }
    payload.append("name", formData.name.trim());
    payload.append("unit", formData.unit.trim());
    payload.append("minimum_stock", String(formData.minimum_stock));
    payload.append("description", formData.description.trim());
    payload.append("is_active", String(formData.is_active));

    if (formData.image?.length) {
      payload.append("image", formData.image[0]);
    }

    try {
      if (mode === "add") {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync({
          id: product!.id,
          payload,
        });
      }

      showAlert.toast(
        "success",
        mode === "add"
          ? "Produk berhasil ditambahkan"
          : "Produk berhasil diperbarui",
      );
      handleClose();
    } catch (error) {
      showAlert.alert(
        "error",
        mode === "add"
          ? "Gagal menambahkan produk"
          : "Gagal memperbarui produk",
        getApiErrorMessage(error),
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      id="product-modal"
      isOpen={isOpen}
      onClose={handleClose}
      type={mode}
      modalTitle="Produk"
      // description="SKU dibuat otomatis oleh server."
      onSubmit={handleSubmit(handleFormSubmit)}
      isSubmitting={isSaving}
      submitDisabled={
        isSaving ||
        categoryQuery.isLoading ||
        categoryQuery.isError ||
        categoryOptions.length === 0 ||
        (mode === "edit" &&
          (!product ||
            product.id !== data?.id ||
            detailQuery.isLoading ||
            detailQuery.isError))
      }
      noValidate
    >
      {mode === "edit" && detailQuery.isLoading ? (
        <div className="flex items-center justify-center gap-3 py-12">
          <span className="loading loading-spinner loading-md" />
          <span>Memuat detail produk…</span>
        </div>
      ) : detailQuery.isError && mode === "edit" ? (
        <div className="py-6">
          <p className="text-sm text-error">Detail produk gagal dimuat.</p>
          <button
            type="button"
            className="btn btn-sm mt-3"
            onClick={() => void detailQuery.refetch()}
          >
            Coba lagi
          </button>
        </div>
      ) : categoryQuery.isError ? (
        <div className="py-6">
          <p className="text-sm text-error">
            Kategori gagal dimuat. Form belum dapat disimpan.
          </p>
          <button
            type="button"
            className="btn btn-sm mt-3"
            onClick={() => void categoryQuery.refetch()}
          >
            Muat ulang kategori
          </button>
        </div>
      ) : (
        <fieldset disabled={isSaving} className="space-y-3">
          <Input
            name="name"
            id="product-name"
            label="Nama Produk"
            placeholder="Contoh: Wireless Ergonomic Mouse MX Master"
            autoComplete="off"
            required
            register={register("name")}
            error={errors.name?.message}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              name="category_id"
              id="product-category"
              label="Kategori Produk"
              required
              placeholder={
                categoryQuery.isLoading
                  ? "Memuat kategori..."
                  : "Pilih kategori"
              }
              placeholderValue={0}
              options={categoryOptions}
              register={register("category_id", { valueAsNumber: true })}
              error={errors.category_id?.message}
              disabled={categoryQuery.isLoading || categories.length === 0}
            />

            <Input
              name="unit"
              id="product-unit"
              label="Satuan (Unit)"
              placeholder="PCS, UNIT, RIM"
              maxLength={15}
              required
              register={register("unit")}
              error={errors.unit?.message}
            />
          </div>

          <Input
            name="minimum_stock"
            id="product-minimum-stock"
            label="Stok Minimum"
            type="number"
            min={0}
            step={1}
            required
            tooltip="Batas minimum dibandingkan dengan stok produk pada setiap gudang, bukan total semua gudang."
            register={register("minimum_stock", { valueAsNumber: true })}
            error={errors.minimum_stock?.message}
          />

          <Textarea
            name="description"
            id="product-description"
            label="Deskripsi"
            rows={3}
            maxLength={500}
            placeholder="Deskripsi singkat produk (opsional)"
            register={register("description")}
            error={errors.description?.message}
          />

          <InputFile
            name="image"
            id="product-image"
            label="Gambar Produk"
            accept="image/png,image/jpeg,image/webp"
            previewUrl={mode === "edit" ? product?.image : undefined}
            helperText="JPG, PNG, atau WebP; maksimum 2 MB. Kosongkan jika tidak ingin mengganti gambar."
            register={register("image")}
            error={errors.image?.message as string | undefined}
          />

          <label
            htmlFor="product-active"
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-base-300 p-3"
          >
            <input
              id="product-active"
              type="checkbox"
              className="checkbox checkbox-primary"
              disabled={isSaving}
              {...register("is_active")}
            />
            <span>
              <span className="block font-semibold">Produk aktif</span>
              <span className="text-xs text-gray-500">
                Produk aktif dapat digunakan pada proses operasional.
              </span>
            </span>
          </label>
        </fieldset>
      )}
    </Modal>
  );
};
export default ModalProduct;
