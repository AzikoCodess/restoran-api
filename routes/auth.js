const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const formatDate = require("../utils/formatDate");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Ro'yxatdan o'tish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Muvaffaqiyatli ro'yxatdan o'tdingiz!
 *       400:
 *         description: Xato
 */
router.post("/register", async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ name, username, email, password: hashedPassword })
        await newUser.save()
        const formattedUser = {
            id: newUser._id,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            qoshilgan_vaqt: formatDate(newUser.createdAt)
        }
        res.status(201).json({ formattedUser, message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Kirish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token qaytariladi
 *       401:
 *         description: Noto'g'ri parol
 */
router.post("/login", async (req, res) => {
    try {
        const { login, password } = req.body
        const user = await User.findOne({
            $or: [
                { username: login },
                { email: login }
            ]
        })

        if (!user) {
            return res.status(400).json({ error: "User topilmadi" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Noto'g'ri parol" })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" })
        res.status(200).json({ token, message: "Muvaffaqiyatli kirdingiz!" })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router