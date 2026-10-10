import { Bell, ChevronDown, Cog, LogOut, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="navbar w-full h-16 bg-white border-b border-gray-200 shadow-xs flex justify-end px-6">
      <Bell size={18} className="opacity-80" />
      <div className="w-px h-6 bg-gray-200 mx-4"></div>
      <div className="">
        <button
          className="flex gap-x-3 cursor-pointer"
          popoverTarget="popover-1"
          style={{ anchorName: "--anchor-1" }}
        >
          <div className="flex h-max self-center bg-primary text-sm p-2 rounded-full font-semibold text-white">
            ME
          </div>
          <div className="flex flex-col items-start">
            <p className="font-semibold text-sm">Muhammad Ega Dermawan</p>
            <p className="inline text-xs font-semibold px-1.5 py-px rounded border border-primary bg-primary/20 uppercase text-primary ">
              Admin
            </p>
          </div>
          <ChevronDown className="self-center opacity-80" size={16} />
        </button>

        <ul
          className="dropdown dropdown-end menu w-52 rounded-box bg-base-100 shadow-sm relative top-4"
          popover="auto"
          id="popover-1"
          style={{ positionAnchor: "--anchor-1" }}
        >
          <li>
            <a>
              <User size={16} />
              Profile
            </a>
          </li>
          <li>
            <a>
              <Cog size={16} />
              Setting
            </a>
          </li>
          <li>
            <a>
              <LogOut size={16} /> Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
