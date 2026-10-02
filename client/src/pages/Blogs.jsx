import { useNavigate } from "react-router-dom";
import "./Blogs.css";

const blogs = [
    {
        id: 1,
        category: "FLOWER CARE",
        date: "September 20, 2026",
        title: "How to Keep Fresh Flowers Beautiful for Longer",
        excerpt:
            "Simple and practical tips to help your favorite flowers stay fresh, vibrant, and beautiful for days.",
        image: "/products/pr-1.jpg"
    },
    {
        id: 2,
        category: "FLOWER GUIDE",
        date: "September 15, 2026",
        title: "Choosing the Perfect Flowers for Every Occasion",
        excerpt:
            "From birthdays to anniversaries, discover how to choose flowers that make every special moment memorable.",
        image: "/products/pr-3.jpg"
    },
    {
        id: 3,
        category: "DECORATION",
        date: "September 10, 2026",
        title: "Beautiful Flower Ideas for Your Home",
        excerpt:
            "Bring a natural and refreshing feeling into your home with these simple floral decoration ideas.",
        image: "/products/pr-4.jpg"
    },
    {
        id: 4,
        category: "FLOWER CARE",
        date: "September 5, 2026",
        title: "The Best Way to Care for Roses",
        excerpt:
            "Learn easy techniques for keeping roses fresh, healthy, and beautiful after bringing them home.",
        image: "/products/pr-2.jpg"
    },
    {
        id: 5,
        category: "INSPIRATION",
        date: "August 28, 2026",
        title: "Why Flowers Make Every Celebration Special",
        excerpt:
            "Flowers have a unique way of expressing emotions and adding beauty to life's most meaningful occasions.",
        image: "/products/pr-7.jpg"
    },
    {
        id: 6,
        category: "FLOWER GUIDE",
        date: "August 20, 2026",
        title: "Understanding Different Types of Flowers",
        excerpt:
            "Explore some popular flowers and learn what makes each one unique and special.",
        image: "/products/pr-6.jpg"
    }
];

function Blogs() {

    const navigate = useNavigate();

    return (
        <div className="blogs-page">

            <section className="blogs-hero">

                <p>FLORAL CANVAS</p>

                <h1>
                    Our Flower Journal
                </h1>

                <span>
                    Stories, inspiration, and helpful tips
                    for every flower lover.
                </span>

            </section>


            <section className="blogs-section">

                <div className="blogs-grid">

                    {blogs.map((blog) => (

                        <article
                            className="blog-card"
                            key={blog.id}
                        >

                            <div className="blog-image">

                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                />

                            </div>


                            <div className="blog-content">

                                <div className="blog-meta">

                                    <span>
                                        {blog.category}
                                    </span>

                                    <small>
                                        {blog.date}
                                    </small>

                                </div>


                                <h2>
                                    {blog.title}
                                </h2>


                                <p>
                                    {blog.excerpt}
                                </p>


                                <button
                                    onClick={() =>
                                        navigate("/blogs")
                                    }
                                >
                                    Read More →
                                </button>

                            </div>

                        </article>

                    ))}

                </div>

            </section>

        </div>
    );
}

export default Blogs;