import express from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId", authMiddleware, getCart);
router.post("/add", authMiddleware, addToCart);
router.delete("/:userId/:itemId", authMiddleware, removeFromCart);

export default router;
