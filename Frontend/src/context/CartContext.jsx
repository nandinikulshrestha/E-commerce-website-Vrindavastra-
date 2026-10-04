import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setCartCount(0);
        setWishlistCount(0);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Cart count
      const cartRes = await api.get("/cart", config);

      const validCart = cartRes.data.filter(
        (item) => item.product
      );

      setCartCount(validCart.length);

      // Wishlist count
      const wishRes = await api.get("/wishlist", config);

      const validWishlist = wishRes.data.filter(
        (item) => item.product
      );

      setWishlistCount(validWishlist.length);

    } catch (error) {
      console.log("Count fetch error:", error);

      setCartCount(0);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        wishlistCount,
        fetchCounts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);