import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
        {
            itemId: String,
            name: String,
            price: Number,
            image: String,
            quantity: { type: Number, default: 1 }
        }
    ],
    total: { type: Number, default: 0 }
});

export default mongoose.model("Cart", cartSchema);
