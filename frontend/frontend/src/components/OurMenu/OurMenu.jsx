import React, { useState } from "react";
import { useCart } from "../../CartContext/CartContext.jsx";
import { dummyMenuData } from "../../assets/OmDD";
import { FaMinus, FaPlus } from "react-icons/fa";
import "./OurMenu.css";

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Mexican",
  "Italian",
  "Desserts",
  "Drinks",
];

const OurMenu = () => {
  const [activeCategory, setActiveCategory] = useState("Breakfast");

  const items = dummyMenuData[activeCategory] || [];

  const { cartItems, addToCart, removeFromCart } = useCart();

  const getQuantity = (id) => {
    const found = cartItems.find((ci) => ci.item.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <div className="bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200">
          <span className="font-dancingscript block text-5xl md:text-7xl mb-2">
            Our Exquisite Menu
          </span>
          <span className="block text-xl md:text-3xl font-cinzel mt-4 text-amber-100/80">
            A Symphony of Flavours
          </span>
        </h2>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full border-2 transition-all duration-300 font-cinzel tracking-widest
                ${
                  activeCategory === cat
                    ? "bg-amber-800 text-white scale-105 border-amber-700"
                    : "bg-amber-900/20 text-amber-100 hover:bg-amber-800/40"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map((item, i) => {
            const quantity = getQuantity(item.id);

            return (
              <div
                key={item.id}
                className="bg-amber-900/20 p-5 rounded-xl border border-amber-700/40 shadow-md flex flex-col"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-48 w-full object-contain mb-4"
                />

                <h3 className="text-2xl font-dancingscript text-amber-100 mb-1">
                  {item.name}
                </h3>

                <p className="text-amber-100/80 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xl font-bold text-amber-300">
                    ₹{item.price}
                  </span>

                  {/* Add / Quantity Controls */}
                  <div className="flex items-center gap-2">
                    {quantity > 0 ? (
                      <>
                        <button
                          className="w-8 h-8 flex items-center justify-center bg-amber-800/40 rounded-full"
                          onClick={() =>
                            quantity > 1
                              ? addToCart(item, -1)
                              : removeFromCart(item.id)
                          }
                        >
                          <FaMinus className="text-amber-100" />
                        </button>

                        <span className="text-amber-100">{quantity}</span>

                        <button
                          className="w-8 h-8 flex items-center justify-center bg-amber-800/40 rounded-full"
                          onClick={() => addToCart(item, 1)}
                        >
                          <FaPlus className="text-amber-100" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="px-4 py-1 bg-amber-800/40 rounded-full text-amber-100 hover:scale-110 transition"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OurMenu;
