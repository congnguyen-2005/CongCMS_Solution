import React, { createContext, useState, useEffect } from 'react';

// Tạo Context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // 1. Khởi tạo giỏ hàng từ Local Storage (để F5 không bị mất hàng)
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cameraClick_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // 2. Mỗi khi giỏ hàng thay đổi, lưu lại ngay vào Local Storage
    useEffect(() => {
        localStorage.setItem('cameraClick_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // 3. Hàm thêm vào giỏ
    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                // Nếu đã có trong giỏ, chỉ tăng số lượng
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            // Nếu chưa có, thêm mới hoàn toàn
            return [...prevItems, { ...product, quantity }];
        });
    };

    // 4. Hàm xóa khỏi giỏ
    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
    };

    // 5. Hàm cập nhật số lượng (+ / -)
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return; // Không cho giảm xuống dưới 1
        setCartItems((prevItems) =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // 🌟 6. Hàm dọn sạch giỏ hàng (Bắt buộc phải nằm TRƯỚC lệnh return)
    const clearCart = () => {
        setCartItems([]);
    };

    // 7. Tính tổng số lượng và tổng tiền
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    // 8. CHỈ CÓ DUY NHẤT 1 LỆNH RETURN Ở CUỐI CÙNG
    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            cartCount,
            cartTotal,
            clearCart // Đã thêm hàm này thành công
        }}>
            {children}
        </CartContext.Provider>
    );
};