import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

import "./Cart.css";


function Cart() {

    const navigate = useNavigate();


    const {
        cart,
        cartTotal,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        canCheckout
    } = useCart();


    // =============================
    // EMPTY CART
    // =============================

    if (cart.length === 0) {

        return (

            <div className="cart-page empty-cart">

                <h1>
                    Your Cart
                </h1>

                <p>
                    Your cart is currently empty.
                </p>

                <Link
                    to="/"
                    className="continue-shopping"
                >
                    Continue Shopping
                </Link>

            </div>

        );

    }


    // =============================
    // CHECKOUT
    // =============================

    const handleCheckout = () => {

        if (!canCheckout) {
            return;
        }

        navigate("/checkout");

    };


    return (

        <div className="cart-page">

            <div className="cart-header">

                <p>
                    YOUR SHOPPING BAG
                </p>

                <h1>
                    Your Cart
                </h1>

            </div>


            <div className="cart-container">


                {/* =========================
                    CART ITEMS
                ========================= */}

                <div className="cart-items">

                    {cart.map((item) => {

                        const stock =
                            Number(
                                item.stock || 0
                            );

                        const isOutOfStock =
                            stock <= 0;

                        const isAtStockLimit =
                            item.quantity >= stock;


                        return (

                            <div
                                className={`cart-item ${
                                    isOutOfStock
                                        ? "cart-item-out"
                                        : ""
                                }`}
                                key={item.id}
                            >


                                {/* IMAGE */}

                                <img
                                    src={item.image}
                                    alt={item.name}
                                />


                                {/* PRODUCT INFO */}

                                <div className="cart-item-info">

                                    <h3>
                                        {item.name}
                                    </h3>

                                    <p>
                                        ৳ {Number(
                                            item.price
                                        ).toFixed(2)}
                                    </p>


                                    {/* STOCK */}

                                    {isOutOfStock ? (

                                        <div className="cart-stock out-stock">
                                            Out of Stock
                                        </div>

                                    ) : (

                                        <div
                                            className={`cart-stock ${
                                                stock <= 5
                                                    ? "low-stock"
                                                    : ""
                                            }`}
                                        >
                                            {stock} available
                                        </div>

                                    )}


                                    {/* QUANTITY */}

                                    <div className="quantity-control">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                decreaseQuantity(
                                                    item.id
                                                )
                                            }
                                        >
                                            −
                                        </button>


                                        <span>
                                            {item.quantity}
                                        </span>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                increaseQuantity(
                                                    item.id
                                                )
                                            }
                                            disabled={
                                                isOutOfStock ||
                                                isAtStockLimit
                                            }
                                            title={
                                                isAtStockLimit
                                                    ? "Maximum available stock reached"
                                                    : "Increase quantity"
                                            }
                                        >
                                            +
                                        </button>

                                    </div>


                                    {/* STOCK WARNING */}

                                    {isAtStockLimit &&
                                    !isOutOfStock ? (

                                        <small className="stock-limit-message">
                                            Maximum available
                                            quantity reached
                                        </small>

                                    ) : null}

                                </div>


                                {/* RIGHT SIDE */}

                                <div className="cart-item-right">

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


                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() =>
                                            removeFromCart(
                                                item.id
                                            )
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>


                {/* =========================
                    ORDER SUMMARY
                ========================= */}

                <div className="cart-summary">

                    <h2>
                        Order Summary
                    </h2>


                    <div className="summary-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ৳ {cartTotal.toFixed(2)}
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>
                            Delivery
                        </span>

                        <strong>
                            ৳ 100.00
                        </strong>

                    </div>


                    <hr />


                    <div className="summary-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ৳ {(cartTotal + 100).toFixed(2)}
                        </strong>

                    </div>


                    {/* STOCK WARNING */}

                    {!canCheckout && (

                        <div className="checkout-stock-warning">

                            Some products in your cart
                            are unavailable or exceed
                            the available stock.

                        </div>

                    )}


                    {/* CHECKOUT BUTTON */}

                    <button
                        type="button"
                        className="checkout-btn"
                        onClick={handleCheckout}
                        disabled={!canCheckout}
                    >
                        {canCheckout
                            ? "Proceed to Checkout"
                            : "Stock Unavailable"
                        }
                    </button>


                    <Link
                        to="/"
                        className="continue-shopping"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>

        </div>

    );

}


export default Cart;