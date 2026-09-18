import "./Hero.css";

function Hero() {
    return (
        <section className="hero" id="home">

            <div className="hero-overlay"></div>

            <div className="hero-content">

                {/* <p className="hero-subtitle">
                    WELCOME TO FLOWER CANVAS
                </p> */}

                <h1>
                    A flower blossoms
                    <br />
                    for its own joy.
                </h1>

                <p className="hero-description">
                    Flowers always make people better, happier and
                    more helpful; they are sunshine, food and medicine
                    for the soul.
                </p>

                <div className="hero-buttons">

                    <a href="#products" className="primary-btn">
                        Shop Now
                    </a>

                    <a href="/login" className="secondary-btn">
                        Sign Up
                    </a>

                </div>

            </div>

            {/* <div className="hero-scroll">
                Scroll to explore ↓
            </div> */}

        </section>
    );
}

export default Hero;