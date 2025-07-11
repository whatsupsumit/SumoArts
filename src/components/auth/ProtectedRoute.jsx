import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function PrivateRoute({ children, requiresArtist = false }) {
  const { currentUser, isArtist } = useAuth();

  if (!currentUser || currentUser.isGuest) {
    return <Navigate to="/login" />;
  }

  if (requiresArtist && !isArtist()) {
    return <Navigate to="/" />;
  }

  return children;
}
