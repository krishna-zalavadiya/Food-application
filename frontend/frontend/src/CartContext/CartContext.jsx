import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";

const CartContext = createContext();

const API = "http://localhost:4000"; // BACKEND URL ✔✔✔

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return action.payload;

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);
  const [loading, setLoading] = useState(false);

  const getUserId = () => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed?.id || parsed?._id;
      }
      return localStorage.getItem("userId") || null;
    } catch {
      return localStorage.getItem("userId") || null;
    }
  };

  const userId = getUserId();

  const normalizeServerCart = (cart) => {
    if (!cart || !cart.items) return [];
    return cart.items.map((i) => ({
      item: {
        id: i.itemId?.toString(),
        name: i.name,
        price: i.price,
        image: i.image,
      },
      quantity: i.quantity,
    }));
  };

  const fetchCartFromServer = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/cart/${userId}`);
      const data = await res.json();
      dispatch({ type: "SET_CART", payload: normalizeServerCart(data) });
    } catch (err) {
      console.error("Fetch cart error:", err);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchCartFromServer();
  }, [fetchCartFromServer]);

  const addOneToServerCart = async (item) => {
    try {
      await fetch(`${API}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          itemId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
        }),
      });
    } catch (err) {
      console.error("addOneToServerCart error:", err);
    }
  };

  const addToCart = useCallback(
    async (item, qty = 1) => {
      if (qty > 0) {
        for (let i = 0; i < qty; i++) {
          await addOneToServerCart(item);
        }
      } else if (qty < 0) {
        await updateQuantity(item, getQuantity(item) + qty);
        return;
      }

      await fetchCartFromServer();
    },
    [fetchCartFromServer]
  );

  const removeFromCart = useCallback(
    async (id) => {
      await fetch(`${API}/api/cart/${userId}/${id}`, {
        method: "DELETE",
      });

      await fetchCartFromServer();
    },
    [userId, fetchCartFromServer]
  );

  const getQuantity = (item) => {
    const found = cartItems.find((ci) => ci.item.id === item.id);
    return found ? found.quantity : 0;
  };

  const updateQuantity = useCallback(
    async (item, newQty) => {
      const current = getQuantity(item);

      if (newQty === current) return;

      if (newQty === 0) {
        await removeFromCart(item.id);
        return;
      }

      await removeFromCart(item.id);

      for (let i = 0; i < newQty; i++) {
        await addOneToServerCart(item);
      }

      await fetchCartFromServer();
    },
    [cartItems, fetchCartFromServer]
  );

  const clearCart = async () => {
    for (const ci of cartItems) {
      await removeFromCart(ci.item.id);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, ci) => sum + ci.item.price * ci.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);

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
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
