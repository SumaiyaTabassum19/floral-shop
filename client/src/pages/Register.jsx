import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./Register.css";
import "./Auth.css";


function Register() {

    const navigate = useNavigate();


    const [role, setRole] =
        useState("user");


    const [formData, setFormData] =
        useState({

            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            password: "",
            confirm_password: ""

        });


    const [error, setError] =
        useState("");

    const [success, setSuccess] =
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
    // REGISTER
    // ================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // ================================
        // PASSWORD CHECK
        // ================================

        if (
            formData.password !==
            formData.confirm_password
        ) {

            setError(
                "Passwords do not match."
            );

            return;

        }


        if (formData.password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;

        }


        try {

            setLoading(true);


            const response =
                await fetch(
                    "http://localhost:5000/api/auth/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            first_name:
                                formData.first_name,

                            last_name:
                                formData.last_name,

                            email:
                                formData.email,

                            phone:
                                formData.phone,

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
                    "Registration failed."
                );

            }


            setSuccess(
                `${role === "admin"
                    ? "Admin"
                    : "User"
                } account created successfully!`
            );


            // ================================
            // GO TO LOGIN
            // ================================

            setTimeout(() => {

                navigate("/login");

            }, 1200);


        } catch (error) {

            console.error(
                "Register error:",
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

            <div className="auth-card register-card">


                {/* ========================
                    HEADER
                ======================== */}

                <div className="auth-header">

                    <p>
                        FLORAL CANVAS
                    </p>

                    <h1>
                        Create Account
                    </h1>

                    <span>
                        Join our floral community
                    </span>

                </div>


                {/* ========================
                    ACCOUNT TYPE
                ======================== */}

                <div className="account-type">

                    <p>
                        Create account as
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


                {success && (

                    <div className="auth-success">
                        {success}
                    </div>

                )}


                {/* ========================
                    FORM
                ======================== */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                First Name
                            </label>

                            <input
                                type="text"
                                name="first_name"
                                value={
                                    formData.first_name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="First name"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Last Name
                            </label>

                            <input
                                type="text"
                                name="last_name"
                                value={
                                    formData.last_name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Last name"
                            />

                        </div>

                    </div>


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
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={
                                formData.phone
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="01XXXXXXXXX"
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
                            placeholder="Minimum 6 characters"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirm_password"
                            value={
                                formData.confirm_password
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Confirm password"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : `Create ${
                                role === "admin"
                                    ? "Admin"
                                    : "User"
                            } Account`
                        }

                    </button>

                </form>


                {/* ========================
                    LOGIN
                ======================== */}

                <div className="auth-footer">

                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Login
                    </Link>

                </div>

            </div>

        </div>

    );

}


export default Register;