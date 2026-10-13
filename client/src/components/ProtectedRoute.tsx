import React from "react";
import { useMe } from "../hook/useAuth";
import { Navigate } from "react-router";
import Spinner from "./loading/Spinner";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-base-100">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
