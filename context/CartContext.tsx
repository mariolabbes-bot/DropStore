
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

interface CartItem {
    id: number; // CartItem ID (DB id), unique per line item
    productId: number; // Product ID
    title: string;
    price: number;
    image?: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: any) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    clearCart: () => void;
    itemCount: number;
    total: number;
    loading: boolean;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Initial Load from Server
    useEffect(() => {
        const fetchCart = async () => {
            const cartId = localStorage.getItem('cartId');
            if (!cartId) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/cart?cartId=${cartId}`);
                if (res.ok) {
                    const data = await res.json();
                    setItems(data.items || []);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const addItem = async (product: any) => {
        const cartId = localStorage.getItem('cartId');
        // Optimistic UI update could go here, but for safety let's wait for server response or show loading toast in component

        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartId,
                    productId: product.id || product.productId, // Handle different shapes
                    title: product.title,
                    price: product.price,
                    quantity: 1,
                    image: product.image || (product.images && product.images[0])
                })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('cartId', data.id); // Ensure ID is saved if new
                setItems(data.items || []);
                setIsCartOpen(true); // <--- Auto open cart
                return Promise.resolve();
            } else {
                throw new Error('Failed to add to cart');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al sincronizar carrito');
            return Promise.reject(error);
        }
    };

    const removeItem = async (itemId: number) => {
        // Optimistic remove
        const oldItems = [...items];
        setItems(items.filter(i => i.id !== itemId));

        try {
            const res = await fetch(`/api/cart?itemId=${itemId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                // Revert
                setItems(oldItems);
                toast.error('Error al eliminar item');
            } else {
                // If effective, maybe refetch to be sure? 
                // For now, optimistic is fine if server side succeeded.
            }
        } catch (error) {
            console.error(error);
            setItems(oldItems);
            toast.error('Error de conexión');
        }
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('cartId');
        // Note: Ideally call API to clear server cart too, but current API doesn't have clear method. 
        // Assuming we just lose the reference.
    };

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, itemCount, total, loading, isCartOpen, openCart, closeCart }}>
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
