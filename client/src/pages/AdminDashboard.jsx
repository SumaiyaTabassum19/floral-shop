import AdminNavbar from "../components/AdminNavbar/AdminNavbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";   
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/orders/admin/stats",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load dashboard."
                );
            }

            setStats(data.stats);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="dashboard-container">
                    <p className="dashboard-loading">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <AdminNavbar/>  
            
        <div className="admin-dashboard">
            <div className="dashboard-container">

                {/* HEADER */}
                <div className="dashboard-header">
                    <div>
                        <p className="dashboard-label">
                            FLORAL CANVAS
                        </p>

                        <h1>Admin Dashboard</h1>

                        <p>
                            Manage your flower shop orders and sales.
                        </p>
                    </div>

                    {/* <div className="dashboard-actions">
                        <button
                            onClick={fetchStats}
                            className="dashboard-refresh"
                        >
                            Refresh
                        </button>

                        {/* <Link
                            to="/admin/orders"
                            className="orders-link"
                        >
                            View Orders
                        </Link> */}
                    <div className="dashboard-actions">

                        <button
                            onClick={fetchStats}
                            className="dashboard-refresh"
                        >
                            Refresh
                        </button>

                        <Link
                            to="/admin/products"
                            className="products-link"
                        >
                            Manage Products
                        </Link>

                        <Link
                            to="/admin/orders"
                            className="orders-link"
                        >
                            View Orders
                        </Link>

                    </div>
                </div>
            </div>


            {/* ERROR */}
            {error && (
                <div className="dashboard-error">
                    {error}
                </div>
            )}


            {/* STATISTICS */}
            {stats && (
                <>
                    <div className="stats-grid">

                        <div className="stat-card">
                            <div className="stat-icon">
                                🛍️
                            </div>

                            <div>
                                <p>Total Orders</p>

                                <h2>
                                    {stats.total_orders || 0}
                                </h2>
                            </div>
                        </div>


                        <div className="stat-card">
                            <div className="stat-icon">
                                ⏳
                            </div>

                            <div>
                                <p>Pending</p>

                                <h2>
                                    {stats.pending_orders || 0}
                                </h2>
                            </div>
                        </div>


                        <div className="stat-card">
                            <div className="stat-icon">
                                ⚙️
                            </div>

                            <div>
                                <p>Processing</p>

                                <h2>
                                    {stats.processing_orders || 0}
                                </h2>
                            </div>
                        </div>


                        <div className="stat-card">
                            <div className="stat-icon">
                                🚚
                            </div>

                            <div>
                                <p>Shipped</p>

                                <h2>
                                    {stats.shipped_orders || 0}
                                </h2>
                            </div>
                        </div>


                        <div className="stat-card">
                            <div className="stat-icon">
                                ✅
                            </div>

                            <div>
                                <p>Completed</p>

                                <h2>
                                    {stats.completed_orders || 0}
                                </h2>
                            </div>
                        </div>


                        <div className="stat-card revenue-card">
                            <div className="stat-icon">
                                💰
                            </div>

                            <div>
                                <p>Total Revenue</p>

                                <h2>
                                    ৳
                                    {Number(
                                        stats.total_revenue || 0
                                    ).toFixed(2)}
                                </h2>
                            </div>
                        </div>

                    </div>


                    {/* ORDER SUMMARY */}
                    <div className="summary-card">

                        <div>
                            <h2>
                                Order Overview
                            </h2>

                            <p>
                                Current order status summary
                            </p>
                        </div>

                        <div className="summary-list">

                            <div className="summary-row">
                                <span>
                                    Pending Orders
                                </span>

                                <strong>
                                    {stats.pending_orders || 0}
                                </strong>
                            </div>

                            <div className="summary-row">
                                <span>
                                    Processing Orders
                                </span>

                                <strong>
                                    {stats.processing_orders || 0}
                                </strong>
                            </div>

                            <div className="summary-row">
                                <span>
                                    Shipped Orders
                                </span>

                                <strong>
                                    {stats.shipped_orders || 0}
                                </strong>
                            </div>

                            <div className="summary-row">
                                <span>
                                    Completed Orders
                                </span>

                                <strong>
                                    {stats.completed_orders || 0}
                                </strong>
                            </div>

                        </div>

                    </div>

                </>
            )}

        </div>

        </>
    );
}

export default AdminDashboard;