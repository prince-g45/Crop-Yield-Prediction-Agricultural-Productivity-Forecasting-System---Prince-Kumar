import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {

  const token = localStorage.getItem("access_token");

  const role = localStorage.getItem("role");

  if (!token) {

    return <Navigate to="/" replace />;

  }

  if (role !== "Administrator") {

    return <Navigate to="/farmer-dashboard" replace />;

  }

  return children;

}

export default ProtectedAdminRoute;