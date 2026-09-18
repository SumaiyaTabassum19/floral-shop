import AdminNavbar from "../components/AdminNavbar/AdminNavbar";
import { useEffect, useState } from "react";
import "./AdminOrders.css";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/orders/admin/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch orders."
                );
            }

            setOrders(data.orders || []);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, status) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/orders/admin/${orderId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update status."
                );
            }

            alert("Order status updated successfully.");

            fetchOrders();
        } catch (error) {
            alert(error.message);
        }
    };

    // Group order items by order
    const groupedOrders = orders.reduce((acc, item) => {
        if (!acc[item.order_id]) {
            acc[item.order_id] = {
                order_id: item.order_id,
                user_id: item.user_id,
                first_name: item.first_name,
                last_name: item.last_name,
                email: item.email,
                phone: item.phone,
                total_amount: item.total_amount,
                status: item.status,
                created_at: item.created_at,
                items: []
            };
        }

        if (item.product_id) {
            acc[item.order_id].items.push({
                product_id: item.product_id,
                product_name: item.product_name,
                product_image: item.product_image,
                quantity: item.quantity,
                price: item.price
            });
        }

        return acc;
    }, {});

    const orderList = Object.values(groupedOrders);

    if (loading) {
        return (
            <div className="admin-orders-page">
                <div className="admin-orders-container">
                    <h1>Admin Orders</h1>
                    <p className="loading-text">
                        Loading orders...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <AdminNavbar/>
        <div className="admin-orders-page">
            <div className="admin-orders-container">

                <div className="admin-orders-header">
                    <div>
                        <p className="admin-label">
                            FLOWER CANVAS
                        </p>

                        <h1>Order Management</h1>

                        <p>
                            Manage customer orders and delivery status.
                        </p>
                    </div>

                    <button
                        className="refresh-btn"
                        onClick={fetchOrders}
                    >
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="admin-error">
                        {error}
                    </div>
                )}

                {orderList.length === 0 ? (
                    <div className="empty-orders">
                        <h2>No Orders Yet</h2>
                        <p>
                            Customer orders will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="orders-list">

                        {orderList.map((order) => (
                            <div
                                className="admin-order-card"
                                key={order.order_id}
                            >

                                <div className="order-top">

                                    <div>
                                        <h2>
                                            Order #{order.order_id}
                                        </h2>

                                        <p>
                                            {new Date(
                                                order.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <select
                                        value={order.status}
                                        onChange={(e) =>
                                            updateStatus(
                                                order.order_id,
                                                e.target.value
                                            )
                                        }
                                        className={`status-select ${order.status
                                            .toLowerCase()
                                            .replace(" ", "-")}`}
                                    >
                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Processing">
                                            Processing
                                        </option>

                                        <option value="Shipped">
                                            Shipped
                                        </option>

                                        <option value="Completed">
                                            Completed
                                        </option>
                                    </select>

                                </div>


                                <div className="customer-info">

                                    <h3>Customer Information</h3>

                                    <p>
                                        <strong>Name:</strong>{" "}
                                        {order.first_name}{" "}
                                        {order.last_name}
                                    </p>

                                    <p>
                                        <strong>Email:</strong>{" "}
                                        {order.email}
                                    </p>

                                    <p>
                                        <strong>Phone:</strong>{" "}
                                        {order.phone || "N/A"}
                                    </p>

                                </div>


                                <div className="order-products">

                                    <h3>Products</h3>

                                    {order.items.map((item, index) => (
                                        <div
                                            className="order-product"
                                            key={index}
                                        >

                                            <div className="product-details">

                                                <div>
                                                    <strong>
                                                        {item.product_name ||
                                                            `Product #${item.product_id}`}
                                                    </strong>

                                                    <p>
                                                        Quantity:{" "}
                                                        {item.quantity}
                                                    </p>
                                                </div>

                                            </div>

                                            <span>
                                                $
                                                {(
                                                    item.price *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </span>

                                        </div>
                                    ))}

                                </div>


                                <div className="order-bottom">

                                    <span>
                                        Total Amount
                                    </span>

                                    <strong>
                                        $
                                        {Number(
                                            order.total_amount
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>
            
        </div>

        </>

    );
}

export default AdminOrders;