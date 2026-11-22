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
import {
  useDeleteWarehouse,
  useGetWarehouseById,
  useGetWarehouses,
  useGetWarehouseSummary,
} from "../../hook/useWareshouse";
import useDocumentTitle from "../../hook/useDocumentTitle";
import { useDebounce } from "use-debounce";
import type {
  WarehouseListItem,
  WarehouseSortBy,
} from "../../type/warehouse";
import { showAlert } from "../../utils/swal";
import { getApiErrorMessage } from "../../utils/apiError";
import ModalWarehouse from "../../components/modal/ModalWarehouse";

interface WarehouseModalState {
  isOpen: boolean;
  mode: "add" | "edit";
  warehouse?: WarehouseListItem;
}

const WarehousePage = () => {
  useDocumentTitle("Warehouse Page");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search.trim(), 400);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<WarehouseSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [warehouseModal, setWarehouseModal] = useState<WarehouseModalState>({
    isOpen: false,
    mode: "add",
  });
  const [openDetailWarehouse, setOpenDetailWarehouse] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<WarehouseListItem | null>(null);

  const summaryQuery = useGetWarehouseSummary();
  const deleteMutation = useDeleteWarehouse();

  const warehouseQuery = useGetWarehouses({
    page,
    limit,
    search: debouncedSearch || undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    sortBy,
    sortOrder,
  });
  const warehouseDetailQuery = useGetWarehouseById(
    selectedWarehouse?.id ?? 0,
    openDetailWarehouse,
  );

  const warehouses = warehouseQuery.data?.data ?? [];
  const warehouseDetail = warehouseDetailQuery.data?.data;
  const meta = warehouseQuery.data?.meta;
  const totalPages = meta?.totalPages ?? 0;
  const summary = summaryQuery.data?.data;

  const currentPage =
    meta && meta.totalPages > 0 ? Math.min(page, meta.totalPages) : page;
  const firstRow = meta && meta.total > 0 ? (currentPage - 1) * limit + 1 : 0;
  const lastRow = meta ? Math.min(currentPage * limit, meta.total) : 0;

  const openAddModal = () => {
    setWarehouseModal({ isOpen: true, mode: "add" });
  };

  const openEditModal = (warehouse: WarehouseListItem) => {
    setWarehouseModal({ isOpen: true, mode: "edit", warehouse });
  };

  const closeWarehouseModal = () => {
    setWarehouseModal({ isOpen: false, mode: "add" });
  };

  const handleArchiveWarehouse = async (warehouse: WarehouseListItem) => {
    const confirmed = await showAlert.confirmAction(
      "Arsipkan warehouse ini?",
      `Warehouse "${warehouse.name}" akan dinonaktifkan. Warehouse tetap tercatat dalam riwayat inventaris.`,
      "Ya, arsipkan",
      "Batal",
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(warehouse.id);
      if (warehouses.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }
      showAlert.toast("success", "Warehouse berhasil diarsipkan");
    } catch (error) {
      showAlert.alert(
        "error",
        "Gagal mengarsipkan warehouse",
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

  const retrySummary = () => {
    void summaryQuery.refetch();
  };

  const detailWarehouse = () => {
    setOpenDetailWarehouse(true);
  };

  const closeDetailWarehouse = () => {
    setOpenDetailWarehouse(false);
    setSelectedWarehouse(null);
  };

  return (
    <div>
      {/* Modal */}
      <ModalWarehouse
        isOpen={warehouseModal.isOpen}
        onClose={closeWarehouseModal}
        mode={warehouseModal.mode}
        data={warehouseModal.warehouse}
      />
      {/* Page Header */}
      <PageHeader
        title="Fasilitas Gudang"
        description="Master data lokasi fisik penyimpanan barang untuk pemantauan posisi stok dan mutasi inventaris."
        breadcrumbs={breadcrumbs.warehouses}
      >
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={openAddModal}
        >
          <Plus size={16} /> Tambah Gudang
        </button>
      </PageHeader>

      {/* Cards */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card
          title="Total Fasilitas"
          value={summary?.totalWarehouses}
          sideText="lokasi"
          description={
            summary
              ? `${summary.activeWarehouses} aktif · ${summary.inactiveWarehouses} nonaktif`
              : "Jumlah seluruh fasilitas gudang terdaftar"
          }
          icon={BuildingComplex}
          iconColor="text-gray-700"
          isLoading={summaryQuery.isLoading}
          isFetching={summaryQuery.isFetching}
          isError={summaryQuery.isError}
          onRetry={retrySummary}
        />
        <Card
          title="Cakupan SKU"
          value={summary?.skuLocationCount}
          sideText="SKU-Lokasi"
          description="Kombinasi SKU yang memiliki stok di fasilitas aktif"
          icon={Archive}
          iconColor="text-gray-700"
          isLoading={summaryQuery.isLoading}
          isFetching={summaryQuery.isFetching}
          isError={summaryQuery.isError}
          onRetry={retrySummary}
        />
        <Card
          title="Total Kuantitas Tercatat"
          value={summary?.totalQuantity}
          sideText="kuantitas"
          description="Stok sistem di fasilitas aktif; satuan mengikuti satuan tiap produk"
          icon={Layers2}
          iconColor="text-gray-700"
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
              placeholder="Cari nama nama gudang, kode gudang, kota atau lokasi gudang"
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
          aria-label="Urutkan produk"
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

      {/* Grid */}
      <div className="flex items-start gap-4 mt-4">
        <div
          className={
            openDetailWarehouse
              ? "grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2"
              : "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
          }
        >
          {warehouseQuery.isError && !warehouseQuery.data ? (
            <div className="col-span-full p-8 text-center" role="alert">
              <p className="font-semibold">Daftar warehouse gagal dimuat.</p>
              <p className="mt-1 text-sm text-gray-600">
                {getApiErrorMessage(warehouseQuery.error)}
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm mt-4"
                onClick={() => {
                  void warehouseQuery.refetch();
                }}
              >
                Coba lagi
              </button>
            </div>
          ) : (
            <>
              {warehouseQuery.isError && warehouseQuery.data && (
                <p
                  className="col-span-full px-4 pt-3 text-sm text-warning"
                  role="status"
                >
                  Pembaruan gagal. Data terakhir yang berhasil dimuat tetap
                  ditampilkan.
                </p>
              )}
              {warehouseQuery.isFetching && !warehouseQuery.isLoading && (
                <p
                  className="col-span-full px-4 pt-3 text-sm text-gray-600"
                  role="status"
                >
                  Memuat pembaruan warehouse...
                </p>
              )}
              {warehouseQuery.isLoading ? (
                <div className="col-span-full py-10 text-center">
                  <span className="loading loading-spinner loading-sm mr-2" />
                  Memuat warehouse...
                </div>
              ) : warehouses.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <p className="font-semibold">Warehouse tidak ditemukan</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Coba ubah kata kunci atau reset filter
                  </p>
                </div>
              ) : (
                warehouses.map((warehouse, index) => (
                  <GridWarehouse
                    key={warehouse.id}
                    title={warehouse.name}
                    code={warehouse.code}
                    isActive={warehouse.is_active}
                    number={currentPage * limit - limit + index + 1}
                    city={warehouse.city}
                    address={warehouse.address}
                    sku={warehouse.inventorySummary.skuCount}
                    unitValue={warehouse.inventorySummary.totalQuantity}
                    buttonAction={() => {
                      setSelectedWarehouse(warehouse);
                      detailWarehouse();
                    }}
                    editAction={() => openEditModal(warehouse)}
                    archiveAction={() => void handleArchiveWarehouse(warehouse)}
                    isArchiveDisabled={
                      !warehouse.is_active || deleteMutation.isPending
                    }
                  />
                ))
              )}
            </>
          )}
        </div>

        {/* Detail Warehouse */}
        {openDetailWarehouse && selectedWarehouse && (
          <DetailWarehouse
            name={warehouseDetail?.name ?? selectedWarehouse.name}
            code={warehouseDetail?.code ?? selectedWarehouse.code}
            description={warehouseDetail?.description ?? ""}
            address={warehouseDetail?.address ?? selectedWarehouse.address}
            skuCount={
              warehouseDetail?.inventorySummary.skuCount ??
              selectedWarehouse.inventorySummary.skuCount
            }
            totalQuantity={
              warehouseDetail?.inventorySummary.totalQuantity ??
              selectedWarehouse.inventorySummary.totalQuantity
            }
            topProducts={warehouseDetail?.topProducts ?? []}
            link="/inventories"
            isActive={
              warehouseDetail?.is_active ?? selectedWarehouse.is_active
            }
            isLoading={warehouseDetailQuery.isLoading && !warehouseDetail}
            errorMessage={
              warehouseDetailQuery.isError && !warehouseDetail
                ? getApiErrorMessage(warehouseDetailQuery.error)
                : undefined
            }
            refreshErrorMessage={
              warehouseDetailQuery.isError && warehouseDetail
                ? getApiErrorMessage(warehouseDetailQuery.error)
                : undefined
            }
            onRetry={() => {
              void warehouseDetailQuery.refetch();
            }}
            buttonCloseAction={closeDetailWarehouse}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white p-4 border-t border-gray-200 shadow mt-3">
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
            warehouse
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

export default WarehousePage;
