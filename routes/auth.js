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

    } catch (error) {

    }
})
