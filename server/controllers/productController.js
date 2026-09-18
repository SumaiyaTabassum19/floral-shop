const db = require("../config/db");


// ==========================================
// GET ALL PRODUCTS
// ==========================================

const getProducts = (req, res) => {

    const sql = `
        SELECT *
        FROM products
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error("Get products error:", err);

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        return res.json({
            success: true,
            products: results
        });

    });

};


// ==========================================
// ADMIN - ADD PRODUCT
// ==========================================

const createProduct = (req, res) => {

    const {
        name,
        price,
        image,
        stock
    } = req.body;


    if (!name || price === undefined) {

        return res.status(400).json({
            success: false,
            message: "Product name and price are required."
        });

    }


    const productStock =
        stock === undefined || stock === ""
            ? 0
            : Number(stock);


    const sql = `
        INSERT INTO products
        (name, price, image, stock)
        VALUES (?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            name,
            Number(price),
            image || null,
            productStock
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Create product error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }


            return res.status(201).json({

                success: true,

                message:
                    "Product created successfully.",

                productId:
                    result.insertId

            });

        }
    );

};


// ==========================================
// ADMIN - UPDATE PRODUCT
// ==========================================

const updateProduct = (req, res) => {

    const { id } = req.params;


    const {
        name,
        price,
        image,
        stock
    } = req.body;


    if (!name || price === undefined) {

        return res.status(400).json({

            success: false,

            message:
                "Product name and price are required."

        });

    }


    const productStock =
        stock === undefined || stock === ""
            ? 0
            : Number(stock);


    const sql = `
        UPDATE products

        SET
            name = ?,
            price = ?,
            image = ?,
            stock = ?

        WHERE id = ?
    `;


    db.query(
        sql,
        [
            name,
            Number(price),
            image || null,
            productStock,
            id
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Update product error:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message: err.message

                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found."

                });

            }


            return res.json({

                success: true,

                message:
                    "Product updated successfully."

            });

        }
    );

};


// ==========================================
// ADMIN - DELETE PRODUCT
// ==========================================

const deleteProduct = (req, res) => {

    const { id } = req.params;


    const sql = `
        DELETE FROM products
        WHERE id = ?
    `;


    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                console.error(
                    "Delete product error:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message: err.message

                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found."

                });

            }


            return res.json({

                success: true,

                message:
                    "Product deleted successfully."

            });

        }
    );

};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {

    getProducts,
    createProduct,
    updateProduct,
    deleteProduct

};