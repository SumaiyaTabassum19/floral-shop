const db = require("../config/db");


// =============================
// CREATE ORDER
// WITH STOCK VALIDATION
// =============================

const createOrder = (req, res) => {

    const {
        total_amount,
        items
    } = req.body;


    if (
        total_amount === undefined ||
        !items ||
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return res.status(400).json({
            success: false,
            message: "Order information is incomplete."
        });

    }


    const userId = req.user
        ? req.user.id
        : null;


    if (!userId) {

        return res.status(401).json({
            success: false,
            message: "User authentication required."
        });

    }


    db.getConnection((connectionError, connection) => {

        if (connectionError) {

            console.error(
                "Database connection error:",
                connectionError
            );

            return res.status(500).json({
                success: false,
                message: "Database connection failed."
            });

        }


        connection.beginTransaction((transactionError) => {

            if (transactionError) {

                connection.release();

                console.error(
                    "Transaction error:",
                    transactionError
                );

                return res.status(500).json({
                    success: false,
                    message: "Unable to start order transaction."
                });

            }


            const productIds = items.map(
                item => Number(item.product_id)
            );


            const uniqueProductIds = [
                ...new Set(productIds)
            ];


            const placeholders = uniqueProductIds
                .map(() => "?")
                .join(",");


            const stockSql = `
                SELECT
                    id,
                    name,
                    price,
                    stock
                FROM products
                WHERE id IN (${placeholders})
                FOR UPDATE
            `;


            connection.query(
                stockSql,
                uniqueProductIds,

                (stockError, products) => {

                    if (stockError) {

                        return connection.rollback(() => {

                            connection.release();

                            console.error(
                                "Stock check error:",
                                stockError
                            );

                            return res.status(500).json({
                                success: false,
                                message: stockError.message
                            });

                        });

                    }


                    if (
                        products.length !==
                        uniqueProductIds.length
                    ) {

                        return connection.rollback(() => {

                            connection.release();

                            return res.status(400).json({
                                success: false,
                                message:
                                    "One or more products are no longer available."
                            });

                        });

                    }


                    for (const item of items) {

                        const product = products.find(
                            p =>
                                Number(p.id) ===
                                Number(item.product_id)
                        );


                        const requestedQuantity =
                            Number(item.quantity);


                        const availableStock =
                            Number(product.stock);


                        if (
                            !Number.isInteger(
                                requestedQuantity
                            ) ||
                            requestedQuantity <= 0
                        ) {

                            return connection.rollback(() => {

                                connection.release();

                                return res.status(400).json({
                                    success: false,
                                    message:
                                        `Invalid quantity for ${product.name}.`
                                });

                            });

                        }


                        if (
                            requestedQuantity >
                            availableStock
                        ) {

                            return connection.rollback(() => {

                                connection.release();

                                return res.status(400).json({
                                    success: false,
                                    message:
                                        `Not enough stock for ${product.name}. Available: ${availableStock}.`
                                });

                            });

                        }

                    }


                    const orderSql = `
                        INSERT INTO orders
                        (
                            user_id,
                            total_amount,
                            status
                        )
                        VALUES (?, ?, ?)
                    `;


                    connection.query(
                        orderSql,

                        [
                            userId,
                            total_amount,
                            "Pending"
                        ],

                        (orderError, orderResult) => {

                            if (orderError) {

                                return connection.rollback(() => {

                                    connection.release();

                                    console.error(
                                        "Order insert error:",
                                        orderError
                                    );

                                    return res.status(500).json({
                                        success: false,
                                        message:
                                            orderError.message
                                    });

                                });

                            }


                            const orderId =
                                orderResult.insertId;


                            const itemValues = items.map(
                                item => [
                                    orderId,
                                    Number(item.product_id),
                                    Number(item.quantity),
                                    Number(item.price)
                                ]
                            );


                            const itemSql = `
                                INSERT INTO order_items
                                (
                                    order_id,
                                    product_id,
                                    quantity,
                                    price
                                )
                                VALUES ?
                            `;


                            connection.query(
                                itemSql,
                                [itemValues],

                                (itemError) => {

                                    if (itemError) {

                                        return connection.rollback(() => {

                                            connection.release();

                                            console.error(
                                                "Order items insert error:",
                                                itemError
                                            );

                                            return res.status(500).json({
                                                success: false,
                                                message:
                                                    itemError.message
                                            });

                                        });

                                    }


                                    let completedUpdates = 0;


                                    const updateStock = () => {

                                        if (
                                            completedUpdates ===
                                            items.length
                                        ) {

                                            connection.commit(
                                                (commitError) => {

                                                    if (
                                                        commitError
                                                    ) {

                                                        return connection.rollback(
                                                            () => {

                                                                connection.release();

                                                                console.error(
                                                                    "Commit error:",
                                                                    commitError
                                                                );

                                                                return res.status(500).json({
                                                                    success: false,
                                                                    message:
                                                                        "Unable to complete order."
                                                                });

                                                            }
                                                        );

                                                    }


                                                    connection.release();


                                                    return res.status(201).json({

                                                        success: true,

                                                        message:
                                                            "Order placed successfully!",

                                                        orderId:
                                                            orderId

                                                    });

                                                }
                                            );

                                            return;
                                        }


                                        const item =
                                            items[
                                                completedUpdates
                                            ];


                                        const quantity =
                                            Number(
                                                item.quantity
                                            );


                                        const productId =
                                            Number(
                                                item.product_id
                                            );


                                        const updateStockSql = `
                                            UPDATE products
                                            SET stock = stock - ?
                                            WHERE id = ?
                                            AND stock >= ?
                                        `;


                                        connection.query(

                                            updateStockSql,

                                            [
                                                quantity,
                                                productId,
                                                quantity
                                            ],

                                            (
                                                updateError,
                                                updateResult
                                            ) => {

                                                if (
                                                    updateError
                                                ) {

                                                    return connection.rollback(
                                                        () => {

                                                            connection.release();

                                                            console.error(
                                                                "Stock update error:",
                                                                updateError
                                                            );

                                                            return res.status(500).json({
                                                                success: false,
                                                                message:
                                                                    updateError.message
                                                            });

                                                        }
                                                    );

                                                }


                                                if (
                                                    updateResult.affectedRows ===
                                                    0
                                                ) {

                                                    return connection.rollback(
                                                        () => {

                                                            connection.release();

                                                            return res.status(400).json({
                                                                success: false,
                                                                message:
                                                                    "Stock changed before the order could be completed. Please try again."
                                                            });

                                                        }
                                                    );

                                                }


                                                completedUpdates++;

                                                updateStock();

                                            }
                                        );

                                    };


                                    updateStock();

                                }
                            );

                        }
                    );

                }
            );

        });

    });

};


