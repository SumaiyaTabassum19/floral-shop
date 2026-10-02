import { useState } from "react";
import "./Contact.css";

function Contact() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        console.log("Contact message:", formData);

        setSubmitted(true);

        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: ""
        });

    };

    return (
        <div className="contact-page">

            <section className="contact-hero">

                <p>FLORAL CANVAS</p>

                <h1>
                    Get In Touch
                </h1>

                <span>
                    We'd love to hear from you.
                    Send us a message anytime.
                </span>

            </section>


            <section className="contact-section">

                <div className="contact-container">

                    {/* CONTACT INFORMATION */}

                    <div className="contact-info">

                        <p className="contact-label">
                            CONTACT US
                        </p>

                        <h2>
                            Let's Talk About
                            <br />
                            Flowers
                        </h2>

                        <p className="contact-description">
                            Have a question about an order,
                            our flowers, or delivery? Our team
                            is here to help.
                        </p>


                        <div className="contact-details">

                            <div className="contact-detail">

                                <div className="contact-icon">
                                    ✉
                                </div>

                                <div>
                                    <small>
                                        EMAIL
                                    </small>

                                    <p>
                                        sumaiya@gmail.com
                                    </p>
                                </div>

                            </div>


                            <div className="contact-detail">

                                <div className="contact-icon">
                                    ☎
                                </div>

                                <div>
                                    <small>
                                        PHONE
                                    </small>

                                    <p>
                                        +880 1815 123456
                                    </p>
                                </div>

                            </div>


                            <div className="contact-detail">

                                <div className="contact-icon">
                                    ⌖
                                </div>

                                <div>
                                    <small>
                                        LOCATION
                                    </small>

                                    <p>
                                        Chattogram, Bangladesh
                                    </p>
                                </div>

                            </div>


                            <div className="contact-detail">

                                <div className="contact-icon">
                                    ◷
                                </div>

                                <div>
                                    <small>
                                        OPENING HOURS
                                    </small>

                                    <p>
                                        Sat – Thu: 9:00 AM – 8:00 PM
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* CONTACT FORM */}

                    <div className="contact-form-card">

                        {submitted && (

                            <div className="contact-success">
                                Thank you! Your message has
                                been received.
                            </div>

                        )}

                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="contact-form-row">

                                <div className="contact-field">

                                    <label>
                                        Your Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        required
                                    />

                                </div>


                                <div className="contact-field">

                                    <label>
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                    />

                                </div>

                            </div>


                            <div className="contact-form-row">

                                <div className="contact-field">

                                    <label>
                                        Phone
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone"
                                    />

                                </div>


                                <div className="contact-field">

                                    <label>
                                        Subject
                                    </label>

                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help?"
                                    />

                                </div>

                            </div>


                            <div className="contact-field">

                                <label>
                                    Message
                                </label>

                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Write your message..."
                                    rows="6"
                                    required
                                />

                            </div>


                            <button
                                type="submit"
                                className="contact-submit"
                            >
                                Send Message →
                            </button>

                        </form>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Contact;