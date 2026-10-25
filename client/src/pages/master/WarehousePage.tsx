import {
  Archive,
  BuildingComplex,
  FunnelX,
  Layers2,
  Plus,
  Search,
} from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import { breadcrumbs } from "../../utils/breadcrumbs";
import Card from "../../components/dashboard/Card";
import GridWarehouse from "../../components/dashboard/GridWarehouse";
import { useState } from "react";
import DetailWarehouse from "../../components/dashboard/DetailWarehouse";
import { Pagination } from "../../components/Pagination";

const WarehousePage = () => {
  const [openDetailWarehouse, setOpenDetailWarehouse] = useState(false);
  function detailWarehouse() {
    setOpenDetailWarehouse(true);
  }

  function closeDetailWarehouse() {
    setOpenDetailWarehouse(false);
  }

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Fasilitas Gudang"
        description="Master data lokasi fisik penyimpanan barang untuk pemantauan posisi stok dan mutasi inventaris."
        breadcrumbs={breadcrumbs.warehouses}
      >
        <button type="button" className="btn btn-primary btn-sm">
          <Plus size={16} /> Tambah Gudang
        </button>
      </PageHeader>

      {/* Cards */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card
          title="Total Fasilitas"
          value={4}
          sideText="Titik Logistik Aktif"
          description="100% Siap Operasi Fisik"
          icon={BuildingComplex}
          iconColor="text-gray-700"
        />
        <Card
          title="Cakupan Suku"
          value={1248}
          sideText="Kombinasi SKU/Lokasi"
          description="Tersebar di 4 Hub Pulau Jawa & Sumatera"
          icon={Archive}
          iconColor="text-gray-700"
        />
        <Card
          title="Total Stok Fisik Terdata"
          value={84320}
          sideText="Unit"
          description="Posisi terkini konsolidasi realtime"
          icon={Layers2}
          iconColor="text-gray-700"
        />
      </div>

      {/* Filter */}
      <div className="mt-4 p-4 bg-white flex items-center gap-4 rounded shadow">
        <div className="w-96">
          <label className="input">
            <Search
              size={17}
              className="shrink-0 text-gray-500"
              aria-hidden="true"
            />
            <input
              type="search"
              required
              placeholder="Cari nama nama gudang, kode gudang, kota atau lokasi gudang"
              className="w-full"
            />
          </label>
        </div>
        <select className="select" aria-label="Filter status">
          <option value="all">Semua status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
        <select className="select" aria-label="Urutkan produk">
          <option value="createdAt-desc">Terbaru ditambahkan</option>
          <option value="name-asc">Nama (A–Z)</option>
          <option value="name-desc">Nama (Z–A)</option>
        </select>
        <span className="badge text-gray-700 cursor-pointer">
          <FunnelX size={14} /> Reset Filter
        </span>
      </div>

      {/* Grid */}
      <div className="flex gap-4 mt-4">
        <div
          className={
            openDetailWarehouse
              ? "grid grid-cols-2 gap-3"
              : "grid grid-cols-3 gap-3"
          }
        >
          <GridWarehouse
            title={"Gudang Jakarta Pusat"}
            code="WH-00001"
            isActive={true}
            number={1}
            city="Jakarta"
            address="Kawasan Industri Pulogadung, Jakarta Timur, DKI Jakarta"
            sku={540}
            unitValue={36640}
            buttonAction={detailWarehouse}
          />
          <GridWarehouse
            title={"Gudang Jakarta Pusat"}
            code="WH-00001"
            isActive={true}
            number={1}
            city="Jakarta"
            address="Kawasan Industri Pulogadung, Jakarta Timur, DKI Jakarta"
            sku={540}
            unitValue={36640}
            buttonAction={detailWarehouse}
          />
          <GridWarehouse
            title={"Gudang Jakarta Pusat"}
            code="WH-00001"
            isActive={true}
            number={1}
            city="Jakarta"
            address="Kawasan Industri Pulogadung, Jakarta Timur, DKI Jakarta"
            sku={540}
            unitValue={36640}
            buttonAction={detailWarehouse}
          />
        </div>

        {/* Detail Warehouse */}
        {openDetailWarehouse && (
          <DetailWarehouse
            name="Gudang Jakarta Pusat"
            code="WH-00001"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic adipisci expedita quidem quisquam quis accusamus."
            address="Kawasan Industri Pulogadung, Jl. Pulo Buaran Raya Blok JJ-4, Jakarta Timur, DKI Jakarta 13920"
            skuCount={10}
            totalQuantity={100}
            link=""
            isActive
            buttonCloseAction={closeDetailWarehouse}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white p-4 border-t border-gray-200 shadow mt-3">
        <div className="flex items-center gap-4">
          <p className="text-sm">
            Menampilkan <span className="font-bold">1 - 4</span> dari{" "}
            <span className="font-bold">8</span> Gudang
          </p>
          <div className="flex items-center text-sm gap-2">
            <label>Tampilkan</label>
            <select className="select">
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={30}>30</option>
            </select>
            per halaman
          </div>
        </div>
        <Pagination currentPage={1} totalPages={3} />
      </div>
    </div>
  );
};

export default WarehousePage;
