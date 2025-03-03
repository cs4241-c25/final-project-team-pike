import express from "express";
import GroceryItem from "../models/GroceryItem.js";

const router = express.Router();

// Get all grocery items
router.get("/", async (req, res) => {
    try {
        const items = await GroceryItem.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch grocery list." });
    }
});

// Add new grocery item
router.post("/", async (req, res) => {
    try {
        const newItem = new GroceryItem(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: "Failed to add item." });
    }
});

// Mark item as purchased
router.patch("/:id", async (req, res) => {
    try {
        const updatedItem = await GroceryItem.findByIdAndUpdate(
            req.params.id,
            { status: "purchased", purchasedAt: new Date() },
            { new: true }
        );
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: "Failed to update item." });
    }
});

export default router;
