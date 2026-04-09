import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "remontuz_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = (material, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === material.id);
      if (existing) {
        return prev.map(i => i.id === material.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, {
        id: material.id,
        name: material.name,
        price: Number(material.price),
        unit: material.unit,
        supplier: material.supplier,
        category: material.category,
        qty,
      }];
    });
  };

  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const setQty = (id, qty) => {
    if (qty <= 0) return remove(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
