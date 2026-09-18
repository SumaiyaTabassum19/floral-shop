import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/api";

import "./Auth.css";


function Register() {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: ""
    });


    const [message, setMessage] = useState("");

    const [error, setError] = useState("");


    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        try {

            const result =
                await registerUser(formData);


            setMessage(result.message);


            setTimeout(() => {

                navigate("/login");

            }, 1200);


        } catch (error) {

            setError(error.message);

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
                        Create Account
                    </h1>

                    <span>
                        Join our floral community
                    </span>

                </div>


                <form onSubmit={handleSubmit}>

                    <div className="input-row">

                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={handleChange}
                        />

                    </div>


                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />


                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                    />


                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                    />


                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}


                    {message && (
                        <p className="auth-success">
                            {message}
                        </p>
                    )}


                    <button
                        type="submit"
                        className="auth-btn"
                    >
                        Create Account
                    </button>

                </form>


                <p className="auth-switch">

                    Already have an account?

                    {" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

}


export default Register;