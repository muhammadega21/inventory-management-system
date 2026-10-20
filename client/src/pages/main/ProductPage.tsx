import {
  Archive,
  ArchiveX,
  CircleMinus,
  Eye,
  FunnelX,
  Pen,
  Plus,
  Search,
  ShoppingCart,
  TriangleAlert,
} from "lucide-react";

import noImage from "../../assets/no-image-icon.webp";

import PageHeader from "../../components/dashboard/PageHeader";
import { breadcrumbs } from "../../utils/breadcrumbs";
import Card from "../../components/dashboard/Card";
import { Link } from "react-router";
import ModalProduct from "../../components/modal/ModalProduct";
import useDocumentTitle from "../../hook/useDocumentTitle";
import { useGetProducts, useGetProductSummary } from "../../hook/useProduct";
import { useEffect, useState } from "react";
import type { ProductSortBy } from "../../type/product";
import { useGetCategories } from "../../hook/useCategory";
import { getApiErrorMessage } from "../../utils/apiError";
import { useMe } from "../../hook/useAuth";
import { Pagination } from "../../components/Pagination";

const ProductPage = () => {
  useDocumentTitle("Product Page");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<ProductSortBy>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data: user } = useMe();
  const summaryQuery = useGetProductSummary();
  const categoryQuery = useGetCategories();
  const isAdmin = user?.role === "ADMIN";

  // Pencarian dikirim setelah pengguna berhenti mengetik selama 400 ms.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  const productQuery = useGetProducts({
    page,
    limit,
    search: debouncedSearch || undefined,
    categoryId: categoryId === "all" ? undefined : Number(categoryId),
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    sortBy,
    sortOrder,
  });

  const products = productQuery.data?.data ?? [];
  const meta = productQuery.data?.meta;
  const categories = categoryQuery.data?.items ?? [];
  const summary = summaryQuery.data?.data;
  const totalPages = meta?.totalPages ?? 0;
  const firstRow = meta && meta.total > 0 ? (page - 1) * limit + 1 : 0;
  const lastRow = meta ? Math.min(page * limit, meta.total) : 0;

  useEffect(() => {
    // Jika filter mengurangi jumlah halaman, pindah ke halaman terakhir yang tersedia.
    if (meta && page > Math.max(meta.totalPages, 1)) {
      setPage(Math.max(meta.totalPages, 1));
    }
  }, [meta, page]);

  const handleResetFilter = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategoryId("all");
    setStatusFilter("all");
    setSortBy("name");
    setSortOrder("asc");
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
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          title="Produk Aktif"
          value={summary?.activeProducts}
          description="Master produk yang aktif"
          icon={Archive}
          iconColor="text-success"
          isLoading={summaryQuery.isLoading}
          isFetching={summaryQuery.isFetching}
          isError={summaryQuery.isError}
          onRetry={() => {
            void summaryQuery.refetch();
          }}
        />
        <Card
          title="Lokasi Stok Menipis"
          value={summary?.lowStock}
          description="Catatan inventaris di bawah batas minimum"
          valueColor="text-error"
          sideText="Perlu ditinjau"
          sideTextClass="rounded-full bg-error/10 px-2 py-1 text-error"
          icon={TriangleAlert}
          iconColor="text-error"
          isLoading={summaryQuery.isLoading}
          isFetching={summaryQuery.isFetching}
          isError={summaryQuery.isError}
          onRetry={() => {
            void summaryQuery.refetch();
          }}
        />
        <Card
          title="Lokasi Stok Kosong"
          value={summary?.stockout}
          description="Catatan inventaris dengan kuantitas nol"
          sideText="Zero balance"
          sideTextClass="rounded-full bg-warning/10 px-2 py-1 text-warning"
          icon={ShoppingCart}
          iconColor="text-warning"
          isLoading={summaryQuery.isLoading}
          isFetching={summaryQuery.isFetching}
          isError={summaryQuery.isError}
          onRetry={() => {
            void summaryQuery.refetch();
          }}
        />
        <Card
          title="Produk Diarsipkan"
          value={summary?.inactiveProducts}
          description="Master produk nonaktif"
          icon={ArchiveX}
          iconColor="text-gray-500"
          isLoading={summaryQuery.isLoading}
          isFetching={summaryQuery.isFetching}
          isError={summaryQuery.isError}
          onRetry={() => {
            void summaryQuery.refetch();
          }}
        />
      </div>

      {/* Filters */}
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
              placeholder="Cari nama produk, Kode SKU"
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
          value={categoryId}
          onChange={(event) => {
            setCategoryId(event.currentTarget.value);
            setPage(1);
          }}
          aria-label="Filter kategori"
        >
          <option value="all">Semua kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
          aria-label="Urutkan produk"
        >
          <option value="name-asc">Nama (A–Z)</option>
          <option value="name-desc">Nama (Z–A)</option>
          <option value="createdAt-desc">Terbaru ditambahkan</option>
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
        {productQuery.isError && products.length === 0 ? (
          <div className="p-8 text-center" role="alert">
            <p className="font-semibold">Daftar produk gagal dimuat.</p>
            <p className="mt-1 text-sm text-gray-600">
              {getApiErrorMessage(productQuery.error)}
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm mt-4"
              onClick={() => {
                void productQuery.refetch();
              }}
            >
              Coba lagi
            </button>
          </div>
        ) : (
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
                {productQuery.isLoading ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="py-10 text-center">
                      <span className="loading loading-spinner loading-sm mr-2" />{" "}
                      Memuat produk…
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="py-12 text-center">
                      <p className="font-semibold">Produk tidak ditemukan</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Coba ubah kata kunci atau reset filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr>
                      <th>
                        <div className="flex items-center gap-2">
                          <img
                            src={item.image ?? noImage}
                            alt={item.name}
                            className="w-10 h-10 min-w-10 min-h-10 object-cover rounded"
                          />

                          <div>
                            <h2 className="text-sm font-semibold text-nowrap">
                              {item.name}
                            </h2>
                            <p className="text-xs bg-primary/20 text-primary px-2 py-px inline rounded">
                              {item.sku}
                            </p>
                          </div>
                        </div>
                      </th>

                      <td>{item.category.name}</td>
                      <td>{item.unit}</td>
                      <td>
                        {item.minimum_stock} {item.unit}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
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
            produk
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
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default ProductPage;
