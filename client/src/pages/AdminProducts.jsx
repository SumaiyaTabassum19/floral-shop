import AdminNavbar from "../components/AdminNavbar/AdminNavbar";
import { useEffect, useState } from "react";
import "./AdminProducts.css";

const API_URL = "http://localhost:5000/api";

function AdminProducts() {
    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem("token");

    // ==========================================
    // GET ALL PRODUCTS
    // ==========================================

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/products`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load products."
                );
            }

            setProducts(data.products || []);

        } catch (error) {
            console.error("Fetch products error:", error);

            alert(
                error.message ||
                "Unable to load products."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ==========================================
    // HANDLE TEXT INPUT
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // ==========================================
    // HANDLE IMAGE SELECTION
    // ==========================================

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        // Only allow image files
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        /*
         * Images are already stored inside:
         *
         * client/public/products/
         *
         * Therefore we save only:
         *
         * /products/image-name.jpg
         */

        const imagePath = `/products/${file.name}`;

        setFormData((previous) => ({
            ...previous,
            image: imagePath
        }));

        // Preview selected image
        setImagePreview(
            URL.createObjectURL(file)
        );
    };

    // ==========================================
    // ADD / UPDATE PRODUCT
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Product name is required.");
            return;
        }

        if (formData.price === "") {
            alert("Product price is required.");
            return;
        }

        if (formData.stock === "") {
            alert("Product stock is required.");
            return;
        }

        if (Number(formData.price) < 0) {
            alert("Price cannot be negative.");
            return;
        }

        if (Number(formData.stock) < 0) {
            alert("Stock cannot be negative.");
            return;
        }

        if (!token) {
            alert("Please login as admin first.");
            return;
        }

        try {
            setSaving(true);

            const url = editingId
                ? `${API_URL}/products/admin/${editingId}`
                : `${API_URL}/products/admin`;

            const method = editingId
                ? "PUT"
                : "POST";

            const response = await fetch(url, {
                method,

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    name: formData.name.trim(),

                    description:
                        formData.description.trim(),

                    price: Number(formData.price),

                    stock: Number(formData.stock),

                    image: formData.image
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Product operation failed."
                );
            }

            alert(
                editingId
                    ? "Product updated successfully."
                    : "Product added successfully."
            );

            resetForm();

            await fetchProducts();

        } catch (error) {
            console.error(
                "Save product error:",
                error
            );

            alert(
                error.message ||
                "Unable to save product."
            );

        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // EDIT PRODUCT
    // ==========================================

    const handleEdit = (product) => {
        setEditingId(product.id);

        setFormData({
            name: product.name || "",

            description:
                product.description || "",

            price:
                product.price !== null &&
                product.price !== undefined
                    ? product.price
                    : "",

            stock:
                product.stock !== null &&
                product.stock !== undefined
                    ? product.stock
                    : "",

            image:
                product.image || ""
        });

        // Show existing image
        if (product.image) {
            setImagePreview(
                getImageUrl(product.image)
            );
        } else {
            setImagePreview("");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ==========================================
    // DELETE PRODUCT
    // ==========================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        if (!token) {
            alert("Please login as admin first.");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/products/admin/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete product."
                );
            }

            alert(
                "Product deleted successfully."
            );

            await fetchProducts();

        } catch (error) {
            console.error(
                "Delete product error:",
                error
            );

            alert(
                error.message ||
                "Unable to delete product."
            );
        }
    };

    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
            image: ""
        });

        setEditingId(null);
        setImagePreview("");
    };

    // ==========================================
    // IMAGE URL HELPER
    // ==========================================

    const getImageUrl = (image) => {
        if (!image) {
            return "";
        }

        // External image
        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        // Already correct public path
        if (image.startsWith("/products/")) {
            return image;
        }

        // If database contains "products/pr-1.jpg"
        if (image.startsWith("products/")) {
            return `/${image}`;
        }

        // If database contains "/products/pr-1.jpg"
        if (image.startsWith("/")) {
            return image;
        }

        // If database only contains "pr-1.jpg"
        return `/products/${image}`;
    };

    // ==========================================
    // IMAGE ERROR
    // ==========================================

    const handleImageError = (e) => {
        e.currentTarget.style.display = "none";

        const parent =
            e.currentTarget.parentElement;

        if (parent) {
            parent.classList.add(
                "image-not-found"
            );
        }
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <>
            <AdminNavbar />

        <div className="admin-products-page">

            <div className="admin-products-container">

                {/* ==================================
                    HEADER
                ================================== */}

                <div className="admin-products-header">

                    <div>
                        <p className="admin-products-label">
                            FLOWER CANVAS
                        </p>

                        <h1>
                            Product Management
                        </h1>

                        <p>
                            Add, edit and manage your
                            flower products.
                        </p>
                    </div>

                </div>


                {/* ==================================
                    FORM
                ================================== */}

                <div className="product-form-card">

                    <div className="form-header">

                        <div>
                            <h2>
                                {editingId
                                    ? "Edit Product"
                                    : "Add New Product"}
                            </h2>

                            <p>
                                Enter your product
                                information below.
                            </p>
                        </div>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="product-form"
                    >

                        {/* PRODUCT NAME */}

                        <div className="form-group">

                            <label htmlFor="name">
                                Product Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Classic Red Roses"
                            />

                        </div>


                        {/* PRICE */}

                        <div className="form-group">

                            <label htmlFor="price">
                                Price
                            </label>

                            <input
                                id="price"
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="1200.00"
                                step="0.01"
                                min="0"
                            />

                        </div>


                        {/* STOCK */}

                        <div className="form-group">

                            <label htmlFor="stock">
                                Stock
                            </label>

                            <input
                                id="stock"
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="20"
                                min="0"
                                step="1"
                            />

                            <small className="input-help">
                                Products with stock greater
                                than 0 will show Available.
                            </small>

                        </div>


                        {/* DESCRIPTION */}

                        <div className="form-group form-group-full">

                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={handleChange}
                                placeholder="Write a beautiful description for your flower..."
                                rows="4"
                            />

                        </div>


                        {/* IMAGE */}

                        <div className="form-group form-group-full">

                            <label htmlFor="image">
                                Product Image
                            </label>

                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                            />

                            <small className="input-help">
                                Select an image from your
                                products folder.
                            </small>


                            {/* SELECTED IMAGE */}

                            {formData.image && (
                                <p className="selected-image">
                                    Selected:{" "}
                                    {formData.image}
                                </p>
                            )}


                            {/* PREVIEW */}

                            {imagePreview && (
                                <div className="image-preview">

                                    <img
                                        src={imagePreview}
                                        alt="Product preview"
                                        onError={
                                            handleImageError
                                        }
                                    />

                                </div>
                            )}

                        </div>


                        {/* BUTTONS */}

                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="save-product-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Product"
                                        : "Add Product"}
                            </button>


                            {editingId && (
                                <button
                                    type="button"
                                    className="cancel-product-btn"
                                    onClick={resetForm}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                </div>


                {/* ==================================
                    PRODUCTS
                ================================== */}

                <div className="products-section">

                    <div className="products-section-header">

                        <div>

                            <h2>
                                All Products
                            </h2>

                            <p>
                                {products.length} products
                            </p>

                        </div>


                        <button
                            className="refresh-products-btn"
                            onClick={fetchProducts}
                            disabled={loading}
                        >
                            {loading
                                ? "Loading..."
                                : "Refresh"}
                        </button>

                    </div>


                    {/* LOADING */}

                    {loading ? (

                        <div className="products-loading">
                            Loading products...
                        </div>

                    ) : products.length === 0 ? (

                        /* EMPTY */

                        <div className="no-products">

                            <h3>
                                No Products Found
                            </h3>

                            <p>
                                Add your first flower
                                product above.
                            </p>

                        </div>

                    ) : (

                        /* PRODUCT GRID */

                        <div className="admin-product-grid">

                            {products.map((product) => {

                                const imageUrl =
                                    getImageUrl(
                                        product.image
                                    );

                                const stock =
                                    Number(
                                        product.stock
                                    ) || 0;

                                return (

                                    <div
                                        className="admin-product-card"
                                        key={product.id}
                                    >

                                        {/* IMAGE */}

                                        <div className="admin-product-image">

                                            {imageUrl ? (

                                                <img
                                                    src={imageUrl}
                                                    alt={
                                                        product.name
                                                    }
                                                    className="product-image"
                                                    onError={
                                                        handleImageError
                                                    }
                                                />

                                            ) : (

                                                <span className="no-image">
                                                    🌸
                                                </span>

                                            )}

                                        </div>


                                        {/* CONTENT */}

                                        <div className="admin-product-content">

                                            <div className="product-status-row">

                                                <span
                                                    className={
                                                        stock > 0
                                                            ? "stock-status available"
                                                            : "stock-status out-of-stock"
                                                    }
                                                >
                                                    {stock > 0
                                                        ? "Available"
                                                        : "Out of Stock"}
                                                </span>

                                                <span className="stock-number">
                                                    Stock: {stock}
                                                </span>

                                            </div>


                                            {/* <p className="admin-product-category">
                                                {product.category ||
                                                    "FLOWER COLLECTION"}
                                            </p> */}


                                            <h3>
                                                {product.name}
                                            </h3>


                                            {product.description && (
                                                <p className="admin-product-description">
                                                    {
                                                        product.description
                                                    }
                                                </p>
                                            )}


                                            <p className="product-price">
                                                $
                                                {Number(
                                                    product.price
                                                ).toFixed(2)}
                                            </p>


                                            {/* ACTIONS */}

                                            <div className="product-actions">

                                                <button
                                                    className="edit-product-btn"
                                                    onClick={() =>
                                                        handleEdit(
                                                            product
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="delete-product-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            product.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}

                </div>

            </div>

        </div>

        </>
    );
}

export default AdminProducts;