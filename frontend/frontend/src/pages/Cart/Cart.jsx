import React from "react";
import { useCart } from "../../CartContext/CartContext.jsx";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/Footer/Footer";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart, totalAmount } = useCart();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#1a120b] text-amber-100 py-16 px-6">
        <h1 className="text-center font-dancingscript text-5xl text-amber-300 mb-10">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center text-2xl text-amber-200">
            Your cart is empty.
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            {cartItems.map((ci) => (
              <div
                key={ci.item.id}
                className="flex items-center justify-between bg-[#2D1B0E] p-4 rounded-xl border border-amber-600/30"
              >
                {/* Image */}
                <img
                  src={ci.item.image}
                  alt={ci.item.name}
                  className="w-28 h-28 object-contain bg-black/20 rounded-lg"
                />

                {/* Name + price */}
                <div className="flex-1 px-4">
                  <h2 className="text-2xl font-dancingscript">{ci.item.name}</h2>
                  <p className="text-lg text-amber-300">₹{ci.item.price}</p>
                </div>

                {/* Quantity buttons */}
                <div className="flex items-center gap-3">
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-amber-700/40 rounded-full"
                    onClick={() =>
                      ci.quantity > 1
                        ? addToCart(ci.item, -1)
                        : removeFromCart(ci.item.id)
                    }
                  >
                    <FaMinus />
                  </button>

                  <span className="w-8 text-center text-xl">{ci.quantity}</span>

                  <button
                    className="w-8 h-8 flex items-center justify-center bg-amber-700/40 rounded-full"
                    onClick={() => addToCart(ci.item, 1)}
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Remove */}
                <button
                  className="ml-4 flex items-center gap-2 text-red-400 hover:text-red-300"
                  onClick={() => removeFromCart(ci.item.id)}
                >
                  <FaTrash /> Remove
                </button>
              </div>
            ))}

            {/* Total + Checkout */}
            <div className="flex justify-between items-center mt-10 px-4">
              <h2 className="text-3xl font-cinzel text-amber-200">
                Total: <span className="text-amber-400">₹{totalAmount}</span>
              </h2>

              <Link to="/checkout">
                <button className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-800 rounded-xl text-[#2D1B0E] font-bold text-lg hover:scale-105 transition">
                  Checkout Now
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default CartPage;
