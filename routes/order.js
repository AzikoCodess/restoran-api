const express = require("express"),
    router = express.Router(),
    authMiddleware = require("../middleware/auth"),
    { postOrder, getOrders, getMyOrders, updateOrder } = require("../controllers/orderController")

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Buyurtma berish
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menuItem:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               tableNumber:
 *                 type: number
 *     responses:
 *       201:
 *         description: Buyurtma qabul qilindi!
 *       400:
 *         description: Xato
 */
router.post("/", authMiddleware, postOrder)

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Barcha buyurtmalarni olish (faqat admin)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Buyurtmalar ro'yxati
 *       403:
 *         description: Ruxsat yo'q!
 */
router.get("/", authMiddleware, getOrders)

/**
 * @swagger
 * /order/my:
 *   get:
 *     summary: O'z buyurtmalarini olish
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Buyurtmalar ro'yxati
 */
router.get("/my", authMiddleware, getMyOrders)

/**
 * @swagger
 * /order/{id}/status:
 *   put:
 *     summary: Buyurtma holatini yangilash (faqat admin)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, ready, delivered]
 *     responses:
 *       200:
 *         description: Holat yangilandi!
 *       403:
 *         description: Ruxsat yo'q!
 */
router.put("/:id/status", authMiddleware, updateOrder)

module.exports = router