import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "@/services/auth";

export default function PrivateRoute() {
  const token = getToken();
  return token ? <Outlet /> : <Navigate to="/login" />;
}
