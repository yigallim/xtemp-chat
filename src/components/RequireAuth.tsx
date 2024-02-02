import useAuth from "../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type RequireAuthProps = {
  navigatePath: string;
  onNavigate?: () => void;
};

export default function RequireAuth({ navigatePath, onNavigate }: RequireAuthProps) {
  const { id } = useAuth();
  const location = useLocation();

  if (id) {
    return <Outlet />;
  } else {
    setTimeout(() => onNavigate?.(), 0);
    return <Navigate to={navigatePath} state={{ from: location }} replace />;
  }
}
``;
