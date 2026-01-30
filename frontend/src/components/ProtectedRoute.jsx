import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useContext(UserContext);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" />;

  if (role && role !== user.role) return <Navigate to="/" />;

  return children;
}
