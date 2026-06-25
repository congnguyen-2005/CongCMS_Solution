import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Thanh điều hướng luôn nằm trên cùng */}
            <Header />

            {/* Vùng nội dung sẽ thay đổi tùy theo việc khách click vào trang Home, Shop hay Cart */}
            <main className="flex-grow-1">
                {children}
            </main>

            {/* Chân trang luôn nằm dưới cùng */}
            <Footer />
        </div>
    );
};

export default MainLayout;