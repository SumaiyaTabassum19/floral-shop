import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminNavbar.css";

function AdminNavbar() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();


    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    return (

        <header className="admin-navbar">

            <div className="admin-navbar-container">


                {/* LOGO */}

                <NavLink
                    to="/admin"
                    className="admin-logo"
                >

                    <span className="admin-logo-main">
                        FLoral
                    </span>

                    <span className="admin-logo-sub">
                        CANVAS
                    </span>

                </NavLink>


                {/* NAVIGATION */}

                <nav className="admin-nav">

                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        Dashboard
                    </NavLink>


                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        Products
                    </NavLink>


                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        Orders
                    </NavLink>

                </nav>


                {/* RIGHT SIDE */}

                <div className="admin-navbar-right">


                    {/* ADMIN USER */}

                    <div className="admin-user">

                        <div className="admin-user-icon">
                            👤
                        </div>

                        <div className="admin-user-info">

                            <span className="admin-user-name">
                                {user?.first_name || "Admin"}
                            </span>

                            <span className="admin-user-role">
                                Administrator
                            </span>

                        </div>

                    </div>


                    {/* VIEW STORE */}

                    <button
                        className="view-store-btn"
                        onClick={() => navigate("/")}
                    >
                        View Store
                    </button>


                    {/* LOGOUT */}

                    <button
                        className="admin-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </header>

    );
}

export default AdminNavbar;