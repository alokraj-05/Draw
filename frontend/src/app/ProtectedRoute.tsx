import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/hooks";
import { Spinner } from "@/appcomponents/ui/spinner";

export const ProtectedRoute = () => {
  const { isAuthenticated, status } = useAppSelector(
    (state) => state.auth
  );

  if (status === "loading") {
    return <Spinner/>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
