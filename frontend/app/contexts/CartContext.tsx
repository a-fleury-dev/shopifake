import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ProductVariant, CartItem, Cart } from '../lib/types/storefront';
import { toast } from 'sonner';

interface CartContextType {
  cart: Cart;
  addToCart: (variant: ProductVariant, quantity: number, successMessage: string) => void;
  removeFromCart: (variantId: number, removeMessage: string) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
  });

  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
  };

  const addToCart = (variant: ProductVariant, quantity: number, successMessage: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.variant.id === variant.id
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        newItems = [...prevCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
      } else {
        newItems = [...prevCart.items, { variant, quantity }];
      }

      toast.success(successMessage);

      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  };

  const removeFromCart = (variantId: number, removeMessage: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.variant.id !== variantId);
      toast.success(removeMessage);
      
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  };

  const updateQuantity = (variantId: number, quantity: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.variant.id === variantId ? { ...item, quantity } : item
      );
      
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
