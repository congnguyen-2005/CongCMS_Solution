import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext'; // Đảm bảo đúng đường dẫn tới AuthContext

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext); // Lấy thông tin user đang đăng nhập
    const [cartItems, setCartItems] = useState([]);
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    // 🌟 THUẬT TOÁN ĐỊNH DANH GIỎ HÀNG: Tạo key lưu trữ riêng cho từng ID cá nhân
    const getCartStorageKey = () => {
        return user ? `cart_user_${user.id}` : 'cart_guest';
    };

    // TỰ ĐỘNG ĐỔI GIỎ HÀNG: Mỗi khi user đăng nhập hoặc đổi tài khoản, nạp lại dữ liệu tương ứng
    useEffect(() => {
        const storedCart = localStorage.getItem(getCartStorageKey());
        setCartItems(storedCart ? JSON.parse(storedCart) : []);
    }, [user]);

    // Hàm bổ trợ lưu trữ trạng thái giỏ hàng vào đúng ngăn chứa
    const saveCartToStorage = (updatedItems) => {
        setCartItems(updatedItems);
        localStorage.setItem(getCartStorageKey(), JSON.stringify(updatedItems));
    };

    const addToCart = (product, quantity = 1) => {
        const existingItem = cartItems.find(item => item.id === product.id);
        let newItems = [];
        if (existingItem) {
            newItems = cartItems.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
            );
        } else {
            newItems = [...cartItems, { ...product, quantity }];
        }
        saveCartToStorage(newItems);
    };

    const removeFromCart = (id) => {
        const newItems = cartItems.filter(item => item.id !== id);
        saveCartToStorage(newItems);
    };

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        const newItems = cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
        );
        saveCartToStorage(newItems);
    };

    const clearCart = () => {
        saveCartToStorage([]);
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};