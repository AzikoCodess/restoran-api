const express = require("express"),
    router = express.Router(),
    authMiddleware = require("../middleware/auth"),
    { getMenus, getMenuCategories, createMenu, deleteMenu } = require("../controllers/menuController")

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
router.get("/", getMenus)

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
router.get("/category/:category", getMenuCategories)

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
router.post("/", authMiddleware, createMenu)

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
router.delete("/:id", authMiddleware, deleteMenu)

module.exports = router