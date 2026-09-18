const express = require("express");

const router = express.Router();

const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// CUSTOMER - GET PRODUCTS
router.get("/", getProducts);


// ADMIN - CREATE PRODUCT
router.post(
    "/admin",
    authMiddleware,
    adminMiddleware,
    createProduct
);


// ADMIN - UPDATE PRODUCT
router.put(
    "/admin/:id",
    authMiddleware,
    adminMiddleware,
    updateProduct
);


// ADMIN - DELETE PRODUCT
router.delete(
    "/admin/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
);


module.exports = router;