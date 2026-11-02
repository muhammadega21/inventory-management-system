import { useEffect, useState } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import { Pagination } from "../../components/Pagination";
import useDocumentTitle from "../../hook/useDocumentTitle";
import { breadcrumbs } from "../../utils/breadcrumbs";
import { CircleMinus, FunnelX, Pen, Plus, Search } from "lucide-react";
import type { CategoryItem, CategorySortBy } from "../../type/category";
import { useDeleteCategory, useGetCategories } from "../../hook/useCategory";
import { showAlert } from "../../utils/swal";
import { getApiErrorMessage } from "../../utils/apiError";
import ModalCategory from "../../components/modal/ModalCategory";

interface CategoryModalState {
  isOpen: boolean;
  mode: "add" | "edit";
  category?: CategoryItem;
}

const CategoryPage = () => {
  useDocumentTitle("Category Page");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<CategorySortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [categoryModal, setCategoryModal] = useState<CategoryModalState>({
    isOpen: false,
    mode: "add",
  });

  const deleteMutation = useDeleteCategory();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  const categoryQuery = useGetCategories({
    page,
    limit,
    search: debouncedSearch || undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    sortBy,
    sortOrder,
  });

  const categories = categoryQuery.data?.data ?? [];
  const meta = categoryQuery.data?.meta;
  const totalPages = meta?.totalPages ?? 0;

  const currentPage =
    meta && meta.totalPages > 0 ? Math.min(page, meta.totalPages) : page;
  const firstRow = meta && meta.total > 0 ? (currentPage - 1) * limit + 1 : 0;
  const lastRow = meta ? Math.min(currentPage * limit, meta.total) : 0;

  const openAddModal = () => {
    setCategoryModal({ isOpen: true, mode: "add" });
  };

  const openEditModal = (category: CategoryItem) => {
    setCategoryModal({ isOpen: true, mode: "edit", category });
  };

  const closeCategoryModal = () => {
    setCategoryModal({ isOpen: false, mode: "add" });
  };

  const handleArchiveCategory = async (category: CategoryItem) => {
    const confirmed = await showAlert.confirmAction(
      "Arsipkan produk ini?",
      `Category "${category.name}" akan dinonaktifkan. Category tetap tercatat dalam riwayat inventaris.`,
      "Ya, arsipkan",
      "Batal",
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(category.id);
      if (categories.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }
      showAlert.toast("success", "Kategori berhasil diarsipkan");
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
    setDebouncedSearch("");
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
      <ModalCategory
        isOpen={categoryModal.isOpen}
        onClose={closeCategoryModal}
        mode={categoryModal.mode}
        data={categoryModal.category}
      />

      {/* Page Header */}
      <PageHeader
        title="Kategori Produk"
        description="Klasifikasi standar untuk mengelompokkan katalog produk dan menyederhanakan pelaporan
  inventaris gudang secara modular."
        breadcrumbs={breadcrumbs.categories}
      >
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={openAddModal}
        >
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
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.currentTarget.value as typeof statusFilter);
            setPage(1);
          }}
          aria-label="Filter status"
        >
          <option value="all">Semua status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
        <select
          className="select"
          value={`${sortBy}-${sortOrder}`}
          onChange={(event) => handleSortChange(event.currentTarget.value)}
          aria-label="Urutkan kategori"
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
        {categoryQuery.isError && categories.length === 0 ? (
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
                    <th>Nama Kategori</th>
                    <th>Deskripsi</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryQuery.isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center">
                        <span className="loading loading-spinner loading-sm mr-2" />{" "}
                        Memuat kategori…
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <p className="font-semibold">
                          Kategori tidak ditemukan
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Coba ubah kata kunci atau reset filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    categories.map((item, index) => (
                      <tr key={item.id}>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.description ?? "-"}</td>
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
                                onClick={() => void handleArchiveCategory(item)}
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
            kategori
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

export default CategoryPage;
