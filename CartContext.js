import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from local storage
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add item to cart or update quantity if already exists
  const addToCart = (food) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === food._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...food, quantity: 1 }];
      }
    });
  };

  // Update the quantity of an item
  const updateCartItem = (foodId, newQuantity) => {
    setCart((prevCart) =>
      newQuantity > 0
        ? prevCart.map((item) =>
            item._id === foodId ? { ...item, quantity: newQuantity } : item
          )
        : prevCart.filter((item) => item._id !== foodId)
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
