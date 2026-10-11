import { ArrowRight, Lock, Mail } from "lucide-react";
import logo from "../assets/logo.svg";

const LoginPage = () => {
  return (
    <div className="h-screen grid place-items-center">
      <div className=" w-[40%]">
        <div className="flex items-center justify-center mb-6 px-6 gap-3 w-full border-b border-white/10">
          <div>
            <img src={logo} alt="logo" className="min-w-10" />
          </div>
          <h1 className="font-bold text-2xl">Inventory Management System</h1>
        </div>
        <div className="bg-white px-9 py-6 rounded shadow">
          <div>
            <h1 className="font-bold text-3xl">Masuk ke Akun Anda</h1>
            <p className="text-gray-700 mt-2">
              Gunakan email perusahaan yang terdaftar untuk masuk ke dalam
              Aplikasi
            </p>
          </div>
          <form>
            <div className="my-4 ">
              <div className="flex flex-col ">
                <label className="mb-1">Email Perusahaan</label>
                <label className="input w-full">
                  <Mail className="h-[1em] opacity-50" />
                  <input
                    type="email"
                    className="w-full"
                    placeholder="mail@site.com"
                    required
                  />
                </label>
              </div>
              <div className="flex flex-col mt-3">
                <label className="mb-1">Password</label>
                <label className="input w-full">
                  <Lock className="h-[1em] opacity-50" />
                  <input
                    type="password"
                    className="w-full"
                    placeholder="••••••••••••"
                    required
                  />
                </label>
              </div>
              <label className="label mt-3">
                <input type="checkbox" className="checkbox checkbox-sm" />
                Ingat sesi saya
              </label>
            </div>
            <button className="btn btn-primary w-full">
              Masuk ke Sistem <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
