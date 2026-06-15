import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("accesstoken");

  // Se não tiver token → vai pro login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se tiver token → deixa entrar
  return children;
}
