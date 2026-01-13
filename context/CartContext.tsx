import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
    id: number;
    title: string;
    price: number;
    image?: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: any) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
    itemCount: number;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product: any) => {
        setItems(currentItems => {
            const existing = currentItems.find(item => item.id === product.id);
            if (existing) {
                return currentItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...currentItems, { ...product, quantity: 1 }];
        });
    };

    const removeItem = (id: number) => {
        setItems(currentItems => currentItems.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, itemCount, total }}>
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
