import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

import "./Navbar.css";


function Navbar() {

    const navigate = useNavigate();

    const { cartCount } = useCart();

    const [menuOpen, setMenuOpen] = useState(false);

    const {
        user,
        token,
        logout
    } = useAuth();


    // =============================
    // LOGOUT
    // =============================

    const handleLogout = () => {

        logout();

        setMenuOpen(false);

        navigate("/");

    };


    // =============================
    // CLOSE MOBILE MENU
    // =============================

    const closeMenu = () => {
        setMenuOpen(false);
    };


    return (

        <header className="navbar">

            <div className="nav-container">


                {/* =========================
                    LOGO
                ========================= */}

                <Link
                    to="/"
                    className="logo"
                    onClick={closeMenu}
                >
                    <span>FLoral</span>
                    <small>CANVAS</small>
                </Link>


                {/* =========================
                    MAIN NAVIGATION
                ========================= */}

                <nav
                    className={
                        menuOpen
                            ? "nav-links active"
                            : "nav-links"
                    }
                >

                    <Link
                        to="/"
                        onClick={closeMenu}
                    >
                        Home
                    </Link>


                    <a
                        href="/#about"
                        onClick={closeMenu}
                    >
                        About
                    </a>


                    <a
                        href="/#products"
                        onClick={closeMenu}
                    >
                        Products
                    </a>


                    <a
                        href="/#blogs"
                        onClick={closeMenu}
                    >
                        Blogs
                    </a>


                    <a
                        href="/#reviews"
                        onClick={closeMenu}
                    >
                        Reviews
                    </a>


                    <a
                        href="/#contact"
                        onClick={closeMenu}
                    >
                        Contact
                    </a>

                </nav>


                {/* =========================
                    NAV ACTIONS
                ========================= */}

                <div className="nav-actions">


                    {/* Search */}

                    <button
                        className="icon-btn"
                        title="Search"
                        type="button"
                    >
                        🔍
                    </button>


                    {/* Wishlist */}

                    <button
                        className="icon-btn"
                        title="Wishlist"
                        type="button"
                    >
                        ♡
                    </button>


                    {/* Cart */}

                    <button
                        className="icon-btn cart-btn"
                        title="Cart"
                        type="button"
                        onClick={() =>
                            navigate("/cart")
                        }
                    >

                        🛒

                        <span>
                            {cartCount}
                        </span>

                    </button>


                    {/* =========================
                        AUTHENTICATION
                    ========================= */}

                    {token ? (

                        <>

                            <span className="nav-user">
                                {user?.first_name}
                            </span>


                            <button
                                className="logout-btn"
                                type="button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>


                            {/* My Orders */}

                            <Link
                                to="/my-orders"
                                className="my-orders-btn"
                                onClick={closeMenu}
                            >
                                My Orders
                            </Link>

                        </>

                    ) : (

                        <Link
                            to="/login"
                            className="login-btn"
                            onClick={closeMenu}
                        >
                            Login
                        </Link>

                    )}


                    {/* Mobile menu */}

                    <button
                        className="menu-btn"
                        type="button"
                        onClick={() =>
                            setMenuOpen(!menuOpen)
                        }
                    >
                        ☰
                    </button>

                </div>

            </div>

        </header>

    );

}


export default Navbar;