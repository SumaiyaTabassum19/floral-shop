import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MyOrders.css";


function MyOrders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


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
                    error.message
                );

            } finally {

                setLoading(false);

            }

        };


        loadOrders();

    }, [navigate]);


    if (loading) {

        return (
            <div className="orders-page">
                <h2>Loading orders...</h2>
            </div>
        );

    }


    if (error) {

        return (
            <div className="orders-page">
                <h2>{error}</h2>
            </div>
        );

    }


    // Group order items by order ID
    const groupedOrders =
        orders.reduce((groups, item) => {

            if (!groups[item.order_id]) {

                groups[item.order_id] = {
                    order_id: item.order_id,
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

                groups[item.order_id]
                    .items.push(item);

            }


            return groups;

        }, {});


    const orderList =
        Object.values(groupedOrders);


    return (

        <div className="orders-page">

            <div className="orders-header">

                <p>FLORAL CANVAS</p>

                <h1>
                    My Orders
                </h1>

                <span>
                    View your previous orders
                </span>

            </div>


            {orderList.length === 0 ? (

                <div className="empty-orders">

                    <h2>
                        No orders yet
                    </h2>

                    <p>
                        Your previous orders
                        will appear here.
                    </p>

                    <button
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

                            <div className="order-top">

                                <div>

                                    <h2>
                                        Order #
                                        {order.order_id}
                                    </h2>

                                    <p>
                                        {new Date(
                                            order.created_at
                                        ).toLocaleDateString()}
                                    </p>

                                </div>


                                <span
                                    className={`order-status ${order.status.toLowerCase()}`}
                                >
                                    {order.status}
                                </span>

                            </div>


                            <div className="order-items">

                                {order.items.map(
                                    item => (

                                        <div
                                            className="order-item"
                                            key={
                                                `${order.order_id}-${item.product_id}`
                                            }
                                        >

                                            <div className="item-info">

                                                {item.product_image && (

                                                    <img
                                                        src={
                                                            item.product_image
                                                        }
                                                        alt={
                                                            item.product_name
                                                        }
                                                    />

                                                )}


                                                <div>

                                                    <h3>
                                                        {
                                                            item.product_name
                                                        }
                                                    </h3>

                                                    <p>
                                                        Quantity:
                                                        {" "}
                                                        {
                                                            item.quantity
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
                                                        item.quantity
                                                    ).toFixed(2)
                                                }
                                            </strong>

                                        </div>

                                    )
                                )}

                            </div>


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