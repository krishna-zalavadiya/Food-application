import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";

const CartContext = createContext();

// ---------------- REDUCER --------------------
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, quantity } = action.payload;
      const existing = state.find((ci) => ci.item.id === item.id);

      if (existing) {
        return state.map((ci) =>
          ci.item.id === item.id
            ? { ...ci, quantity: ci.quantity + quantity }
            : ci
        );
      }

      return [...state, { item, quantity }];
    }

    case "REMOVE_ITEM":
      return state.filter((ci) => ci.item.id !== action.payload);

    case "UPDATE_QUANTITY": {
      const { item, quantity } = action.payload;
      return state.map((ci) =>
        ci.item.id === item.id ? { ...ci, quantity } : ci
      );
    }

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

// ------------- INITIAL CART -----------------
const initializer = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};

// ------------- PROVIDER ---------------------
export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);

  // LocalStorage Sync
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Total calculations
  const totalAmount = cartItems.reduce(
    (sum, ci) => sum + Number(ci.item.price) * ci.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);

  // ACTIONS --------
  const addToCart = useCallback((item, qty = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { item, quantity: qty } });
  }, []);

  const removeFromCart = useCallback((id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  }, []);

  const updateQuantity = useCallback((item, qty) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { item, quantity: qty } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
