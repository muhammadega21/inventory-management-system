import PageHeader from "../../components/dashboard/PageHeader";
import { breadcrumbs } from "../../utils/breadcrumbs";
import { CircleMinus, FunnelX, Pen, Plus, Search } from "lucide-react";
import { Pagination } from "../../components/Pagination";
import useDocumentTitle from "../../hook/useDocumentTitle";
import { useDebounce } from "use-debounce";
import { useState } from "react";
import type { SupplierItem, SupplierSortBy } from "../../type/supplier";
import { useDeleteSupplier, useGetSuppliers } from "../../hook/useSupplier";
import { showAlert } from "../../utils/swal";
import { getApiErrorMessage } from "../../utils/apiError";
import ModalSupplier from "../../components/modal/ModalSupplier";

interface SupplierModalState {
  isOpen: boolean;
  mode: "add" | "edit";
  supplier?: SupplierItem;
}

const SupplierPage = () => {
  useDocumentTitle("Supplier Page");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search.trim(), 400);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<SupplierSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [supplierModal, setSupplierModal] = useState<SupplierModalState>({
    isOpen: false,
    mode: "add",
  });

  const deleteMutation = useDeleteSupplier();

  const supplierQuery = useGetSuppliers({
    page,
    limit,
    search: debouncedSearch || undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    sortBy,
    sortOrder,
  });

  const suppliers = supplierQuery.data?.data ?? [];
  const meta = supplierQuery.data?.meta;
  const totalPages = meta?.totalPages ?? 0;

  const currentPage =
    meta && meta.totalPages > 0 ? Math.min(page, meta.totalPages) : page;
  const firstRow = meta && meta.total > 0 ? (currentPage - 1) * limit + 1 : 0;
  const lastRow = meta ? Math.min(currentPage * limit, meta.total) : 0;

  const openAddModal = () => {
    setSupplierModal({ isOpen: true, mode: "add" });
  };

  const openEditModal = (supplier: SupplierItem) => {
    setSupplierModal({ isOpen: true, mode: "edit", supplier });
  };

  const closeSupplierModal = () => {
    setSupplierModal({ isOpen: false, mode: "add" });
  };

  const handleArchiveSupplier = async (supplier: SupplierItem) => {
    const confirmed = await showAlert.confirmAction(
      "Arsipkan produk ini?",
      `Supplier "${supplier.name}" akan dinonaktifkan. Supplier tetap tercatat dalam riwayat inventaris.`,
      "Ya, arsipkan",
      "Batal",
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(supplier.id);
      if (suppliers.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }
      showAlert.toast("success", "Supplier berhasil diarsipkan");
    } catch (error) {
      showAlert.alert(
        "error",
        "Gagal mengarsipkan kate",
        getApiErrorMessage(error),
      );
    }
  };

  const handleResetFilter = () => {
    setSearch("");
    setStatusFilter("all");
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

  return (
    <div>
      {/* Modal */}
      <ModalSupplier
        isOpen={supplierModal.isOpen}
        onClose={closeSupplierModal}
        mode={supplierModal.mode}
        data={supplierModal.supplier}
      />

      {/* Page Header */}
      <PageHeader
        title="Suppliers (Pemasok)"
        description="Kelola direktori kontak pemasok resmi dan riwayat keterkaitan penerimaan barang (Stock In)."
        breadcrumbs={breadcrumbs.suppliers}
      >
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={openAddModal}
        >
          <Plus size={16} /> Tambah Supplier
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
              placeholder="Cari nama supplier, kontak, atau email..."
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
          value={`${sortBy}-${sortOrder}`}
          onChange={(event) => handleSortChange(event.currentTarget.value)}
          aria-label="Urutkan produk"
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
        {supplierQuery.isError && suppliers.length === 0 ? (
          <p className="px-4 pt-3 text-sm text-warning" role="status">
            Pembaruan gagal. Data terakhir yang berhasil dimuat tetap
            ditampilkan.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                {/* head */}
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Supplier</th>
                    <th>Kode</th>
                    <th>Kontak</th>
                    <th>Email & Kota</th>
                    <th>Alamat</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierQuery.isLoading ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center">
                        <span className="loading loading-spinner loading-sm mr-2" />{" "}
                        Memuat supplier...
                      </td>
                    </tr>
                  ) : suppliers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <p className="font-semibold">
                          Supplier tidak ditemukan
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Coba ubah kata kunci atau reset filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    suppliers.map((item, index) => (
                      <tr key={item.id}>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.code}</td>
                        <td>
                          <div>
                            <p>{item.contact_person}</p>
                            <span>{item.phone}</span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <p>{item.email}</p>
                            <span>{item.city}</span>
                          </div>
                        </td>
                        <td>{item.address}</td>
                        <td>
                          {item.is_active ? (
                            <span className="text-success bg-accent/70 px-4 rounded-full font-semibold">
                              Active
                            </span>
                          ) : (
                            <span className="text-gray-800 bg-gray-700/30 px-4 rounded-full font-semibold">
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
                            {item.is_active && (
                              <button
                                type="button"
                                className="text-error cursor-pointer"
                                title={"Arsipkan produk"}
                                aria-label={`Hapus ${item.name}`}
                                disabled={
                                  !item.is_active || deleteMutation.isPending
                                }
                                onClick={() => void handleArchiveSupplier(item)}
                              >
                                <CircleMinus size={13} />
                              </button>
                            )}
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
              {firstRow} - {lastRow}
            </span>{" "}
            dari{" "}
            <span className="font-bold">
              {(meta?.total ?? 0).toLocaleString("id-ID")}
            </span>{" "}
            supplier
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

export default SupplierPage;
