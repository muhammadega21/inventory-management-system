import {
  ArrowDown,
  ArrowLeftRight,
  ArrowRight,
  ArrowUp,
  CircleAlert,
  ClipboardCheck,
  Scale,
  Shapes,
  Square,
} from "lucide-react";
import { Link } from "react-router";
import Card from "../../components/dashboard/Card";
import { BarChart } from "../../components/chart/BarChart";
import PageHeader from "../../components/dashboard/PageHeader";
import { breadcrumbs } from "../../utils/breadcrumbs";

const DashboardPage = () => {
  return (
    <div>
      {/* Page Hero */}
      <PageHeader
        title="Dashboard"
        description="Ringkasan operasional stok fisik dan pergerakan mutasi lintas gudang secara realtime."
        breadcrumbs={breadcrumbs.dashboard}
      >
        <label className="text-sm">Fasilitas:</label>

        <select defaultValue="all" className="select select-sm w-full">
          <option value="all">Semua Gudang</option>
          <option value="1">Gudang 1</option>
          <option value="2">Gudang 2</option>
          <option value="3">Gudang 3</option>
        </select>
      </PageHeader>
      <div className="content mt-6">
        {/* Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card
            title="Total Produk"
            value={1248}
            sideText="SKU"
            description="Master Data terdaftar aktif"
            icon={Shapes}
          >
            <p className="text-success font-semibold">+12 SKU bulan ini</p>{" "}
            <Link to={"/products"} className="text-primary font-semibold">
              {" "}
              Kelola Produk{" "}
              <ArrowRight className="inline-block size-3 ml-1" />{" "}
            </Link>
          </Card>
          <Card
            title="Total Stok Fisik"
            value={84320}
            sideText="Unit"
            description="Di 4 fasilitas gudang aktif"
            icon={ClipboardCheck}
            iconColor="text-success"
          >
            <p className="text-success font-semibold">+4.2% pekan ini</p>{" "}
            <Link to={"/products"} className="font-semibold text-gray-600">
              Realtime sync
            </Link>
          </Card>
          <Card
            title="Stok Menipis"
            value={86}
            valueColor="text-error"
            sideText="SKU-Lokasi"
            description="Stok fisik &le; Batas Maksimum"
            icon={CircleAlert}
            iconColor="text-error"
          >
            <p className="text-error font-semibold">4 Habis (0 unit)</p>{" "}
            <Link to={"/products"} className="text-primary font-semibold">
              {" "}
              Lihat di Inventory{" "}
              <ArrowRight className="inline-block size-3 ml-1" />{" "}
            </Link>
          </Card>
          <Card
            title="Transaksi Hari Ini"
            value={142}
            sideText="Transaksi"
            description="Tercatat hari ini"
            icon={ArrowLeftRight}
            iconColor="text-warning"
          >
            <p className="text-success font-semibold flex gap-1 items-center ">
              <ArrowDown size={14} /> 88 In
            </p>
            <p className="text-error font-semibold flex gap-1 items-center justify-center">
              <ArrowUp size={14} /> 46 Out
            </p>
            <p className="text-warning font-semibold flex gap-1 items-center justify-end">
              <Scale size={14} /> 8 Adj
            </p>
          </Card>
        </div>

        {/* Charts */}
        <div className="mt-4">
          <div className="bg-white border border-gray-300 p-4 rounded-md">
            <div className="mb-4">
              <div className="flex items-center gap-4 ">
                <h2 className="text-xl font-semibold">
                  Aktivitas Transaksi Stok 7 Hari Terakhir
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2 items-center">
                    <div className="text-success flex items-center gap-2">
                      <Square size={14} className=" bg-success rounded-xs" />
                      <ArrowDown size={16} />
                    </div>
                    <p className="text-sm font-semibold">
                      Stock In: <span className="font-bold">12480 Unit</span>
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="text-error flex items-center gap-2">
                      <Square size={14} className=" bg-error rounded-xs" />
                      <ArrowUp size={16} />
                    </div>
                    <p className="text-sm font-semibold">
                      Stock Out: <span className="font-bold">8640 Unit</span>
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Volume pergerakan fisik barang masuk vs keluar harian (dalam
                Unit).
              </p>
            </div>
            <BarChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
