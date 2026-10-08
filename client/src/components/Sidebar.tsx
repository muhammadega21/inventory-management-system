import {
  ArrowLeftRight,
  ChartNoAxesColumn,
  Layers,
  LayoutDashboard,
  Package,
  Tag,
  Truck,
  UsersRound,
  Warehouse,
} from "lucide-react";
import { NavLink } from "react-router";

const Sidebar = () => {
  return (
    <ul className="menu w-full grow">
      {/* Main */}

      <span className="uppercase opacity-60 px-3 my-3 text-xs">Main</span>
      <li className="mb-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${isActive ? " bg-primary text-primary-content" : "hover:bg-primary hover:text-primary-content"}`
          }
        >
          <LayoutDashboard size={18} className="my-1.5 inline-block size-4" />
          <span className="text-sm">Dashboard</span>
        </NavLink>
      </li>
      <li className="mb-1">
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `${isActive ? " bg-primary text-primary-content" : "hover:bg-primary hover:text-primary-content"}`
          }
        >
          <Package size={18} className="my-1.5 inline-block size-4" />
          <span className="text-sm">Products</span>
        </NavLink>
      </li>
      <li className="mb-1">
        <NavLink
          to="/inventories"
          className={({ isActive }) =>
            `${isActive ? " bg-primary text-primary-content" : "hover:bg-primary hover:text-primary-content"}`
          }
        >
          <Layers size={18} className="my-1.5 inline-block size-4" />
          <span className="text-sm">Inventory</span>
        </NavLink>
      </li>
      <li className="mb-1">
        <NavLink
          to="/stock-movements"
          className={({ isActive }) =>
            `${isActive ? " bg-primary text-primary-content" : "hover:bg-primary hover:text-primary-content"}`
          }
        >
          <ArrowLeftRight size={18} className="my-1.5 inline-block size-4" />
          <span className="text-sm">Stock Movements</span>
        </NavLink>
      </li>
      <li className="mb-1">
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `${isActive ? " bg-primary text-primary-content" : "hover:bg-primary hover:text-primary-content"}`
          }
        >
          <ChartNoAxesColumn size={18} className="my-1.5 inline-block size-4" />
          <span className="text-sm">Reports</span>
        </NavLink>
      </li>

      {/* Master */}

      <span className="uppercase opacity-60 px-3 my-3 text-xs">
        Master Data
      </span>
      <li className="my-2">
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `${isActive ? " bg-primary text-primary-content" : "hover:bg-primary hover:text-primary-content"}`
          }
        >
          <Tag size={18} className="my-1.5 inline-block size-4" />
          <span className="text-sm">Categories</span>
        </NavLink>
      </li>
      <li className="mb-1">
        <NavLink
          to="/suppliers"
          className={({ isActive }) =>
            `${isActive ? " bg-primary text-primary-content" : "hover:bg-primary hover:text-primary-content"}`
          }
        >
          <Truck size={18} className="my-1.5 inline-block size-4" />
          <span className="text-sm">Suppliers</span>
        </NavLink>
      </li>
      <li className="mb-1">
        <NavLink
          to="/warehouses"
          className={({ isActive }) =>
            `${isActive ? " bg-primary text-primary-content" : "hover:bg-primary hover:text-primary-content"}`
          }
        >
          <Warehouse size={18} className="my-1.5 inline-block size-4" />
          <span className="text-sm">Warehouses</span>
        </NavLink>
      </li>
      <li className="mb-1">
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `${isActive ? " bg-primary text-primary-content" : "hover:bg-primary hover:text-primary-content"}`
          }
        >
          <UsersRound size={18} className="my-1.5 inline-block size-4" />
          <span className="text-sm">Users</span>
        </NavLink>
      </li>
    </ul>
  );
};

export default Sidebar;
