import { Bell, ChevronDown, Cog, LogOut, User } from "lucide-react";
import { useLogout, useMe } from "../hook/useAuth";
import { showAlert } from "../utils/swal";
import { getApiErrorMessage } from "../utils/apiError";
import { useNavigate } from "react-router";

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "U";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

const Navbar = () => {
  const { data: user } = useMe();
  const navigate = useNavigate();

  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/login", { replace: true });
    } catch (error) {
      showAlert.alert("error", "Logout gagal", getApiErrorMessage(error));
    }
  };

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
          <div className="flex w-9 h-9 justify-center items-center self-center bg-primary text-sm rounded-full font-semibold text-white">
            {getInitials(user?.name ?? "User")}
          </div>
          <div className="flex flex-col items-start">
            <p className="font-semibold text-sm">{user?.name ?? "Pengguna"}</p>
            <p className="inline text-xs font-semibold px-1.5 py-px rounded border border-primary bg-primary/20 uppercase text-primary ">
              {user?.role ?? "—"}
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
            <button
              type="button"
              onClick={() => handleLogout()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <LogOut size={16} />
              )}
              Keluar
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
