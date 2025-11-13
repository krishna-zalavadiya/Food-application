import React, { useState, useEffect } from "react";
import { GiForkKnifeSpoon, GiChefToque } from "react-icons/gi";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiStar,
  FiShoppingCart,
  FiLogOut,
  FiKey,
} from "react-icons/fi";

import { useCart } from "../../CartContext/CartContext";
import Login from "../Login/Login";

const NavBar = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("authToken"))
  );

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem("authToken")));
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  // Desktop Auth Button
  const renderDesktopAuthButton = () => {
    return isAuthenticated ? (
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-amber-600 text-[#2D1B0E] rounded-xl font-bold hover:scale-105 transition"
      >
        <FiLogOut /> Logout
      </button>
    ) : (
      <button
        onClick={() => setShowLoginModal(true)}
        className="px-4 py-2 bg-amber-600 text-[#2D1B0E] rounded-xl font-bold hover:scale-105 transition"
      >
        <FiKey /> Login
      </button>
    );
  };

  // Mobile Auth Button
  const renderMobileAuthButton = () => {
    return isAuthenticated ? (
      <button
        onClick={() => {
          handleLogout();
          setIsOpen(false);
        }}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-amber-600/30 rounded-xl text-amber-200"
      >
        <FiLogOut /> <span>Logout</span>
      </button>
    ) : (
      <button
        onClick={() => {
          setShowLoginModal(true);
          setIsOpen(false);
        }}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-amber-600/30 rounded-xl text-amber-200"
      >
        <FiKey /> <span>Login</span>
      </button>
    );
  };

  const navLinks = [
    { name: "Home", to: "/", icon: <FiHome /> },
    { name: "Menu", to: "/menu", icon: <FiBook /> },
    { name: "About", to: "/about", icon: <FiStar /> },
    ...(isAuthenticated
      ? [{ name: "My Orders", to: "/myorder", icon: <FiBook /> }]
      : []),
  ];

  return (
    <nav className="bg-[#2D1B0E] border-b-8 border-amber-900/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* NAVBAR TOP SECTION */}
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <GiChefToque className="text-amber-500 text-4xl" />
            <span className="text-3xl font-bold text-amber-400">
              Foodie-Frenzy
            </span>
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className="text-amber-100 hover:text-amber-300 flex items-center gap-2"
              >
                {link.icon} {link.name}
              </NavLink>
            ))}

            {/* Cart */}
            <NavLink
              to="/cart"
              className="relative text-amber-100 hover:text-amber-300"
            >
              <FiShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-xs text-black w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </NavLink>

            {/* Auth */}
            {renderDesktopAuthButton()}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden text-amber-400 text-3xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden bg-[#2D1B0E] p-4 space-y-4 border-t border-amber-700/30">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-amber-100 hover:text-amber-300"
            >
              {link.icon} {link.name}
            </NavLink>
          ))}

          {/* Cart */}
          <NavLink
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-amber-100 hover:text-amber-300"
          >
            <FiShoppingCart /> Cart
          </NavLink>

          {/* Auth Button */}
          {renderMobileAuthButton()}
        </div>
      )}

      {/* LOGIN POPUP */}
      {showLoginModal && (
        <Login
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </nav>
  );
};

export default NavBar;
