import { Lock, Mail } from "lucide-react";
import logo from "../assets/logo.svg";
import useDocumentTitle from "../hook/useDocumentTitle";
import { Navigate, useNavigate } from "react-router";
import { useLogin, useMe } from "../hook/useAuth";
import { useForm } from "react-hook-form";
import { loginFormSchema, type LoginFormInput } from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { showAlert } from "../utils/swal";
import { getApiErrorMessage } from "../utils/apiError";

const LoginPage = () => {
  useDocumentTitle("Login Page");

  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { data: user } = useMe();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
  });

  if (user) return <Navigate to={"/"} replace />;

  const onSubmit = async (formData: LoginFormInput) => {
    try {
      await loginMutation.mutateAsync(formData);
      showAlert.toast("success", "Login successful");
      navigate("/");
    } catch (error: unknown) {
      showAlert.alert(
        "error",
        "Login gagal",
        getApiErrorMessage(error, "Email atau password salah."),
      );
    }
  };

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
          <form onSubmit={handleSubmit(onSubmit)}>
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
                    {...register("email")}
                  />
                </label>
                {errors.email && (
                  <p className="label text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
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
                    {...register("password")}
                  />
                </label>
                {errors.password && (
                  <p className="label text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <label className="label mt-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  {...register("rememberMe")}
                />
                Ingat sesi saya
              </label>
            </div>
            <button
              disabled={loginMutation.isPending}
              className="btn btn-primary w-full"
            >
              {loginMutation.isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Masuk ke Sistem"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
