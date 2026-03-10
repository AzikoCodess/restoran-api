const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ name, username, email, password: hashedPassword })
        await newUser.save()
        res.status(201).json({ message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post("/login", async (req, res) => {
    try {
        const { login, password } = req.body
        const user = await User.findOne({
            $or: {
                username: login,
                email: login
            }
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
        res.status(500).json({ message: error.message })
    }
})