import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";


function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setLoading(true);


        try {

            const data = await loginUser(formData);

            login(data.token, data.user);


            // // Save token
            // localStorage.setItem(
            //     "token",
            //     data.token
            // );


            // // Save user
            // localStorage.setItem(
            //     "user",
            //     JSON.stringify(data.user)
            // );


            // Go to home
            navigate("/");


        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <p>
                        FLOWER CANVAS
                    </p>

                    <h1>
                        Welcome Back
                    </h1>

                    <span>
                        Login to continue shopping
                    </span>

                </div>


                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />


                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />


                    {error && (

                        <p className="auth-error">
                            {error}
                        </p>

                    )}


                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>


                <p className="auth-switch">

                    Don't have an account?

                    {" "}

                    <Link to="/register">
                        Create Account
                    </Link>

                </p>

            </div>

        </div>

    );

}


export default Login;