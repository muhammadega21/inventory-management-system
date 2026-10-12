import {
  Archive,
  ArchiveX,
  CircleMinus,
  Eye,
  FunnelX,
  ListSortDescending,
  Pen,
  Plus,
  ShoppingCart,
  TriangleAlert,
} from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import { breadcrumbs } from "../../utils/breadcrumbs";
import Card from "../../components/dashboard/Card";
import { Link } from "react-router";
import ModalProduct from "../../components/modal/ModalProduct";

const ProductPage = () => {
  return (
    <div>
      {/* Modal */}
      <ModalProduct id="add-product" modalTitle="Produk" type="add" />
      {/* Page Hero */}
      <PageHeader
        title="Katalog Produk"
        description="Katalog spesifikasi dasar dan identitas SKU barang untuk operasional inventaris dan pergerakan stok antar gudang"
        breadcrumbs={breadcrumbs.products}
      >
        <button className="btn btn-primary btn-sm" popoverTarget="add-product">
          <Plus size={16} /> Tambah Produk
        </button>
      </PageHeader>

      {/* Cards */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <Card
          title="Aktif Dipasarkan"
          value={1192}
          icon={Archive}
          iconColor="text-gray-600"
        />
        <Card
          title="SKU Di Bawah Minimum"
          value={18}
          valueColor="text-error"
          sideText="Perlu Reorder"
          sideTextClass="text-error! bg-error/20 rounded-full px-2 "
          icon={TriangleAlert}
          iconColor="text-error"
        />
        <Card
          title="Stok Kosong(Stockout)"
          value={4}
          icon={ShoppingCart}
          iconColor="text-warning"
          sideText="Zero Balance"
          sideTextClass="text-warning! bg-warning/20 rounded-full px-2 "
        />
        <Card
          title="Status Nonaktif (Arsip)"
          value={56}
          icon={ArchiveX}
          iconColor="text-gray-600"
        />
      </div>

      {/* Filters */}
      <div className="mt-4 p-4 bg-white flex items-center gap-4 rounded shadow">
        <div className="w-96">
          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              required
              placeholder="Cari nama produk, Kode SKU"
              className="w-full"
            />
          </label>
        </div>
        <select defaultValue="Semua Kategori" className="select">
          <option>Semua Kategori</option>
          <option>Kategori 1</option>
          <option>Kategori 2</option>
          <option>Kategori 3</option>
        </select>
        <select defaultValue="Semua Status" className="select">
          <option>Semua Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <button className="btn bg-gray-50 text-black border-[#e5e5e5]">
          Nama Produk (A-Z) <ListSortDescending size={14} />
        </button>
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
                <th>Produk</th>
                <th>Kategori</th>
                <th>Satuan (Unit)</th>
                <th>Min. Stok</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.pexels.com/photos/20510003/pexels-photo-20510003.jpeg"
                      alt="Logitech MX Master 3S"
                      className="w-10 h-10 min-w-10 min-h-10 object-cover rounded"
                    />

                    <div>
                      <h2 className="text-sm font-semibold text-nowrap">
                        Logitech MX Master 3S
                      </h2>
                      <p className="text-xs bg-primary/20 text-primary px-2 py-px inline rounded">
                        PROD-00001
                      </p>
                    </div>
                  </div>
                </th>

                <td>Aksesoris Komputer</td>
                <td>PCS</td>
                <td>20 PCS</td>
                <td>
                  <span className="text-success bg-accent/70 px-4 rounded-full font-semibold">
                    Active
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link to={""}>
                      <Eye size={16} />
                    </Link>
                    <span>
                      <Pen size={13} />
                    </span>
                    <span className="text-error">
                      <CircleMinus size={13} />
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <th>
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.pexels.com/photos/6944703/pexels-photo-6944703.jpeg"
                      alt="Logitech MX Master 3S"
                      className="w-10 h-10 min-w-10 min-h-10 object-cover rounded"
                    />

                    <div>
                      <h2 className="text-sm font-semibold text-nowrap">
                        Kertas A4 80gsm PaperOne
                      </h2>
                      <p className="text-xs bg-primary/20 text-primary px-2 py-px inline rounded">
                        PROD-00002
                      </p>
                    </div>
                  </div>
                </th>

                <td>Alat Tulis Kantor</td>
                <td>RIM</td>
                <td>100 rim</td>
                <td>
                  <span className="text-gray-700 bg-gray-700/20 px-4 rounded-full font-semibold">
                    Inactive
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link to={""}>
                      <Eye size={16} />
                    </Link>
                    <span>
                      <Pen size={13} />
                    </span>
                    <span className="text-error">
                      <CircleMinus size={13} />
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <th>
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.pexels.com/photos/5833752/pexels-photo-5833752.jpeg"
                      alt="Logitech MX Master 3S"
                      className="w-10 h-10 min-w-10 min-h-10 object-cover rounded"
                    />

                    <div>
                      <h2 className="text-sm font-semibold text-nowrap">
                        Samsung Monitor 27 inch Curved
                      </h2>
                      <p className="text-xs bg-primary/20 text-primary px-2 py-px inline rounded">
                        PROD-00003
                      </p>
                    </div>
                  </div>
                </th>

                <td>Elektronik & Display</td>
                <td>UNIT</td>
                <td>10 unit</td>
                <td>
                  <span className="text-success bg-accent/70 px-4 rounded-full font-semibold">
                    Active
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link to={""}>
                      <Eye size={16} />
                    </Link>
                    <span>
                      <Pen size={13} />
                    </span>
                    <span className="text-error">
                      <CircleMinus size={13} />
                    </span>
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
            Menampilkan <span className="font-bold">1-7</span> dari{" "}
            <span className="font-bold">1,239</span> produk
          </p>
          <div className="flex items-center text-sm gap-2">
            <label>Tampilkan</label>
            <select className="select">
              <option>10 per halaman</option>
              <option>15 per halaman</option>
              <option>20 per halaman</option>
              <option>25 per halaman</option>
              <option>30 per halaman</option>
            </select>
          </div>
        </div>
        <div className="join">
          <button className="join-item btn btn-disabled">«</button>
          <button className="join-item btn btn-primary pointer-events-none">
            1
          </button>
          <button className="join-item btn">2</button>
          <button className="join-item btn">3</button>
          <button className="join-item btn btn-disabled">...</button>
          <button className="join-item btn">100</button>
          <button className="join-item btn">»</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
