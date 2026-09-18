import "./ProductCard.css";
import { useCart } from "../../context/CartContext";

function ProductCard({ product }) {

    const { addToCart } = useCart();

    const stock = Number(product.stock || 0);

    const isOutOfStock = stock === 0;

    const isLowStock = stock > 0 && stock <= 5;


    // ==========================================
    // IMAGE URL
    // ==========================================

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }


        // External image URL
        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }


        // Already contains /products/
        if (image.startsWith("/products/")) {
            return image;
        }


        // Image filename
        return `/products/${image}`;

    };


    // ==========================================
    // ADD TO CART
    // ==========================================

    const handleAddToCart = () => {

        if (isOutOfStock) {
            return;
        }

        addToCart(product);

    };


    return (

        <article className="product-card">


            {/* ==================================
                PRODUCT IMAGE
            =================================== */}

            <div className="product-image">

                {product.image ? (

                    <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        onError={(e) => {
                            e.currentTarget.style.display =
                                "none";
                        }}
                    />

                ) : (

                    <div className="no-product-image">
                        🌸
                    </div>

                )}


                {/* WISHLIST */}

                <button
                    className="wishlist-btn"
                    type="button"
                    aria-label="Add to wishlist"
                >
                    ♡
                </button>


                {/* ==================================
                    STOCK BADGE
                =================================== */}

                {isOutOfStock ? (

                    <div className="product-badge out-of-stock-badge">
                        Out of Stock
                    </div>

                ) : isLowStock ? (

                    <div className="product-badge low-stock-badge">
                        Only {stock} left
                    </div>

                ) : (

                    <div className="product-badge">
                        Available
                    </div>

                )}

            </div>


            {/* ==================================
                PRODUCT INFORMATION
            =================================== */}

            <div className="product-info">


                {/* CATEGORY */}

                <p className="product-category">

                    {product.category ||
                        "FLOWER COLLECTION"}

                </p>


                {/* NAME */}

                <h3>
                    {product.name}
                </h3>


                {/* DESCRIPTION */}

                <p className="product-description">

                    {product.description ||
                        "Beautiful flowers carefully selected for every special moment."}

                </p>


                {/* ==================================
                    PRICE + CART
                =================================== */}

                <div className="product-bottom">


                    <div>

                        <span className="product-price">

                            ৳
                            {Number(
                                product.price || 0
                            ).toFixed(2)}

                        </span>


                        {/* STOCK TEXT */}

                        <p
                            className={`stock-text ${
                                isOutOfStock
                                    ? "stock-text-out"
                                    : isLowStock
                                    ? "stock-text-low"
                                    : "stock-text-available"
                            }`}
                        >

                            {isOutOfStock
                                ? "Currently unavailable"
                                : isLowStock
                                ? `${stock} remaining`
                                : `${stock} available`}

                        </p>

                    </div>


                    {/* ADD TO CART */}

                    <button
                        className={`add-cart-btn ${
                            isOutOfStock
                                ? "disabled-cart-btn"
                                : ""
                        }`}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                    >

                        {isOutOfStock
                            ? "Out of Stock"
                            : "Add to Cart"}

                    </button>

                </div>

            </div>

        </article>

    );

}

export default ProductCard;