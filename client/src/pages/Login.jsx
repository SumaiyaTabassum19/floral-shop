import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Login.css";
import "./Auth.css";


function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();


    const [role, setRole] =
        useState("user");


    const [formData, setFormData] =
        useState({

            email: "",
            password: ""

        });


    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // ================================
    // INPUT CHANGE
    // ================================

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        });

    };


    // ================================
    // LOGIN
    // ================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setLoading(true);


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            email:
                                formData.email,

                            password:
                                formData.password,

                            role

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Login failed."
                );

            }


            // ================================
            // SAVE AUTH
            // ================================

            login(
                data.user,
                data.token
            );


            // ================================
            // REDIRECT
            // ================================

            if (data.user.role === "admin") {

                navigate("/admin");

            } else {

                navigate("/");

            }


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-card">


                {/* ========================
                    HEADER
                ======================== */}

                <div className="auth-header">

                    <p>
                        FLORAL CANVAS
                    </p>

                    <h1>
                        Welcome Back
                    </h1>

                    <span>
                        Login to your account
                    </span>

                </div>


                {/* ========================
                    ACCOUNT TYPE
                ======================== */}

                <div className="account-type">

                    <p>
                        Login as
                    </p>


                    <div className="role-options">

                        <button
                            type="button"
                            className={
                                role === "user"
                                    ? "role-option active"
                                    : "role-option"
                            }
                            onClick={() =>
                                setRole("user")
                            }
                        >

                            <span>
                                👤
                            </span>

                            <div>

                                <strong>
                                    User
                                </strong>

                                <small>
                                    Customer account
                                </small>

                            </div>

                        </button>


                        <button
                            type="button"
                            className={
                                role === "admin"
                                    ? "role-option active"
                                    : "role-option"
                            }
                            onClick={() =>
                                setRole("admin")
                            }
                        >

                            <span>
                                🔐
                            </span>

                            <div>

                                <strong>
                                    Admin
                                </strong>

                                <small>
                                    Administrator
                                </small>

                            </div>

                        </button>

                    </div>

                </div>


                {/* ========================
                    ERROR
                ======================== */}

                {error && (

                    <div className="auth-error">
                        {error}
                    </div>

                )}


                {/* ========================
                    FORM
                ======================== */}

                <form
                    onSubmit={handleSubmit}
                    className="auth-form"
                >

                    <div className="form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter your password"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : `Login as ${
                                role === "admin"
                                    ? "Admin"
                                    : "User"
                            }`
                        }

                    </button>

                </form>


                {/* ========================
                    SIGN UP
                ======================== */}

                <div className="auth-footer">

                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/register">
                        Create Account
                    </Link>

                </div>

            </div>

        </div>

    );

}


export default Login;