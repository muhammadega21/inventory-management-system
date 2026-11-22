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
import type { UserItem, UserRole, UserSortBy } from "../../type/user";
import useDocumentTitle from "../../hook/useDocumentTitle";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import {
  useDeleteUser,
  useGetUsers,
  useGetUserSummary,
} from "../../hook/useUser";
import { showAlert } from "../../utils/swal";
import { getApiErrorMessage } from "../../utils/apiError";
import { getInitials } from "../../utils/getInitials";
import ModalUser from "../../components/modal/ModalUser";

interface UserModalState {
  isOpen: boolean;
  mode: "add" | "edit";
  user?: UserItem;
}

const UserPage = () => {
  useDocumentTitle("User Page");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search.trim(), 400);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [sortBy, setSortBy] = useState<UserSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [userModal, setUserModal] = useState<UserModalState>({
    isOpen: false,
    mode: "add",
  });

  const summaryQuery = useGetUserSummary();
  const deleteMutation = useDeleteUser();

  const userQuery = useGetUsers({
    page,
    limit,
    search: debouncedSearch || undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    sortBy,
    sortOrder,
    role: roleFilter === "all" ? undefined : roleFilter,
  });

  const users = userQuery.data?.data ?? [];
  const meta = userQuery.data?.meta;
  const totalPages = meta?.totalPages ?? 0;
  const summary = summaryQuery.data?.data;

  const currentPage =
    meta && meta.totalPages > 0 ? Math.min(page, meta.totalPages) : page;
  const firstRow = meta && meta.total > 0 ? (currentPage - 1) * limit + 1 : 0;
  const lastRow = meta ? Math.min(currentPage * limit, meta.total) : 0;

  const openAddModal = () => {
    setUserModal({ isOpen: true, mode: "add" });
  };

  const openEditModal = (user: UserItem) => {
    setUserModal({ isOpen: true, mode: "edit", user });
  };

  const closeUserModal = () => {
    setUserModal({ isOpen: false, mode: "add" });
  };

  const handleArchiveUser = async (user: UserItem) => {
    const confirmed = await showAlert.confirmAction(
      "Arsipkan user ini?",
      `User "${user.name}" akan dinonaktifkan. User tetap tercatat dalam riwayat inventaris.`,
      "Ya, arsipkan",
      "Batal",
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(user.id);
      if (users.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }
      showAlert.toast("success", "User berhasil diarsipkan");
    } catch (error) {
      showAlert.alert(
        "error",
        "Gagal mengarsipkan user",
        getApiErrorMessage(error),
      );
    }
  };

  const handleResetFilter = () => {
    setSearch("");
    setStatusFilter("all");
    setRoleFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setLimit(10);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    if (value === "name-desc") {
      setSortBy("name");
      setSortOrder("desc");
    } else if (value === "createdAt-desc") {
      setSortBy("createdAt");
      setSortOrder("desc");
    } else {
      setSortBy("name");
      setSortOrder("asc");
    }
    setPage(1);
  };

  const retrySummary = () => {
    void summaryQuery.refetch();
  };

  return (
    <div>
      {/* Modal */}
      <ModalUser
        isOpen={userModal.isOpen}
        onClose={closeUserModal}
        mode={userModal.mode}
        data={userModal.user}
      />
      {/* Page Header */}
      <PageHeader
        title="User Management"
        description="Kelola akun pengguna, peran akses (ADMIN & STAFF), dan status aktifitas operasional sistem logistik."
        breadcrumbs={breadcrumbs.users}
      >
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={openAddModal}
        >
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
          value={`${summary?.usersCount ?? 0} User`}
          isLoading={summaryQuery.isLoading}
          isFetching={summaryQuery.isFetching}
          isError={summaryQuery.isError}
          onRetry={retrySummary}
        />
        <Card
          title="Role Admin"
          description="Akses konfigurasi & master data"
          icon={ShieldAlert}
          iconColor="text-primary"
          value={`${summary?.adminCount ?? 0} Admin`}
          isLoading={summaryQuery.isLoading}
          isFetching={summaryQuery.isFetching}
          isError={summaryQuery.isError}
          onRetry={retrySummary}
        />
        <Card
          title="Role Staff"
          description="Operasional transaksi & mutasi"
          icon={IdCard}
          iconColor="text-primary"
          value={`${summary?.staffCount ?? 0} Staff`}
          isLoading={summaryQuery.isLoading}
          isFetching={summaryQuery.isFetching}
          isError={summaryQuery.isError}
          onRetry={retrySummary}
        />
        <Card
          title="Integrasi Status"
          description="Audit integritas terjaga"
          icon={ShieldCheck}
          iconColor="text-primary"
          value={summary?.activeUsers ?? 0}
          sideText={`Aktif / ${summary?.inactiveUsers ?? 0} Nonaktif`}
          sideTextClass="text-base!"
          isLoading={summaryQuery.isLoading}
          isFetching={summaryQuery.isFetching}
          isError={summaryQuery.isError}
          onRetry={retrySummary}
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
              value={search}
              onChange={(event) => {
                setSearch(event.currentTarget.value);
                setPage(1);
              }}
            />
          </label>
        </div>
        <select
          className="select"
          aria-label="Filter peran"
          value={roleFilter}
          onChange={(event) => {
            setRoleFilter(event.currentTarget.value as UserRole | "all");
            setPage(1);
          }}
        >
          <option value="all">Semua peran (role)</option>
          <option value="ADMIN">Admin</option>
          <option value="STAFF">Staff</option>
        </select>
        <select
          className="select"
          aria-label="Filter status"
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.currentTarget.value as typeof statusFilter);
            setPage(1);
          }}
        >
          <option value="all">Semua status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
        <select
          className="select"
          aria-label="Urutkan user"
          value={`${sortBy}-${sortOrder}`}
          onChange={(event) => handleSortChange(event.currentTarget.value)}
        >
          <option value="createdAt-desc">Terbaru ditambahkan</option>
          <option value="name-asc">Nama (A–Z)</option>
          <option value="name-desc">Nama (Z–A)</option>
        </select>
        <span
          className="badge text-gray-700 cursor-pointer"
          onClick={handleResetFilter}
        >
          <FunnelX size={14} /> Reset Filter
        </span>
      </div>

      {/* Table */}

      <div className="mt-4 bg-white">
        {userQuery.isError && users.length === 0 ? (
          <div className="p-8 text-center" role="alert">
            <p className="font-semibold">Daftar user gagal dimuat.</p>
            <p className="mt-1 text-sm text-gray-600">
              {getApiErrorMessage(userQuery.error)}
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm mt-4"
              onClick={() => {
                void userQuery.refetch();
              }}
            >
              Coba lagi
            </button>
          </div>
        ) : (
          <>
            {userQuery.isError && users.length > 0 && (
              <p className="px-4 pt-3 text-sm text-warning" role="status">
                Pembaruan gagal. Data terakhir yang berhasil dimuat tetap
                ditampilkan.
              </p>
            )}
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
                  {userQuery.isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center">
                        <span className="loading loading-spinner loading-sm mr-2" />{" "}
                        Memuat user...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <p className="font-semibold">User tidak ditemukan</p>
                        <p className="mt-1 text-sm text-gray-500">
                          Coba ubah kata kunci atau reset filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    users.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="flex items-center gap-2 ">
                            <div className="flex w-8 h-8 justify-center items-center self-center bg-primary text-xs rounded-full font-semibold text-white">
                              {getInitials(item.name)}
                            </div>
                            <p className="whitespace-nowrap font-semibold">
                              {item.name}
                            </p>
                          </div>
                        </td>
                        <td>{item.email}</td>
                        <td>
                          <span
                            className={`badge ${item.role === "ADMIN" ? "badge-primary" : "badge-secondary"}  font-semibold uppercase`}
                          >
                            {item.role}
                          </span>
                        </td>
                        <td>
                          {item.is_active ? (
                            <span className="text-success bg-accent/70 px-4 rounded-full font-semibold">
                              Active
                            </span>
                          ) : (
                            <span className="text-gray-800 bg-gray-700/30  px-4 rounded-full font-semibold">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="text-warning cursor-pointer"
                              title={`Edit ${item.name}`}
                              aria-label={`Edit ${item.name}`}
                              onClick={() => openEditModal(item)}
                            >
                              <Pen size={13} />
                            </button>
                            <button
                              type="button"
                              className="text-error cursor-pointer"
                              title="Arsipkan user"
                              aria-label={`Arsipkan ${item.name}`}
                              disabled={
                                !item.is_active || deleteMutation.isPending
                              }
                              onClick={() => void handleArchiveUser(item)}
                            >
                              <CircleMinus size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white p-4 border-t border-gray-200 shadow">
        <div className="flex items-center gap-4">
          <p className="text-sm">
            Menampilkan{" "}
            <span className="font-bold">
              {firstRow}–{lastRow}
            </span>{" "}
            dari{" "}
            <span className="font-bold">
              {(meta?.total ?? 0).toLocaleString("id-ID")}
            </span>{" "}
            user
          </p>
          <div className="flex items-center text-sm gap-2">
            <label>Tampilkan</label>
            <select
              className="select"
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.currentTarget.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={30}>30</option>
            </select>
            per halaman
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default UserPage;
