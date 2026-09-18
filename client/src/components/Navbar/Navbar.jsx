import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./Navbar.css";

function Navbar() {

    const navigate = useNavigate();
    const { cartCount } = useCart();

    // Mobile menu state
    const [menuOpen, setMenuOpen] = useState(false);

    const { user, token, logout } = useAuth();

    const handleLogout = () => {

        logout();

        navigate("/");

    };

    // Check login
    // const token = localStorage.getItem("token");
    // const user = JSON.parse(localStorage.getItem("user"));


    // Logout
    //const handleLogout = () => {

    //localStorage.removeItem("token");
    //localStorage.removeItem("user");

    //navigate("/");

    //};

    return (

        <header className="navbar">

            <div className="nav-container">

                <a href="#home" className="logo">
                    <span>FLoral</span>
                    <small>CANVAS</small>
                </a>


                <nav
                    className={
                        menuOpen
                            ? "nav-links active"
                            : "nav-links"
                    }
                >

                    <a
                        href="#home"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </a>

                    <a
                        href="#about"
                        onClick={() => setMenuOpen(false)}
                    >
                        About
                    </a>

                    <a
                        href="#products"
                        onClick={() => setMenuOpen(false)}
                    >
                        Products
                    </a>

                    <a
                        href="#blogs"
                        onClick={() => setMenuOpen(false)}
                    >
                        Blogs
                    </a>

                    <a
                        href="#reviews"
                        onClick={() => setMenuOpen(false)}
                    >
                        Reviews
                    </a>

                    <a
                        href="#contact"
                        onClick={() => setMenuOpen(false)}
                    >
                        Contact
                    </a>

                </nav>


                <div className="nav-actions">

                    <button
                        className="icon-btn"
                        title="Search"
                    >
                        🔍
                    </button>


                    <button
                        className="icon-btn"
                        title="Wishlist"
                    >
                        ♡
                    </button>


                    <button
                        className="icon-btn cart-btn"
                        title="Cart"
                        onClick={() => navigate("/cart")}
                    >
                        🛒
                        <span>{cartCount}</span>
                    </button>


                    {/* Login / Logout */}

                    {token ? (

                        <>
                            <span className="nav-user">
                                {user?.first_name}
                            </span>

                            <button
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>

                    ) : (

                        <a
                            href="/login"
                            className="login-btn"
                        >
                            Login
                        </a>

                    )}


                    <button
                        className="menu-btn"
                        onClick={() =>
                            setMenuOpen(!menuOpen)
                        }
                    >
                        ☰
                    </button>

                    {
                        token && (

                            <a
                                href="/my-orders"
                                className="my-orders-btn"
                            >
                                My Orders
                            </a>
                        )
                    }

                </div>

            </div>

        </header>

    );

}

export default Navbar;