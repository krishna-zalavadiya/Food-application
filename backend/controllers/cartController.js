import Cart from "../models/cartModels.js";

// GET USER CART
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) {
            return res.json({ items: [], total: 0 });
        }

        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ADD OR UPDATE CART ITEM
export const addToCart = async (req, res) => {
    try {
        const { userId, itemId, name, price, image } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find(i => i.itemId === itemId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ itemId, name, price, image, quantity: 1 });
        }

        cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        await cart.save();
        res.json(cart);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// REMOVE ITEM
export const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.params;

        const cart = await Cart.findOne({ userId });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(i => i.itemId !== itemId);
        cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        await cart.save();
        res.json(cart);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
