import express from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cartController.js";

const router = express.Router();

// Get user cart
router.get("/:userId", getCart);

// Add to cart
router.post("/", addToCart);

// Remove item from cart
router.delete("/:userId/:itemId", removeFromCart);

export default router;
