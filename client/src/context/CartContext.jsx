import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();


export const CartProvider = ({ children }) => {

    const [cart, setCart] = useState(() => {

        const savedCart = localStorage.getItem("cart");

        return savedCart
            ? JSON.parse(savedCart)
            : [];

    });


    useEffect(() => {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    }, [cart]);


    const addToCart = (product) => {

        setCart((currentCart) => {

            const existingProduct =
                currentCart.find(
                    item => item.id === product.id
                );


            if (existingProduct) {

                return currentCart.map(item =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity:
                                item.quantity + 1
                        }
                        : item
                );

            }


            return [
                ...currentCart,
                {
                    ...product,
                    quantity: 1
                }
            ];

        });

    };


    const removeFromCart = (productId) => {

        setCart((currentCart) =>
            currentCart.filter(
                item => item.id !== productId
            )
        );

    };


    const increaseQuantity = (productId) => {

        setCart((currentCart) =>
            currentCart.map(item =>
                item.id === productId
                    ? {
                        ...item,
                        quantity:
                            item.quantity + 1
                    }
                    : item
            )
        );

    };


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
                    item => item.quantity > 0
                )
        );

    };


    const cartCount = cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );


    const cartTotal = cart.reduce(
        (total, item) =>
            total +
            Number(item.price) *
            item.quantity,
        0
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
                decreaseQuantity
            }}
        >

            {children}

        </CartContext.Provider>

    );

};


export const useCart = () => {

    return useContext(CartContext);

};