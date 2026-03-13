const express = require("express"),
    router = express.Router(),
    { postRegister, postLogin } = require("../controllers/authController")

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
router.post("/register", postRegister)

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
router.post("/login", postLogin)

module.exports = router