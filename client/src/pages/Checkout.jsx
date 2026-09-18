import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

import "./Checkout.css";


function Checkout() {

    const navigate = useNavigate();

    const {
        cart,
        cartTotal,
        setCart
    } = useCart();


    const [formData, setFormData] = useState({
        customer_name: "",
        email: "",
        phone: "",
        address: ""
    });


    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;

        }


        try {

            setLoading(true);


            const token =
                localStorage.getItem("token");


            const response = await fetch(
                "http://localhost:5000/api/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        ...(token && {
                            Authorization:
                                `Bearer ${token}`
                        })
                    },

                    body: JSON.stringify({

                        total_amount: cartTotal + 100,

                        items: cart.map(item => ({
                            product_id: item.id,
                            quantity: item.quantity,
                            price: item.price
                        }))

                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Order failed"
                );

            }


            localStorage.removeItem("cart");


            alert(
                "Order placed successfully!"
            );


            navigate("/");


        } catch (error) {

            console.error(
                "Checkout error:",
                error
            );

            alert(
                error.message ||
                "Something went wrong."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="checkout-page">

            <div className="checkout-header">

                <p>
                    FLORAL CANVAS
                </p>

                <h1>
                    Checkout
                </h1>

            </div>


            <div className="checkout-container">


                <form
                    className="checkout-form"
                    onSubmit={handleSubmit}
                >

                    <h2>
                        Delivery Information
                    </h2>


                    <div className="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="customer_name"
                            value={
                                formData.customer_name
                            }
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={
                                formData.email
                            }
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={
                                formData.phone
                            }
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Delivery Address
                        </label>

                        <textarea
                            name="address"
                            rows="4"
                            value={
                                formData.address
                            }
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="place-order-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Placing Order..."
                            : "Place Order"
                        }

                    </button>

                </form>


                <div className="checkout-summary">

                    <h2>
                        Order Summary
                    </h2>


                    {cart.map(item => (

                        <div
                            className="checkout-item"
                            key={item.id}
                        >

                            <span>
                                {item.name}
                                {" × "}
                                {item.quantity}
                            </span>

                            <strong>
                                ৳ {
                                    (
                                        Number(item.price) *
                                        item.quantity
                                    ).toFixed(2)
                                }
                            </strong>

                        </div>

                    ))}


                    <hr />


                    <div className="summary-line">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ৳ {cartTotal.toFixed(2)}
                        </strong>

                    </div>


                    <div className="summary-line">

                        <span>
                            Delivery
                        </span>

                        <strong>
                            ৳ 100.00
                        </strong>

                    </div>


                    <div className="checkout-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ৳ {
                                (
                                    cartTotal + 100
                                ).toFixed(2)
                            }
                        </strong>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default Checkout;