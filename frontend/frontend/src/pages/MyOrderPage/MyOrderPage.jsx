import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/Footer/Footer";

const MyOrderPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID missing");
      return;
    }

    axios
      .get(`http://localhost:4000/api/orders/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data.orders || []);
      })
      .catch((err) => console.error("FETCH ORDER ERROR:", err));
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#1a120b] text-amber-100 py-16 px-6">
        <h1 className="font-dancingscript text-5xl text-center text-amber-400 mb-10">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center text-xl text-amber-300">
            No orders found.
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#2D1B0E] p-6 rounded-xl border border-amber-700/40"
              >
                <h2 className="text-xl font-cinzel text-amber-300">
                  Order #{order._id.slice(-6)}
                </h2>

                <p className="text-amber-200 mt-2">
                  <strong>Status:</strong>{" "}
                  <span className="text-amber-400">{order.status || "Pending"}</span>
                </p>

                <div className="mt-4 space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between py-2 border-b border-amber-800/20"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="text-right mt-4 text-xl text-amber-300">
                  <strong>Total: ₹{order.total}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default MyOrderPage;
