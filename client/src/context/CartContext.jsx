import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const CartContext = createContext();


export const CartProvider = ({ children }) => {

    const [cart, setCart] = useState(() => {

        const savedCart =
            localStorage.getItem("cart");

        return savedCart
            ? JSON.parse(savedCart)
            : [];

    });


    // =============================
    // SAVE CART TO LOCAL STORAGE
    // =============================

    useEffect(() => {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    }, [cart]);


    // =============================
    // ADD TO CART
    // =============================

    const addToCart = (product) => {

        const stock = Number(
            product.stock || 0
        );


        // Product unavailable
        if (stock <= 0) {

            return {
                success: false,
                message:
                    `${product.name} is currently out of stock.`
            };

        }


        setCart((currentCart) => {

            const existingProduct =
                currentCart.find(
                    item =>
                        item.id === product.id
                );


            // Product already exists
            if (existingProduct) {

                // Stock limit reached
                if (
                    existingProduct.quantity >=
                    stock
                ) {

                    return currentCart;

                }


                return currentCart.map(item =>

                    item.id === product.id

                        ? {
                            ...item,
                            quantity:
                                item.quantity + 1,
                            stock: stock
                        }

                        : item

                );

            }


            // Add new product
            return [

                ...currentCart,

                {
                    ...product,
                    quantity: 1,
                    stock: stock
                }

            ];

        });


        return {
            success: true,
            message:
                `${product.name} added to cart.`
        };

    };


    // =============================
    // REMOVE FROM CART
    // =============================

    const removeFromCart = (productId) => {

        setCart((currentCart) =>

            currentCart.filter(
                item =>
                    item.id !== productId
            )

        );

    };


    // =============================
    // INCREASE QUANTITY
    // =============================

    const increaseQuantity = (productId) => {

        setCart((currentCart) =>

            currentCart.map(item => {

                if (
                    item.id !== productId
                ) {

                    return item;

                }


                const stock =
                    Number(item.stock || 0);


                // Do not exceed stock
                if (
                    item.quantity >= stock
                ) {

                    return item;

                }


                return {

                    ...item,

                    quantity:
                        item.quantity + 1

                };

            })

        );

    };


    // =============================
    // DECREASE QUANTITY
    // =============================

    const decreaseQuantity = (productId) => {

        setCart((currentCart) =>

            currentCart

                .map(item =>

                    item.id === productId

                        ? {
                            ...item,
                            quantity:
                                item.quantity - 1
                        }

                        : item

                )

                .filter(
                    item =>
                        item.quantity > 0
                )

        );

    };


    // =============================
    // CHECK STOCK
    // =============================

    const isStockAvailable = (item) => {

        const stock =
            Number(item.stock || 0);

        return (
            stock > 0 &&
            item.quantity <= stock
        );

    };

    const clearCart = () => {

    setCart([]);

    localStorage.removeItem("cart");

};


    // =============================
    // CART COUNT
    // =============================

    const cartCount = cart.reduce(

        (total, item) =>
            total + item.quantity,

        0

    );


    // =============================
    // CART TOTAL
    // =============================

    const cartTotal = cart.reduce(

        (total, item) =>

            total +
            Number(item.price) *
            item.quantity,

        0

    );


    // =============================
    // CHECKOUT VALIDATION
    // =============================

    const canCheckout =
        cart.length > 0 &&
        cart.every(
            item =>
                isStockAvailable(item)
        );


    return (

        <CartContext.Provider
            value={{

                cart,

                cartCount,

                cartTotal,

                addToCart,

                removeFromCart,

                increaseQuantity,

                decreaseQuantity,

                isStockAvailable,

                canCheckout,
                
                clearCart

            }}
        >

            {children}

        </CartContext.Provider>

    );

};


export const useCart = () => {

    return useContext(CartContext);

};