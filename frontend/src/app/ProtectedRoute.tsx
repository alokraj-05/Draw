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
  //  Fix the shyt, refesh makes the page unauthorized (session is still there, but we get access of dasboard only when we come from "/" meanwhile its redirects us to /login when we hardcode url /dashboard)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
