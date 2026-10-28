import {
  CircleMinus,
  FunnelX,
  IdCard,
  Pen,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import { breadcrumbs } from "../../utils/breadcrumbs";
import { Pagination } from "../../components/Pagination";
import Card from "../../components/dashboard/Card";

const UserPage = () => {
  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="User Management"
        description="Kelola akun pengguna, peran akses (ADMIN & STAFF), dan status aktifitas operasional sistem logistik."
        breadcrumbs={breadcrumbs.users}
      >
        <button type="button" className="btn btn-primary btn-sm">
          <Plus size={16} /> Tambah User
        </button>
      </PageHeader>
      {/* Cards */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          title="Total Pengguna"
          description="Semua akun diverifikasi"
          icon={Users}
          iconColor="text-primary"
          value={"6 User"}
        />
        <Card
          title="Role Admin"
          description="Akses konfigurasi & master data"
          icon={ShieldAlert}
          iconColor="text-primary"
          value={"2 Admin"}
        />
        <Card
          title="Role Staff"
          description="Operasional transaksi & mutasi"
          icon={IdCard}
          iconColor="text-primary"
          value={"4 Staff"}
        />
        <Card
          title="Integrasi Status"
          description="Audit integritas terjaga"
          icon={ShieldCheck}
          iconColor="text-primary"
          value={5}
          sideText="Aktif / 1 Nonaktif"
          sideTextClass="text-base!"
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
              placeholder="Cari nama, email, atau peran"
              className="w-full"
            />
          </label>
        </div>
        <select className="select" aria-label="Filter peran">
          <option value="all">Semua peran (role)</option>
          <option value="active">Admin</option>
          <option value="inactive">Staff</option>
        </select>
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
                <th>Nama</th>
                <th>Email</th>
                <th>Peran (Role)</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="flex items-center gap-2 ">
                    <div className="flex w-8 h-8 justify-center items-center self-center bg-primary text-xs rounded-full font-semibold text-white">
                      MS
                    </div>
                    <p className="whitespace-nowrap font-semibold">
                      Marcus Sterling
                    </p>
                  </div>
                </td>
                <td>Marcus@example.com</td>
                <td>
                  <span className="badge badge-primary font-semibold uppercase">
                    Admin
                  </span>
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
                <td>
                  <div className="flex items-center gap-2 ">
                    <div className="flex w-8 h-8 justify-center items-center self-center bg-primary text-xs rounded-full font-semibold text-white">
                      RH
                    </div>
                    <p className="whitespace-nowrap font-semibold">
                      Rahmat Hidayat
                    </p>
                  </div>
                </td>
                <td>rahmat.h@stockflow.id</td>
                <td>
                  <span className="badge bg-gray-200 text-gray-700 font-semibold uppercase">
                    Staff
                  </span>
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

export default UserPage;
