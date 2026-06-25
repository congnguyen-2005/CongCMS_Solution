
//export default App;
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CartPage from './pages/CartPage';
// Import các trang
import Home from './pages/Home';
import SearchPage from './pages/SearchPage'; // Trang kết quả tìm kiếm riêng
import ProductDetail from './pages/ProductDetail';
import CheckoutPage from './pages/CheckoutPage';
import PostDetail from './pages/PostDetail';
import ShopPage from './pages/ShopPage';
import './App.css';
import PostList from './components/PostList';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import MyOrders from './pages/auth/MyOrders';
import ProfilePage from './pages/auth/Profile';
function App() {
    return (
        // 🌟 1. BỌC TOÀN BỘ APP BẰNG AUTH_PROVIDER ĐỂ LƯU TRẠNG THÁI USER
        <AuthProvider>
            <MainLayout>
                <Routes>
                    {/* 1. Trang chủ: Hiện tất cả mọi thứ bao gồm cả sản phẩm */}
                    <Route path="/" element={<Home />} />

                    {/* 2. Trang riêng biệt: Chỉ hiện sản phẩm được tìm thấy */}
                    <Route path="/search" element={<SearchPage />} />

                    {/* 3. Trang chi tiết sản phẩm */}
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />

                    {/* Đường dẫn trang Chi tiết Bài viết */}
                    <Route path="/post/:id" element={<PostDetail />} />

                    {/* Đường dẫn trang Cửa hàng tổng */}
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/posts" element={<PostList />} />

                    {/* 🌟 2. THÊM 2 ĐƯỜNG DẪN ĐĂNG NHẬP / ĐĂNG KÝ VÀO ĐÂY */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/my-orders" element={<MyOrders />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </MainLayout>
        </AuthProvider>
    );
}

export default App;