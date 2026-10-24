import {
  Archive,
  ArrowRight,
  Ban,
  BuildingComplex,
  ClipboardCheck,
  FunnelX,
  House,
  Layers2,
  MapPin,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import { breadcrumbs } from "../../utils/breadcrumbs";
import Card from "../../components/dashboard/Card";

const WarehousePage = () => {
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
        <div className="grid grid-cols-2 gap-3">
          <div className="card bg-base-100 card-md shadow-sm">
            <div className="card-body">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3 font-jetBrains">
                  <span className="py-2 px-3 text-primary text-lg font-semibold bg-primary/40 rounded-lg">
                    01
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold">
                      Gudang Jakarta Pusat
                    </h2>
                    <p className="text-lg text-primary font-semibold">
                      WH-00001
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1 w-max text-success bg-accent/70 px-4 rounded-full font-semibold text-sm">
                  Active
                </span>
              </div>
              <ul className="w-[80%] text-base my-3">
                <li className="flex items-center gap-3 mb-2">
                  <House size={20} className="text-primary" />
                  <p className="font-semibold">Jakarta</p>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={25} className="text-primary" />
                  <p>Kawasan Industri Pulogadung, Jakarta Timur, DKI Jakarta</p>
                </li>
              </ul>
              <div className="flex items-center justify-between gap-4 p-3 rounded bg-primary/10">
                <div>
                  <h3 className="text-base font-semibold uppercase text-gray-700 ">
                    Hubungan Inventaris
                  </h3>
                  <div className="flex items-center gap-2 w-max">
                    <p className="text-xl font-semibold">540 SKU</p>
                    <span className="text-gray-700">&bull;</span>
                    <p className="text-gray-700 text-base">36.640 Unit Fisik</p>
                  </div>
                </div>
                <ClipboardCheck size={24} className="text-primary" />
              </div>
              <div className="flex justify-between items-center gap-4 border-t border-gray-200 mt-3 pt-3">
                <p className="flex items-center gap-1 text-primary font-semibold">
                  Lihat Detail & Stok <ArrowRight size={14} />
                </p>
                <div className="flex items-center gap-4">
                  <span>
                    <Pencil size={20} />
                  </span>
                  <span>
                    <Ban size={20} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-96 bg-black">detail warehouse</div>
      </div>
    </div>
  );
};

export default WarehousePage;
