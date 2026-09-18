import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import AdminOrders from "./pages/AdminOrders";
import AdminDashboard from "./pages/AdminDashboard";
import MyOrders from "./pages/MyOrders";
import Checkout from "./pages/Checkout";
import AdminProducts from "./pages/AdminProducts";

import AdminRoute from "./components/AdminRoute";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function App() {

    return (

        <BrowserRouter>

            <AuthProvider>

                <CartProvider>

                    <Routes>

                        {/* =========================
                            CUSTOMER ROUTES
                        ========================= */}

                        <Route
                            path="/"
                            element={<Home />}
                        />

                        <Route
                            path="/register"
                            element={<Register />}
                        />

                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/cart"
                            element={<Cart />}
                        />

                        <Route
                            path="/checkout"
                            element={<Checkout />}
                        />

                        <Route
                            path="/my-orders"
                            element={<MyOrders />}
                        />


                        {/* =========================
                            ADMIN ROUTES
                        ========================= */}

                        <Route element={<AdminRoute />}>

                            <Route
                                path="/admin"
                                element={<AdminDashboard />}
                            />

                            <Route
                                path="/admin/orders"
                                element={<AdminOrders />}
                            />

                            <Route
                                path="/admin/products"
                                element={<AdminProducts />}
                            />

                        </Route>

                    </Routes>

                </CartProvider>

            </AuthProvider>

        </BrowserRouter>

    );
}

export default App;