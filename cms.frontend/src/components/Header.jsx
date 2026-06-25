import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import layoutService from '../services/layoutService';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
    const [menus, setMenus] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { cartCount } = useContext(CartContext);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const { user, logout } = useContext(AuthContext);
    // 🌟 2. Hàm xử lý khi bấm nút Đăng nhập
    const handleLoginClick = () => {
        setShowComingSoon(true);

        // Tự động ẩn thông báo sau 3 giây (3000ms) để không vướng màn hình
        setTimeout(() => {
            setShowComingSoon(false);
        }, 3000);
    };

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const data = await layoutService.getMenus();
                if (Array.isArray(data)) setMenus(data);
                else if (data && data.$values) setMenus(data.$values);
                else if (data && data.data) setMenus(data.data);
                else setMenus([]);
            } catch (error) {
                setMenus([]);
            }
        };
        fetchMenus();
    }, []);

    const parentMenus = menus.filter(m => m.parentId === null || m.parentId === 0);

    // KHI ẤN ENTER TÌM KIẾM
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Chuyển hướng sang trang kết quả riêng kèm tham số ?q=
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm(''); // Xóa chữ trong ô sau khi đã tìm kiếm thành công
        }
    };

    return (
        // 🌟 BẮT ĐẦU THẺ FRAGMENT ĐỂ BỌC TOÀN BỘ HEADER VÀ POPUP
        <>
            <header className="glass-header py-3">
                <div className="container-fluid d-flex px-xl-5 justify-content-between align-items-center">

                    {/* LOGO */}
                    <a href="/" className="text-decoration-none d-flex align-items-center">
                        <span className="h4 mb-0 font-weight-bold" style={{ color: 'white', letterSpacing: '2px' }}>
                            CAMERA<span style={{ color: 'var(--neon-cyan)' }}>CLICK</span>
                        </span>
                    </a>

                    {/* MENU CHẤT LƯỢNG CHA CON */}
                    <nav className="d-none d-md-flex align-items-center">
                        {menus.map((parent) => {
                            const childMenus = menus.filter(m => m.parentId === parent.id);
                            const hasChildren = childMenus.length > 0;
                            if (parent.parentId !== null && parent.parentId !== 0) return null;

                            if (hasChildren) {
                                return (
                                    <div className="nav-item-dropdown mx-3" key={parent.id}>
                                        <a href={parent.linkUrl} className="nav-link-custom text-decoration-none d-flex align-items-center">
                                            {parent.name} <i className="fa-solid fa-chevron-down arrow-icon"></i>
                                        </a>
                                        <div className="glass-dropdown-menu">
                                            {childMenus.map((child) => (
                                                <a key={child.id} href={child.linkUrl} className="glass-dropdown-item">{child.name}</a>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div className="nav-item-dropdown mx-3" key={parent.id}>
                                    <a href={parent.linkUrl} className="nav-link-custom text-decoration-none">{parent.name}</a>
                                </div>
                            );
                        })}
                    </nav>
                    {/*<div className="nav-item-dropdown mx-3">*/}
                    {/*    <a href="/shop" className="nav-link-custom text-decoration-none text-neon" style={{ fontWeight: 'bold' }}>*/}
                    {/*        <i className="fa-solid fa-border-all mr-1"></i> TẤT CẢ SẢN PHẨM*/}
                    {/*    </a>*/}
                    {/*</div>*/}
                    {/* KHU VỰC ĐƯA Ô TÌM KIẾM LÊN ĐÂY */}
                    <div className="d-flex align-items-center">
                        <form onSubmit={handleSearch} className="position-relative mr-4 d-none d-lg-block" style={{ width: '240px' }}>
                            <input
                                type="text"
                                className="cyber-search-box py-1 px-3"
                                style={{ fontSize: '0.85rem' }}
                                placeholder="Tìm kiếm máy ảnh..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <i className="fa-solid fa-magnifying-glass position-absolute cursor-pointer" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neon-cyan)', fontSize: '0.9rem' }} onClick={handleSearch}></i>
                        </form>

                        {/* CÔNG CỤ: TÌM KIẾM & GIỎ HÀNG */}
                        <div className="d-flex align-items-center">
                            {/* 🌟 Gắn sự kiện click và hiển thị cartCount */}
                            <div
                                className="cart-icon-wrapper mr-4 cursor-pointer"
                                onClick={() => navigate('/cart')}
                                style={{ position: 'relative' }}
                            >
                                <i className="fa-solid fa-cart-shopping" style={{ fontSize: '1.2rem', color: 'white' }}></i>
                                {cartCount > 0 && (
                                    <span className="badge badge-danger position-absolute" style={{ top: '-8px', right: '-12px', borderRadius: '50%' }}>
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            {user ? (
                                <div className="nav-item-dropdown ml-3 position-relative">
                                    {/* Tên hiển thị trên Header */}
                                    <div className="d-flex align-items-center cursor-pointer text-white" style={{ fontWeight: 'bold' }}>
                                        <i className="fa-regular fa-circle-user mr-2 text-neon" style={{ fontSize: '1.2rem' }}></i>
                                        {user.name} <i className="fa-solid fa-chevron-down ml-1" style={{ fontSize: '0.7rem' }}></i>
                                    </div>

                                    {/* Menu Dropdown rơi xuống */}
                                    <div className="glass-dropdown-menu" style={{ right: 0, left: 'auto', minWidth: '220px' }}>
                                        <div className="px-3 py-2 border-bottom mb-2" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                                            <small className="text-muted d-block">Xin chào,</small>
                                            <strong className="text-white">{user.name}</strong>
                                        </div>
                                        <a href="/profile" className="glass-dropdown-item">
                                            <i className="fa-solid fa-id-card mr-2 text-muted"></i> Thông tin khách hàng
                                        </a>
                                        <a href="/my-orders" className="glass-dropdown-item">
                                            <i className="fa-solid fa-box-open mr-2 text-muted"></i> Đơn hàng đã đặt
                                        </a>
                                        <div className="dropdown-divider my-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}></div>
                                        <button
                                            onClick={logout}
                                            className="glass-dropdown-item text-danger border-0 bg-transparent w-100 text-left"
                                        >
                                            <i className="fa-solid fa-right-from-bracket mr-2"></i> Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            ) :
                                (
                                    <button
                                        className="btn btn-cyber d-none d-md-block ml-3"
                                        onClick={() => navigate('/login')} // Đổi hàm này thành chuyển hướng trang
                                    >
                                        Đăng nhập
                                    </button>
                                )}
                        </div>
                    </div>
                </div>
            </header>

            {/* 🌟 4. GIAO DIỆN THÔNG BÁO NỔI (TOAST POPUP) NẰM TRONG FRAGMENT */}
            {showComingSoon && (
                <div
                    className="shadow-lg"
                    style={{
                        position: 'fixed',
                        top: '90px', /* Nằm ngay dưới thanh Header */
                        right: '20px',
                        background: 'rgba(24, 24, 27, 0.95)',
                        borderLeft: '4px solid var(--neon-cyan)',
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        padding: '15px 25px',
                        borderRadius: '4px',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <i className="fa-solid fa-screwdriver-wrench mr-3" style={{ color: 'var(--neon-cyan)', fontSize: '1.5rem' }}></i>
                    <div>
                        <h6 className="mb-1 font-weight-bold" style={{ color: 'var(--neon-cyan)' }}>
                            Tính năng đang nâng cấp
                        </h6>
                        <small className="text-light">
                            Hệ thống đăng nhập sẽ sớm ra mắt. Cảm ơn bạn đã chờ!
                        </small>
                    </div>
                </div>
            )}
        </> // <-- 🌟 ĐÓNG THẺ FRAGMENT TẠI ĐÂY LÀ KẾT THÚC RETURN
    );
};

export default Header;