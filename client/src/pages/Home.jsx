import { useEffect, useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import ProductCard from "../components/ProductCard/ProductCard";

import { getProducts } from "../services/api";

function Home() {

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        const loadProducts = async () => {

            try {

                const data = await getProducts();

                setProducts(data);

            } catch (error) {

                setError("Unable to load products.");

            } finally {

                setLoading(false);

            }
        };

        loadProducts();

    }, []);


    return (
        <>
            <Navbar />

            <main>

                <Hero />


                {/* About Section */}

                <section className="about-section" id="about">

                    <div className="about-image">

                        <img
                            src="/about.jpg"
                            alt="Beautiful flowers"
                        />

                    </div>


                    <div className="about-content">

                        <p className="section-label">
                            ABOUT US
                        </p>

                        <h2>
                            Be honest, be nice,
                            <br />
                            be a flower not a weed.
                        </h2>

                        <p>
                            Flowers are a proud assertion that a ray
                            of beauty out values all the utilities in
                            the world. And flowers are like friends;
                            they bring colour to your world.
                        </p>

                        <button className="outline-btn">
                            Read More
                        </button>

                    </div>

                </section>


                {/* Products Section */}

                <section
                    className="products-section"
                    id="products"
                >

                    <div className="section-heading">

                        <p className="section-label">
                            OUR COLLECTION
                        </p>

                        <h2>
                            New Arrival <span>Flowers</span>
                        </h2>

                        <p>
                            Discover beautiful flowers selected
                            especially for every special moment.
                        </p>

                    </div>


                    {/* Loading */}

                    {loading && (

                        <div className="loading-message">
                            Loading flowers...
                        </div>

                    )}


                    {/* Error */}

                    {error && (

                        <div className="error-message">
                            {error}
                        </div>

                    )}


                    {/* Products */}

                    {!loading && !error && (

                        <div className="product-grid">

                            {products.map((product) => (

                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />

                            ))}

                        </div>

                    )}


                    {/* No products */}

                    {!loading &&
                        !error &&
                        products.length === 0 && (

                            <div className="empty-message">
                                No flowers available.
                            </div>

                        )}

                </section>


                {/* Newsletter */}

                <section className="newsletter">

                    <div>

                        <p className="section-label">
                            STAY IN BLOOM
                        </p>

                        <h2>
                            Get flowers, inspiration
                            <br />
                            and special offers.
                        </h2>

                    </div>


                    <form className="newsletter-form">

                        <input
                            type="email"
                            placeholder="Your email address"
                        />

                        <button type="submit">
                            Subscribe
                        </button>

                    </form>

                </section>

            </main>
        </>
    );
}

export default Home;