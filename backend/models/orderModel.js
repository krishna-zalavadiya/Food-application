import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  imageUrl: String
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    items: [orderItemSchema],

    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    zipCode: String,

    paymentMethod: String,
    subtotal: Number,
    tax: Number,
    total: Number,

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
