import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";


function Cart() {
    const navigate = useNavigate();

    const {
        cart,
        cartTotal,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart
    } = useCart();


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

                <div className="cart-items">

                    {cart.map((item) => (

                        <div
                            className="cart-item"
                            key={item.id}
                        >

                            <img
                                src={item.image}
                                alt={item.name}
                            />


                            <div className="cart-item-info">

                                <h3>
                                    {item.name}
                                </h3>

                                <p>
                                    ৳ {Number(item.price).toFixed(2)}
                                </p>


                                <div className="quantity-control">

                                    <button
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
                                        onClick={() =>
                                            increaseQuantity(
                                                item.id
                                            )
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                            </div>


                            <div className="cart-item-right">

                                <strong>
                                    ৳ {
                                        (
                                            Number(item.price) *
                                            item.quantity
                                        ).toFixed(2)
                                    }
                                </strong>


                                <button
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

                    ))}

                </div>


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


                    {/* <button className="checkout-btn">
                        Proceed to Checkout
                    </button> */}
                    <button
                        className="checkout-btn"
                        onClick={() => navigate("/checkout")}
                    >
                        Proceed to Checkout
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