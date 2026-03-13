const Menu = require('../models/Menu'),
    formatDate = require('../utils/formatDate'),
    authMiddleware = require('../middleware/auth')

const getMenus = async (req, res) => {
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
}

const getMenuCategories = async (req, res) => {
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
}

const createMenu = async (req, res) => {
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
}

const deleteMenu = async (req, res) => {
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
}

module.exports = {
    getMenus,
    getMenuCategories,
    createMenu,
    deleteMenu
}

