import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 🌟 SỬA TẠI ĐÂY: Dùng kỹ thuật Lazy Initialization
    // React sẽ đọc localStorage ngay lặp tức trong quá trình khởi tạo state
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");

            if (!storedUser || storedUser === "undefined") {
                return null;
            }

            return JSON.parse(storedUser);
        } catch (e) {
            localStorage.removeItem("user");
            return null;
        }
    });

    // Hàm xử lý khi user đăng nhập thành công
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Lưu vào trình duyệt
    };

    // Hàm xử lý đăng xuất
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};