// =============================
// GET MY ORDERS
// =============================

const getMyOrders = (req, res) => {

    const userId = req.user
        ? req.user.id
        : null;


    if (!userId) {

        return res.status(401).json({
            success: false,
            message: "User authentication required."
        });

    }


    const sql = `
        SELECT
            o.id AS order_id,
            o.total_amount,
            o.status,
            o.created_at,

            oi.product_id,
            oi.quantity,
            oi.price,

            p.name AS product_name,
            p.image AS product_image

        FROM orders o

        LEFT JOIN order_items oi
            ON o.id = oi.order_id

        LEFT JOIN products p
            ON oi.product_id = p.id

        WHERE o.user_id = ?

        ORDER BY o.created_at DESC
    `;


    db.query(
        sql,
        [userId],

        (err, results) => {

            if (err) {

                console.error(
                    "Get orders error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }


            return res.json({

                success: true,

                orders: results

            });

        }
    );

};


// =============================
// GET ALL ORDERS - ADMIN
// =============================

const getAllOrders = (req, res) => {

    const sql = `
        SELECT
            o.id AS order_id,
            o.user_id,
            o.total_amount,
            o.status,
            o.created_at,

            u.first_name,
            u.last_name,
            u.email,
            u.phone,

            oi.product_id,
            oi.quantity,
            oi.price,

            p.name AS product_name,
            p.image AS product_image

        FROM orders o

        LEFT JOIN users u
            ON o.user_id = u.id

        LEFT JOIN order_items oi
            ON o.id = oi.order_id

        LEFT JOIN products p
            ON oi.product_id = p.id

        ORDER BY o.created_at DESC
    `;


    db.query(
        sql,

        (err, results) => {

            if (err) {

                console.error(
                    "Get all orders error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }


            return res.json({
                success: true,
                orders: results
            });

        }
    );

};


// =============================
// UPDATE ORDER STATUS - ADMIN
// =============================

const updateOrderStatus = (req, res) => {

    const {
        orderId
    } = req.params;


    const {
        status
    } = req.body;


    const allowedStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Completed"
    ];


    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({
            success: false,
            message: "Invalid order status."
        });

    }


    const sql = `
        UPDATE orders
        SET status = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            status,
            orderId
        ],

        (err, result) => {

            if (err) {

                console.error(
                    "Update order status error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }


            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message: "Order not found."
                });

            }


            return res.json({
                success: true,
                message:
                    "Order status updated successfully."
            });

        }
    );

};


// =============================
// ADMIN - DASHBOARD STATISTICS
// =============================

const getOrderStats = (req, res) => {

    const sql = `
        SELECT

            COUNT(*) AS total_orders,

            SUM(
                CASE
                    WHEN status = 'Pending'
                    THEN 1
                    ELSE 0
                END
            ) AS pending_orders,

            SUM(
                CASE
                    WHEN status = 'Processing'
                    THEN 1
                    ELSE 0
                END
            ) AS processing_orders,

            SUM(
                CASE
                    WHEN status = 'Shipped'
                    THEN 1
                    ELSE 0
                END
            ) AS shipped_orders,

            SUM(
                CASE
                    WHEN status = 'Completed'
                    THEN 1
                    ELSE 0
                END
            ) AS completed_orders,

            COALESCE(
                SUM(total_amount),
                0
            ) AS total_revenue

        FROM orders
    `;


    db.query(
        sql,

        (err, results) => {

            if (err) {

                console.error(
                    "Dashboard statistics error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }


            return res.json({

                success: true,

                stats: results[0]

            });

        }
    );

};


// =============================
// EXPORT
// =============================

module.exports = {

    createOrder,

    getMyOrders,

    getAllOrders,

    updateOrderStatus,

    getOrderStats

};