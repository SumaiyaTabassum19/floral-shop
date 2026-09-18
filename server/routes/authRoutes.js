const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");

const router = express.Router();

const JWT_SECRET = "floral_shop_secret_key";


// ========================================
// REGISTER
// ========================================

router.post("/register", async (req, res) => {

    try {

        const {
            first_name,
            last_name,
            email,
            phone,
            password,
            role
        } = req.body;


        // ================================
        // VALIDATION
        // ================================

        if (
            !first_name ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "First name, email and password are required."

            });

        }


        // ================================
        // VALID ROLE
        // ================================

        const userRole =
            role === "admin"
                ? "admin"
                : "user";


        // ================================
        // CHECK EXISTING USER
        // ================================

        db.query(
            "SELECT id FROM users WHERE email = ?",
            [email],

            async (err, results) => {

                if (err) {

                    console.error(
                        "Check user error:",
                        err
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Database error."

                    });

                }


                if (results.length > 0) {

                    return res.status(409).json({

                        success: false,

                        message:
                            "Email already exists."

                    });

                }


                // ================================
                // HASH PASSWORD
                // ================================

                const hashedPassword =
                    await bcrypt.hash(
                        password,
                        10
                    );


                // ================================
                // INSERT USER
                // ================================

                const sql = `
                    INSERT INTO users
                    (
                        first_name,
                        last_name,
                        email,
                        phone,
                        password,
                        role
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                `;


                db.query(

                    sql,

                    [
                        first_name,
                        last_name || null,
                        email,
                        phone || null,
                        hashedPassword,
                        userRole
                    ],

                    (err, result) => {

                        if (err) {

                            console.error(
                                "Register error:",
                                err
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Registration failed."

                            });

                        }


                        return res.status(201).json({

                            success: true,

                            message:
                                "Registration successful.",

                            user: {

                                id: result.insertId,

                                first_name,

                                last_name,

                                email,

                                phone,

                                role: userRole

                            }

                        });

                    }

                );

            }

        );

    } catch (error) {

        console.error(
            "Register server error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error."

        });

    }

});


// ========================================
// LOGIN
// ========================================

router.post("/login", (req, res) => {

    const {
        email,
        password,
        role
    } = req.body;


    // ================================
    // VALIDATION
    // ================================

    if (
        !email ||
        !password ||
        !role
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Email, password and account type are required."

        });

    }


    // ================================
    // VALID ROLE
    // ================================

    if (
        role !== "user" &&
        role !== "admin"
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid account type."

        });

    }


    // ================================
    // FIND USER
    // ================================

    const sql = `
        SELECT
            id,
            first_name,
            last_name,
            email,
            phone,
            password,
            role
        FROM users
        WHERE email = ?
    `;


    db.query(
        sql,
        [email],

        async (err, results) => {

            if (err) {

                console.error(
                    "Login database error:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Database error."

                });

            }


            if (results.length === 0) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password."

                });

            }


            const user = results[0];


            // ================================
            // CHECK PASSWORD
            // ================================

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!passwordMatch) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password."

                });

            }


            // ================================
            // CHECK SELECTED ROLE
            // ================================

            if (user.role !== role) {

                return res.status(403).json({

                    success: false,

                    message:
                        `This account is registered as ${user.role}. Please select ${user.role} login.`

                });

            }


            // ================================
            // CREATE TOKEN
            // ================================

            const token = jwt.sign(

                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },

                JWT_SECRET,

                {
                    expiresIn: "1d"
                }

            );


            // ================================
            // SUCCESS
            // ================================

            return res.json({

                success: true,

                message:
                    "Login successful.",

                token,

                user: {

                    id: user.id,

                    first_name:
                        user.first_name,

                    last_name:
                        user.last_name,

                    email:
                        user.email,

                    phone:
                        user.phone,

                    role:
                        user.role

                }

            });

        }

    );

});


module.exports = router;