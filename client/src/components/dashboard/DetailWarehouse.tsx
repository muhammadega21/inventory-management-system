import { NotebookText, PackageSearch, X } from "lucide-react";
import { Link } from "react-router";

interface DetailWarehouseProps {
  name: string;
  code: string;
  isActive: boolean;
  description: string;
  address: string;
  skuCount: number;
  totalQuantity: number;
  link: string;
  buttonCloseAction: () => void;
}

const DetailWarehouse = ({
  name,
  code,
  isActive,
  description,
  address,
  skuCount,
  totalQuantity,
  link,
  buttonCloseAction,
}: DetailWarehouseProps) => {
  return (
    <div className="w-96 bg-white p-4 rounded-md shadow">
      <div className="border-b border-gray-200 pb-3">
        <div className="flex justify-between items-center ">
          <div className="flex items-center gap-1">
            <NotebookText size={20} className="text-primary" />
            <h1 className="text-lg font-semibold">Detail Gudang</h1>
          </div>
          {isActive ? (
            <span className="text-success bg-accent/70 px-4 rounded-full font-semibold text-sm">
              Active
            </span>
          ) : (
            <span className="text-gray-800 bg-gray-700/30 px-4 rounded-full font-semibold text-sm">
              Inactive
            </span>
          )}
        </div>
        <div className="flex items-start gap-2  mt-2">
          <p>{name}</p>
          <span className="text-gray-700">&bull;</span>
          <p className="text-gray-700 font-semibold whitespace-nowrap">
            {code}
          </p>
        </div>
      </div>

      <div className="mt-3 border-b border-gray-200 pb-3">
        <div className="text-sm">
          {description && (
            <div className="mb-1">
              <p className="font-semibold">Deskripsi</p>
              <p className="text-gray-700">{description}</p>
            </div>
          )}

          <div>
            <p className="font-semibold">Alamat</p>
            <p className="text-gray-700">{address}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2 items-center">
          <div className="py-2 px-3 bg-primary/10 w-full">
            <div className="text-sm flex gap-1 items-center">
              <h3 className="font-semibold text-primary">SKU/lokasi</h3>
            </div>
            <p className="mt-1 font-bold text-lg">{skuCount}</p>
          </div>
          <div className="py-2 px-3 bg-primary/10 w-full">
            <div className="text-sm flex gap-1 items-center">
              <h3 className="font-semibold text-primary">Quantity</h3>
            </div>
            <p className="mt-1 font-bold text-lg">{totalQuantity}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 text-sm">
        <div className="flex items-center justify-between font-semibold px-3">
          <h2>Top 3 SKU</h2>
          <p>Stok terbanyak</p>
        </div>
        <ul className="mt-2">
          <li className="flex justify-between items-center bg-primary/10 p-3 rounded mb-2">
            <div>
              <h3 className="max-w-36">Wireless Barcode Scanner</h3>
              <span className="text-primary font-semibold">PROD-00004</span>
            </div>
            <p className="text-base font-semibold">50 pcs</p>
          </li>
          <li className="flex justify-between items-center bg-primary/10 p-3 rounded mb-2">
            <div>
              <h3 className="max-w-36">Wireless Barcode Scanner</h3>
              <span className="text-primary font-semibold">PROD-00004</span>
            </div>
            <p className="text-base font-semibold">50 pcs</p>
          </li>
          <li className="flex justify-between items-center bg-primary/10 p-3 rounded mb-2">
            <div>
              <h3 className="max-w-36">Wireless Barcode Scanner</h3>
              <span className="text-primary font-semibold">PROD-00004</span>
            </div>
            <p className="text-base font-semibold">50 pcs</p>
          </li>
        </ul>
      </div>

      <Link to={link} className="btn btn-primary w-full mt-3">
        <PackageSearch size={16} />
        Buka Inventory Gudang ini
      </Link>
      <button className="btn w-full mt-2" onClick={buttonCloseAction}>
        <X size={20} /> Tutup Detail Gudang
      </button>
    </div>
  );
};

export default DetailWarehouse;
