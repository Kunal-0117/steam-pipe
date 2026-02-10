import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  visitCondition: boolean;
  route: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  visitCondition,
  route,
}) => {
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!visitCondition) {
    return <Navigate to={route} state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
