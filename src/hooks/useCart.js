import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";

export const useCart = () => {
  // Aca recupero del localStorage mi carrito para guardarlo en una variable, utilizo el JSON.parse para pasarlo de un string a un array.
  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart");
    // Si no me retorna un null hago el parse, si me retorna un null guardo un array vacio.
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);
  const MIN_ITEMS = 1;
  const MAX_ITEMS = 5;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item) {
    const itemExist = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemExist >= 0) {
      // Existe en el carrito
      const updatedCart = [...cart];
      updatedCart[itemExist].quantity++;
      setCart(updatedCart);
    } else {
      item.quantity = 1;
      setCart((prevState) => [...prevState, item]);
    }
  }

  function removeFromCart(id) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  function decreaseQuantity(id) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

  // State Derivado
  /* Aca utilizo el Hook de useMemo para mejorar el perfomance, si veo que me funciona lo uso, si veo que no me actualiza bien el cache de mis componentes no lo uso.
     el array de dependecias apuntando a cart espera que se modifique algo en cart para hacer los cambios. */
  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  // El 0 que pongo al final es para indicar que el acumulador empiece en 0.
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    clearCart,
    decreaseQuantity,
    isEmpty,
    cartTotal,
  };
};
