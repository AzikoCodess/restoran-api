const express = require("express"),
    router = express.Router(),
    Order = require("../models/Order"),
    authMiddleware = require("../middleware/auth"),
    Menu = require("../models/Menu"),
    formatDate = require("../utils/formatDate")


router.post("/", authMiddleware, async (req, res) => {
    try {
        const { items, tableNumber } = req.body

        let totalPrice = 0
        for (let item of items) {
            const menuItem = await Menu.findById(item.menuItem)
            if (!menuItem) {
                return res.status(404).json({ error: "Taom topilmadi!" })
            }
            totalPrice += menuItem.price * item.quantity
        }

        const newOrder = new Order({
            user: req.user.id,
            items,
            tableNumber,
            totalPrice
        })

        await newOrder.save()
        const formattedOrder = {
            id: newOrder._id,
            user: newOrder.user,
            items: newOrder.items,
            tableNumber: newOrder.tableNumber,
            totalPrice: newOrder.totalPrice,
            status: newOrder.status,
            qoshilgan_vaqt: formatDate(newOrder.createdAt)
        }
        res.status(201).json({ message: "Buyurtma qabul qilindi!" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Ruxsat yo'q!" })
        }
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.menuItem", "name price")
        const formattedOrders = orders.map(order => ({
            id: order._id,
            user: order.user,
            items: order.items,
            tableNumber: order.tableNumber,
            totalPrice: order.totalPrice,
            status: order.status,
            qoshilgan_vaqt: formatDate(order.createdAt)
        }))
        res.json(formattedOrders)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get("/my", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate("items.menuItem", "name price")
        res.json(orders)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.put("/:id/status", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Ruxsat yo'q!" })
        }

        const { status } = req.body
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
        if (order) {
            res.json({ order, message: "Holat yangilandi!" })
        } else {
            res.status(404).json({ error: "Buyurtma topilmadi!" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

module.exports = router