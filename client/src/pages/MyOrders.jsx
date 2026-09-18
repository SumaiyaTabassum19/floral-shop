import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MyOrders.css";


function MyOrders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =============================
    // IMAGE URL
    // =============================

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }


        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }


        if (
            image.startsWith("/products/")
        ) {
            return image;
        }


        return `/products/${image}`;

    };


    // =============================
    // LOAD ORDERS
    // =============================

    useEffect(() => {

        const loadOrders = async () => {

            try {

                const token =
                    localStorage.getItem("token");


                if (!token) {

                    navigate("/login");

                    return;

                }


                const response = await fetch(
                    "http://localhost:5000/api/orders/my-orders",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load orders."
                    );

                }


                setOrders(
                    data.orders || []
                );


            } catch (error) {

                console.error(
                    "Orders error:",
                    error
                );


                setError(
                    error.message ||
                    "Unable to load orders."
                );


            } finally {

                setLoading(false);

            }

        };


        loadOrders();

    }, [navigate]);


    // =============================
    // LOADING
    // =============================

    if (loading) {

        return (

            <div className="orders-page">

                <div className="orders-message">

                    <h2>
                        Loading orders...
                    </h2>

                    <p>
                        Please wait a moment.
                    </p>

                </div>

            </div>

        );

    }


    // =============================
    // ERROR
    // =============================

    if (error) {

        return (

            <div className="orders-page">

                <div className="orders-message error-message">

                    <h2>
                        Unable to load orders
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Continue Shopping
                    </button>

                </div>

            </div>

        );

    }


    // =============================
    // GROUP ORDERS
    // =============================

    const groupedOrders =
        orders.reduce(
            (groups, item) => {

                if (!groups[item.order_id]) {

                    groups[item.order_id] = {

                        order_id:
                            item.order_id,

                        total_amount:
                            item.total_amount,

                        status:
                            item.status,

                        created_at:
                            item.created_at,

                        items: []

                    };

                }


                if (item.product_id) {

                    groups[
                        item.order_id
                    ].items.push(item);

                }


                return groups;

            },
            {}
        );


    const orderList =
        Object.values(groupedOrders);


    return (

        <div className="orders-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="orders-header">

                <p>
                    FLORAL CANVAS
                </p>

                <h1>
                    My Orders
                </h1>

                <span>
                    View your previous orders
                </span>

            </div>


            {/* =========================
                EMPTY
            ========================= */}

            {orderList.length === 0 ? (

                <div className="empty-orders">

                    <div className="empty-orders-icon">
                        🌸
                    </div>

                    <h2>
                        No orders yet
                    </h2>

                    <p>
                        Your previous orders
                        will appear here.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Continue Shopping
                    </button>

                </div>

            ) : (

                <div className="orders-container">


                    {orderList.map(order => (

                        <div
                            className="order-card"
                            key={order.order_id}
                        >


                            {/* =========================
                                ORDER HEADER
                            ========================= */}

                            <div className="order-top">

                                <div>

                                    <h2>
                                        Order #
                                        {order.order_id}
                                    </h2>

                                    <p>
                                        {new Date(
                                            order.created_at
                                        ).toLocaleDateString(
                                            "en-BD",
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            }
                                        )}
                                    </p>

                                </div>


                                <span
                                    className={
                                        `order-status ${
                                            String(
                                                order.status
                                            ).toLowerCase()
                                        }`
                                    }
                                >
                                    {order.status}
                                </span>

                            </div>


                            {/* =========================
                                ORDER ITEMS
                            ========================= */}

                            <div className="order-items">

                                {order.items.map(
                                    (item, index) => (

                                        <div
                                            className="order-item"
                                            key={
                                                `${order.order_id}-${item.product_id}-${index}`
                                            }
                                        >

                                            <div className="item-info">


                                                {/* Product Image */}

                                                {item.product_image ? (

                                                    <img
                                                        src={
                                                            getImageUrl(
                                                                item.product_image
                                                            )
                                                        }
                                                        alt={
                                                            item.product_name
                                                        }

                                                        onError={(e) => {
                                                            e.currentTarget.style.display =
                                                                "none";
                                                        }}
                                                    />

                                                ) : (

                                                    <div className="order-item-placeholder">
                                                        🌸
                                                    </div>

                                                )}


                                                <div>

                                                    <h3>
                                                        {
                                                            item.product_name ||
                                                            "Flower"
                                                        }
                                                    </h3>

                                                    <p>
                                                        Quantity:
                                                        {" "}
                                                        {
                                                            item.quantity
                                                        }
                                                    </p>

                                                    <p>
                                                        Unit Price:
                                                        {" "}
                                                        ৳{" "}
                                                        {
                                                            Number(
                                                                item.price
                                                            ).toFixed(2)
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            <strong>

                                                ৳ {
                                                    (
                                                        Number(
                                                            item.price
                                                        ) *
                                                        Number(
                                                            item.quantity
                                                        )
                                                    ).toFixed(2)
                                                }

                                            </strong>

                                        </div>

                                    )
                                )}

                            </div>


                            {/* =========================
                                ORDER TOTAL
                            ========================= */}

                            <div className="order-bottom">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ৳ {
                                        Number(
                                            order.total_amount
                                        ).toFixed(2)
                                    }
                                </strong>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}


export default MyOrders;