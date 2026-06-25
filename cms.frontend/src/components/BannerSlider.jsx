import React, { useState, useEffect } from 'react';
import layoutService from '../services/layoutService';

const BannerSlider = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 🌟 ĐỊA CHỈ BACKEND (Nhớ kiểm tra lại cổng cho đúng với máy bạn)
    const BACKEND_URL = "https://localhost:7089";

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await layoutService.getBanners();
                let items = [];

                // Bóc tách dữ liệu JSON an toàn
                if (Array.isArray(data)) items = data;
                else if (data && data.$values) items = data.$values;
                else if (data && data.data) items = data.data;

                setBanners(items);
            } catch (error) {
                console.error("Lỗi khi tải Banner:", error);
                setBanners([]);
            }
        };
        fetchBanners();
    }, []);

    // Hook đếm thời gian: Tự động chuyển Slide mỗi 5 giây
    useEffect(() => {
        if (banners.length <= 1) return; // Không cần tự nhảy nếu chỉ có 1 ảnh

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000); // 5000ms = 5s

        // Dọn dẹp bộ nhớ khi Component bị hủy
        return () => clearInterval(timer);
    }, [banners.length]);

    // Nếu SQL Server chưa có dữ liệu Banner nào, hiển thị Banner mặc định
    if (banners.length === 0) {
        return (
            <div className="cinematic-banner">
                <div className="banner-slide active">
                    <img src="https://dummyimage.com/1920x600/09090b/00f0ff.png&text=CameraClick+Hero" alt="Default" className="banner-img" />
                    <div className="banner-overlay">
                        <div className="banner-content">
                            <h1 className="display-4 font-weight-bold text-white mb-4" style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.5)' }}>
                                KỶ NGUYÊN NHIẾP ẢNH SỐ
                            </h1>
                            <p className="lead mb-4" style={{ color: 'var(--text-muted)' }}>Nơi mọi khung hình đều trở thành kiệt tác nghệ thuật.</p>
                            <button className="btn btn-cyber px-5 py-3" style={{ fontSize: '1.1rem' }}>
                                KHÁM PHÁ NGAY
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cinematic-banner">
            {/* 1. Kéo từng Banner ra để Render */}
            {banners.map((item, index) => {
                // Xử lý link ảnh y hệt như Sản phẩm
                const finalImg = item.imageUrl.startsWith('http')
                    ? item.imageUrl
                    : `${BACKEND_URL}${item.imageUrl}`;

                return (
                    <div key={item.id} className={`banner-slide ${index === currentIndex ? 'active' : ''}`}>
                        <img src={finalImg} alt={item.title} className="banner-img" />
                        <div className="banner-overlay">
                            <div className="banner-content">
                                <h1 className="display-4 font-weight-bold text-white mb-4" style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.5)' }}>
                                    {item.title}
                                </h1>
                                <a href={item.targetUrl || "/shop"} className="btn btn-cyber px-5 py-3" style={{ fontSize: '1.1rem' }}>
                                    XEM CHI TIẾT
                                </a>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 2. Các thanh gạch ngang nhỏ xíu ở dưới để bấm chọn slide */}
            <div className="banner-indicators">
                {banners.map((_, index) => (
                    <div
                        key={index}
                        className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default BannerSlider;