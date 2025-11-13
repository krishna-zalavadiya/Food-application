import React, { useState } from "react";
import { useCart } from "../../CartContext/CartContext.jsx";
import axios from "axios";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "cod", // COD ONLY
  });

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("User not logged in!");
        return;
      }

      const orderData = {
        userId,
        items: cartItems.map((ci) => ({
          name: ci.item.name,
          price: ci.item.price,
          quantity: ci.quantity,
          imageUrl: ci.item.image,
        })),
        subtotal: totalAmount,
        tax: 0,
        total: totalAmount,

        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        zipCode: form.zipCode,
        paymentMethod: "cod", // FORCE COD
      };

      const res = await axios.post(
        "http://localhost:4000/api/orders",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        alert("Order placed successfully!");
        clearCart();
        navigate("/myorder");
      } else {
        alert("Order failed, try again");
      }
    } catch (err) {
      console.error("ORDER ERROR:", err);
      alert("Error creating order. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#1a120b] text-amber-100 py-16 px-6">
        <div className="max-w-5xl mx-auto bg-[#2D1B0E] p-8 rounded-2xl border border-amber-700/40 shadow-xl">
          <h1 className="text-center font-dancingscript text-5xl text-amber-300 mb-8">
            Checkout
          </h1>

          <form className="grid md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
            
            {/* LEFT FORM */}
            <div className="space-y-4">
              <input type="text" name="firstName" placeholder="First Name"
                value={form.firstName} onChange={handleInput} required
                className="w-full p-3 rounded-lg bg-amber-950/40 border border-amber-600/40 focus:border-amber-400 outline-none" />

              <input type="text" name="lastName" placeholder="Last Name"
                value={form.lastName} onChange={handleInput} required
                className="w-full p-3 rounded-lg bg-amber-950/40 border border-amber-600/40 focus:border-amber-400 outline-none" />

              <input type="email" name="email" placeholder="Email"
                value={form.email} onChange={handleInput} required
                className="w-full p-3 rounded-lg bg-amber-950/40 border border-amber-600/40 focus:border-amber-400 outline-none" />

              <input type="text" name="phone" placeholder="Phone Number"
                value={form.phone} onChange={handleInput} required
                className="w-full p-3 rounded-lg bg-amber-950/40 border border-amber-600/40 focus:border-amber-400 outline-none" />

              <input type="text" name="address" placeholder="Address"
                value={form.address} onChange={handleInput} required
                className="w-full p-3 rounded-lg bg-amber-950/40 border border-amber-600/40 focus:border-amber-400 outline-none" />

              <input type="text" name="city" placeholder="City"
                value={form.city} onChange={handleInput} required
                className="w-full p-3 rounded-lg bg-amber-950/40 border border-amber-600/40 focus:border-amber-400 outline-none" />

              <input type="text" name="zipCode" placeholder="ZIP Code"
                value={form.zipCode} onChange={handleInput} required
                className="w-full p-3 rounded-lg bg-amber-950/40 border border-amber-600/40 focus:border-amber-400 outline-none" />

              {/* Payment Method (COD Only) */}
              <select name="paymentMethod" value="cod" disabled
                className="w-full p-3 rounded-lg bg-amber-950/40 border border-amber-600/40">
                <option value="cod">Cash on Delivery</option>
              </select>

              <button type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-700 py-3 rounded-lg text-[#2D1B0E] font-bold hover:scale-105 transition">
                Place Order
              </button>
            </div>

            {/* RIGHT ORDER SUMMARY */}
            <div className="bg-[#1a120b]/50 p-6 rounded-xl border border-amber-700/30">
              <h2 className="text-3xl font-cinzel mb-4 text-amber-300">Order Summary</h2>

              {cartItems.map((ci) => (
                <div key={ci.item.id} className="flex justify-between py-2 border-b border-amber-800/30 text-amber-200">
                  <span>{ci.item.name} x {ci.quantity}</span>
                  <span>₹{ci.item.price * ci.quantity}</span>
                </div>
              ))}

              <div className="flex justify-between text-2xl mt-4 text-amber-400 font-bold">
                <span>Total:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CheckoutPage;
