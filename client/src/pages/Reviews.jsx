import "./Reviews.css";

const reviews = [
    {
        id: 1,
        name: "Nusrat Jahan",
        location: "Chattogram",
        rating: 5,
        review:
            "The flowers were fresh and beautifully arranged. The bouquet looked exactly as I hoped. I will definitely order again."
    },
    {
        id: 2,
        name: "Sadia Rahman",
        location: "Dhaka",
        rating: 5,
        review:
            "I ordered flowers for my sister's birthday and she absolutely loved them. The quality and presentation were wonderful."
    },
    {
        id: 3,
        name: "Arafat Hossain",
        location: "Chattogram",
        rating: 4,
        review:
            "Beautiful collection and very easy ordering process. The roses were fresh and looked great when they arrived."
    },
    {
        id: 4,
        name: "Maliha Tasnim",
        location: "Cox's Bazar",
        rating: 5,
        review:
            "Floral Canvas has such a lovely collection. The flowers made our anniversary celebration even more special."
    },
    {
        id: 5,
        name: "Tanjim Ahmed",
        location: "Dhaka",
        rating: 5,
        review:
            "The website was easy to use and my order arrived in excellent condition. Really happy with the service."
    },
    {
        id: 6,
        name: "Farzana Akter",
        location: "Chattogram",
        rating: 4,
        review:
            "I loved the simple and elegant presentation. The flowers were fresh and the overall experience was smooth."
    }
];

function Reviews() {

    return (
        <div className="reviews-page">

            <section className="reviews-hero">

                <p>FLORAL CANVAS</p>

                <h1>
                    What Our Customers Say
                </h1>

                <span>
                    Every bouquet carries a story.
                    Here are some of ours.
                </span>

            </section>


            <section className="reviews-section">

                <div className="reviews-grid">

                    {reviews.map((review) => (

                        <article
                            className="review-card"
                            key={review.id}
                        >

                            <div className="review-top">

                                <div className="review-avatar">
                                    {review.name.charAt(0)}
                                </div>

                                <div>

                                    <h3>
                                        {review.name}
                                    </h3>

                                    <span>
                                        {review.location}
                                    </span>

                                </div>

                            </div>


                            <div className="review-stars">

                                {"★".repeat(review.rating)}
                                {"☆".repeat(5 - review.rating)}

                            </div>


                            <p className="review-text">
                                "{review.review}"
                            </p>

                        </article>

                    ))}

                </div>


                <div className="review-summary">

                    <div>
                        <strong>4.9</strong>
                        <span>Average Rating</span>
                    </div>

                    <div>
                        <strong>500+</strong>
                        <span>Happy Customers</span>
                    </div>

                    <div>
                        <strong>100%</strong>
                        <span>Fresh Flowers</span>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default Reviews;