import express from "express";
import { createItem, getItems, deleteItem } from "../controllers/itemController.js";

const router = express.Router();

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:id", deleteItem);

export default router;
