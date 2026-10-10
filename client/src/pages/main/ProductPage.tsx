import {
  Archive,
  ArchiveX,
  FunnelX,
  ListSortDescending,
  Plus,
  ShoppingCart,
  TriangleAlert,
} from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import { breadcrumbs } from "../../utils/breadcrumbs";
import Card from "../../components/dashboard/Card";

const ProductPage = () => {
  return (
    <div>
      {/* Page Hero */}
      <PageHeader
        title="Katalog Produk"
        description="Katalog spesifikasi dasar dan identitas SKU barang untuk operasional inventaris dan pergerakan stok antar gudang"
        breadcrumbs={breadcrumbs.products}
      >
        <button className="btn btn-primary btn-sm">
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
      <div className="mt-4 p-4 bg-white flex items-center gap-4 rounded">
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
          <option>Status 1</option>
          <option>Status 2</option>
          <option>Status 3</option>
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
                <th></th>
                <th>Name</th>
                <th>Job</th>
                <th>Favorite Color</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td>Blue</td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>2</th>
                <td>Hart Hagerty</td>
                <td>Desktop Support Technician</td>
                <td>Purple</td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>3</th>
                <td>Brice Swyre</td>
                <td>Tax Accountant</td>
                <td>Red</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
