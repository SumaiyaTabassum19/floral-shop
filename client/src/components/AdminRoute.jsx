import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute() {
    const { user, loading } = useAuth();

    // Wait until authentication is loaded
    if (loading) {
        return (
            <div style={{ padding: "50px", textAlign: "center" }}>
                Checking admin access...
            </div>
        );
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but not admin
    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    // Admin
    return <Outlet />;
}

export default AdminRoute;