import { createBrowserRouter, RouterProvider } from "react-router";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../pages/main/DashboardPage";
import InventoryPage from "../pages/main/InventoryPage";
import ProductPage from "../pages/main/ProductPage";
import StockMovementPage from "../pages/main/StockMovementPage";
import ReportPage from "../pages/main/ReportPage";
import CategoryPage from "../pages/master/CategoryPage";
import SupplierPage from "../pages/master/SupplierPage";
import WarehousePage from "../pages/master/WarehousePage";
import UserPage from "../pages/master/UserPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../components/ProtectedRoute";
import DetailProductPage from "../pages/main/DetailProductPage";

const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // Main Page
      {
        index: true,
        Component: DashboardPage,
      },
      {
        path: "products",
        Component: ProductPage,
      },
      {
        path: "products/:slug",
        Component: DetailProductPage,
      },
      {
        path: "inventories",
        Component: InventoryPage,
      },
      {
        path: "stock-movements",
        Component: StockMovementPage,
      },
      {
        path: "reports",
        Component: ReportPage,
      },

      // Master
      {
        path: "categories",
        Component: CategoryPage,
      },
      {
        path: "suppliers",
        Component: SupplierPage,
      },
      {
        path: "warehouses",
        Component: WarehousePage,
      },
      {
        path: "users",
        Component: UserPage,
      },
    ],
  },
]);

export default function AppRouter() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
