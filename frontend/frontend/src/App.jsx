import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import Menu from "./pages/Menu/Menu";
import AboutPage from "./pages/AboutPage/AboutPage";
import CartPage from "./pages/Cart/Cart.jsx";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage.jsx";
import MyOrderPage from "./pages/MyOrderPage/MyOrderPage.jsx";

// remove Login route
import SignUp from "./components/SignUp/SignUp.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/about" element={<AboutPage />} />

      {/* AUTH ROUTES */}
      <Route path="/signup" element={<SignUp />} />

      {/* CART */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/myorder" element={<MyOrderPage />} />

      <Route
        path="*"
        element={<h1 className="text-center mt-20 text-white">404 - Not Found</h1>}
      />
    </Routes>
  );
};

export default App;
