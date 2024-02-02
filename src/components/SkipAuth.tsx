import useAuth from "../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type SkipAuthProps = {
  navigatePath: string;
  onNavigate?: () => void;
};

export default function SkipAuth({ navigatePath, onNavigate }: SkipAuthProps) {
  const { id } = useAuth();
  const location = useLocation();

  if (!id) {
    return <Outlet />;
  } else {
    setTimeout(() => onNavigate?.(), 0);
    return <Navigate to={navigatePath} state={{ from: location }} replace />;
  }
}
