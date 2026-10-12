import Input from "../forms/Input";
import InputFile from "../forms/InputFile";
import Select from "../forms/Select";
import Textarea from "../forms/Textarea";
import Modal, { type ModalProps } from "./Modal";

const ModalProduct = ({ id, modalTitle, type }: ModalProps) => {
  return (
    <Modal id={id} modalTitle={modalTitle} type={type}>
      <Input
        name="name"
        label="Nama Produk"
        placeholder="Contoh: Wireless Ergonomic Mouse MX Master"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          name="unit"
          label="Satuan / Unit"
          required
          options={["PCS", "RIM", "UNIT"]}
        />
        <Select
          name="category_id"
          label="Kategori Produk"
          required
          options={["Aksesoris Komputer", "Alat Tulis Kantor", "Elektronik"]}
        />
      </div>
      <Input
        name="minimum_stock"
        label="Min. Stok"
        value={10}
        type="number"
        required
        tooltip="Jika total agregat di seluruh gudang mencapai atau berada di bawah nilai ini, sistem secara
otomatis mengibarkan alert Low Stock."
      />
      <Textarea
        name="description"
        label="Deskripsi"
        required={false}
        placeholder="Spesifikasi teknis singkat, nomor lot pabrikan, catatan penanganan khusus..."
      />
      <InputFile name="image" label="Gambar Produk" required={false} />
    </Modal>
  );
};

export default ModalProduct;
