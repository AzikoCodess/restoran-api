const express = require("express")
const router = express.Router()
const Menu = require("../models/Menu")
const authMiddleware = require("../middleware/auth")
const formatDate = require("../utils/formatDate")

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Barcha taomlarni olish
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Taomlar ro'yxati
 */
router.get("/", async (req, res) => {
    try {
        const menu = await Menu.find({ available: true })
        const formattedMenu = menu.map(item => ({
            id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            qoshilgan_vaqt: formatDate(item.createdAt),
            yangilandi: formatDate(item.updatedAt)
        }))
        res.json(formattedMenu)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

/**
 * @swagger
 * /menu/category/{category}:
 *   get:
 *     summary: Kategoriya bo'yicha taomlar
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [salatlar, asosiy, ichimliklar, desertlar]
 *     responses:
 *       200:
 *         description: Taomlar ro'yxati
 */
router.get("/category/:category", async (req, res) => {
    try {
        const menu = await Menu.find({ category: req.params.category, available: true })
        const formattedMenu = menu.map(item => ({
            id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            qoshilgan_vaqt: formatDate(item.createdAt),
            yangilandi: formatDate(item.updatedAt)
        }))
        res.json(formattedMenu)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Yangi taom qo'shish (faqat admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [salatlar, asosiy, ichimliklar, desertlar]
 *     responses:
 *       201:
 *         description: Taom qo'shildi!
 *       403:
 *         description: Ruxsat yo'q!
 */
router.post("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Ruxsat yo'q!" })
        }
        const { name, description, price, category } = req.body
        const newItem = new Menu({ name, description, price, category })
        await newItem.save()
        res.status(201).json({
            newItem: {
                id: newItem._id,
                name: newItem.name,
                description: newItem.description,
                price: newItem.price,
                category: newItem.category,
                qoshilgan_vaqt: formatDate(newItem.createdAt)
            },
            message: "Taom qo'shildi!"
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

/**
 * @swagger
 * /menu/{id}:
 *   delete:
 *     summary: Taomni o'chirish (faqat admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Taom o'chirildi!
 *       403:
 *         description: Ruxsat yo'q!
 */
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Ruxsat yo'q!" })
        }
        const item = await Menu.findByIdAndDelete(req.params.id)
        if (item) {
            return res.json({ message: "Taom o'chirildi!" })
        } else {
            return res.status(404).json({ error: "Taom topilmadi!" })
        }

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router