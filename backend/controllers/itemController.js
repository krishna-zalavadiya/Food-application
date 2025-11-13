import Item from "../models/itemModels.js";

// CREATE ITEM
export const createItem = async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET ALL ITEMS
export const getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE ITEM
export const deleteItem = async (req, res) => {
    try {
        const deleted = await Item.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
