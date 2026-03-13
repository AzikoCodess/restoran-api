const bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken"),
    User = require("../models/User"),
    formatDate = require("../utils/formatDate")

const postRegister = async (req, res) => {
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
}

const postLogin = async (req, res) => {
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
}

module.exports = {
    postRegister,
    postLogin
}
