import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

import "./Checkout.css";


function Checkout() {

    const navigate = useNavigate();

    const {
        cart,
        cartTotal,
        //setCart
        clearCart
    } = useCart();


    // =============================
    // DELIVERY CHARGE
    // =============================

    const deliveryCharge = 100;

    const grandTotal =
        cartTotal + deliveryCharge;


    // =============================
    // FORM DATA
    // =============================

    const [formData, setFormData] = useState({

        first_name: "",
        last_name: "",
        email: "",
        phone: "",

        address: "",
        city: "",
        postal_code: "",

        payment_method: "Cash on Delivery"

    });


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =============================
    // HANDLE INPUT
    // =============================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((currentData) => ({

            ...currentData,

            [name]: value

        }));

    };


    // =============================
    // PLACE ORDER
    // =============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // =============================
        // LOGIN CHECK
        // =============================

        const token =
            localStorage.getItem("token");


        if (!token) {

            navigate("/login");

            return;

        }


        // =============================
        // CART CHECK
        // =============================

        if (!cart || cart.length === 0) {

            setError(
                "Your cart is empty."
            );

            return;

        }


        // =============================
        // VALIDATION
        // =============================

        if (
            !formData.first_name.trim() ||
            !formData.email.trim() ||
            !formData.phone.trim() ||
            !formData.address.trim() ||
            !formData.city.trim()
        ) {

            setError(
                "Please fill in all required fields."
            );

            return;

        }


        try {

            setLoading(true);


            // =============================
            // ORDER ITEMS
            // =============================

            const items = cart.map((item) => ({

                product_id: item.id,

                quantity: Number(
                    item.quantity
                ),

                price: Number(
                    item.price
                )

            }));


            // =============================
            // SEND ORDER
            // =============================

            const response = await fetch(
                "http://localhost:5000/api/orders",
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        total_amount:
                            Number(grandTotal.toFixed(2)),

                        items: items

                    })

                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to place order."
                );

            }


            // =============================
            // CLEAR CART
            // =============================

             clearCart();
            // localStorage.removeItem("cart");


            // // If setCart is available
            // if (setCart) {

            //     setCart([]);

            // }


            // =============================
            // SUCCESS
            // =============================

            navigate(
                `/order-success?orderId=${data.orderId}`
            );


        } catch (error) {

            console.error(
                "Checkout error:",
                error
            );


            setError(
                error.message ||
                "Something went wrong while placing your order."
            );


        } finally {

            setLoading(false);

        }

    };


    // =============================
    // EMPTY CART
    // =============================

    if (!cart || cart.length === 0) {

        return (

            <div className="checkout-page">

                <div className="checkout-empty">

                    <div className="checkout-empty-icon">
                        🛒
                    </div>

                    <h1>
                        Your Cart is Empty
                    </h1>

                    <p>
                        Add some beautiful flowers
                        before proceeding to checkout.
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

            </div>

        );

    }


    return (

        <div className="checkout-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="checkout-header">

                <p>
                    FLORAL CANVAS
                </p>

                <h1>
                    Checkout
                </h1>

                <span>
                    Complete your order
                </span>

            </div>


            {/* =========================
                CHECKOUT CONTAINER
            ========================= */}

            <div className="checkout-container">


                {/* =========================
                    CUSTOMER FORM
                ========================= */}

                <form
                    className="checkout-form"
                    onSubmit={handleSubmit}
                >

                    <div className="checkout-section">

                        <div className="checkout-section-title">

                            <span>
                                01
                            </span>

                            <div>
                                <h2>
                                    Customer Information
                                </h2>

                                <p>
                                    Tell us how we can contact you.
                                </p>
                            </div>

                        </div>


                        <div className="form-row">

                            <div className="form-group">

                                <label htmlFor="first_name">
                                    First Name *
                                </label>

                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={
                                        formData.first_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your first name"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label htmlFor="last_name">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={
                                        formData.last_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your last name"
                                />

                            </div>

                        </div>


                        <div className="form-row">

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email Address *
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="example@email.com"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label htmlFor="phone">
                                    Phone Number *
                                </label>

                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="01XXXXXXXXX"
                                    required
                                />

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        DELIVERY ADDRESS
                    ========================= */}

                    <div className="checkout-section">

                        <div className="checkout-section-title">

                            <span>
                                02
                            </span>

                            <div>

                                <h2>
                                    Delivery Address
                                </h2>

                                <p>
                                    Where should we deliver your flowers?
                                </p>

                            </div>

                        </div>


                        <div className="form-group">

                            <label htmlFor="address">
                                Full Address *
                            </label>

                            <textarea
                                id="address"
                                name="address"
                                value={
                                    formData.address
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="House/Road/Area"
                                rows="4"
                                required
                            />

                        </div>


                        <div className="form-row">

                            <div className="form-group">

                                <label htmlFor="city">
                                    City *
                                </label>

                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={
                                        formData.city
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter city"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label htmlFor="postal_code">
                                    Postal Code
                                </label>

                                <input
                                    type="text"
                                    id="postal_code"
                                    name="postal_code"
                                    value={
                                        formData.postal_code
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Postal code"
                                />

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        PAYMENT
                    ========================= */}

                    <div className="checkout-section">

                        <div className="checkout-section-title">

                            <span>
                                03
                            </span>

                            <div>

                                <h2>
                                    Payment Method
                                </h2>

                                <p>
                                    Select your preferred payment method.
                                </p>

                            </div>

                        </div>


                        <label className="payment-option">

                            <input
                                type="radio"
                                name="payment_method"
                                value="Cash on Delivery"
                                checked={
                                    formData.payment_method ===
                                    "Cash on Delivery"
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <div>

                                <strong>
                                    Cash on Delivery
                                </strong>

                                <span>
                                    Pay when your flowers arrive.
                                </span>

                            </div>

                        </label>

                    </div>


                    {/* =========================
                        ERROR
                    ========================= */}

                    {error && (

                        <div className="checkout-error">

                            ⚠️ {error}

                        </div>

                    )}


                    {/* =========================
                        SUBMIT
                    ========================= */}

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


                    <button
                        type="button"
                        className="back-cart-btn"
                        onClick={() =>
                            navigate("/cart")
                        }
                    >
                        ← Back to Cart
                    </button>

                </form>


                {/* =========================
                    ORDER SUMMARY
                ========================= */}

                <aside className="checkout-summary">

                    <div className="summary-heading">

                        <p>
                            YOUR ORDER
                        </p>

                        <h2>
                            Order Summary
                        </h2>

                    </div>


                    {/* PRODUCTS */}

                    <div className="checkout-products">

                        {cart.map((item) => (

                            <div
                                className="checkout-product"
                                key={item.id}
                            >

                                <div className="checkout-product-image">

                                    <img
                                        src={
                                            item.image
                                        }
                                        alt={
                                            item.name
                                        }
                                    />

                                    <span>
                                        {item.quantity}
                                    </span>

                                </div>


                                <div className="checkout-product-info">

                                    <h3>
                                        {item.name}
                                    </h3>

                                    <p>
                                        ৳{" "}
                                        {Number(
                                            item.price
                                        ).toFixed(2)}
                                    </p>

                                </div>


                                <strong>

                                    ৳{" "}
                                    {(
                                        Number(
                                            item.price
                                        ) *
                                        Number(
                                            item.quantity
                                        )
                                    ).toFixed(2)}

                                </strong>

                            </div>

                        ))}

                    </div>


                    {/* TOTALS */}

                    <div className="checkout-totals">

                        <div className="checkout-total-row">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ৳{" "}
                                {cartTotal.toFixed(2)}
                            </strong>

                        </div>


                        <div className="checkout-total-row">

                            <span>
                                Delivery
                            </span>

                            <strong>
                                ৳ 100.00
                            </strong>

                        </div>


                        <div className="checkout-total-final">

                            <span>
                                Total
                            </span>

                            <strong>
                                ৳{" "}
                                {grandTotal.toFixed(2)}
                            </strong>

                        </div>

                    </div>


                    <div className="secure-checkout">

                        <span>
                            🔒
                        </span>

                        <div>

                            <strong>
                                Secure Checkout
                            </strong>

                            <p>
                                Your information is protected.
                            </p>

                        </div>

                    </div>

                </aside>

            </div>

        </div>

    );

}


export default Checkout;