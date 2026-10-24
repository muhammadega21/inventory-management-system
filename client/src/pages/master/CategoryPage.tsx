import PageHeader from "../../components/dashboard/PageHeader";
import { Pagination } from "../../components/Pagination";
import { breadcrumbs } from "../../utils/breadcrumbs";
import { CircleMinus, FunnelX, Pen, Plus, Search } from "lucide-react";

const CategoryPage = () => {
  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Kategori Produk"
        description="Klasifikasi standar untuk mengelompokkan katalog produk dan menyederhanakan pelaporan
  inventaris gudang secara modular."
        breadcrumbs={breadcrumbs.categories}
      >
        <button type="button" className="btn btn-primary btn-sm">
          <Plus size={16} /> Tambah Kategori
        </button>
      </PageHeader>

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
              placeholder="Cari nama kategori"
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

      {/* Table */}

      <div className="mt-4 bg-white">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Kategori</th>
                <th>Deskripsi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Aksesoris Komputer</td>
                <td>
                  Mouse, keyboard, kabel data, webcam, dan perangkat eksternal
                  USB.
                </td>
                <td>
                  <span className="text-success bg-accent/70 px-4 rounded-full font-semibold">
                    Active
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-warning cursor-pointer"
                    >
                      <Pen size={13} />
                    </button>
                    <button type="button" className="text-error cursor-pointer">
                      <CircleMinus size={13} />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Elektronik & Display</td>
                <td>
                  Panel LCD monitor, modul HDMI switch, dan display terminal
                  kasir.
                </td>
                <td>
                  <span className="text-gray-800 bg-gray-700/30  px-4 rounded-full font-semibold">
                    Inactive
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-warning cursor-pointer"
                    >
                      <Pen size={13} />
                    </button>
                    <button type="button" className="text-error cursor-pointer">
                      <CircleMinus size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white p-4 border-t border-gray-200 shadow">
        <div className="flex items-center gap-4">
          <p className="text-sm">
            Menampilkan <span className="font-bold">1 - 4</span> dari{" "}
            <span className="font-bold">8</span> kategori
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

export default CategoryPage;
