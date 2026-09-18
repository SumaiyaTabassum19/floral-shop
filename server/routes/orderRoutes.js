const express = require("express");

const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getOrderStats
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// CUSTOMER
router.post(
    "/",
    authMiddleware,
    createOrder
);


// CUSTOMER - MY ORDERS
router.get(
    "/my-orders",
    authMiddleware,
    getMyOrders
);


// ADMIN - ALL ORDERS
router.get(
    "/admin/all",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);


// ADMIN - UPDATE ORDER STATUS
router.patch(
    "/admin/:orderId/status",
    authMiddleware,
    adminMiddleware,
    updateOrderStatus
);

// ADMIN - DASHBOARD STATISTICS
router.get(
    "/admin/stats",
    authMiddleware,
    adminMiddleware,
    getOrderStats
);

router.post(
    "/",
    authMiddleware,
    createOrder
);

module.exports = router;