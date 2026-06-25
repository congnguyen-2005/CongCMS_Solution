import React, { useContext } from 'react';

import { CartContext } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);
    const navigate = useNavigate();

    const BACKEND_URL = "https://localhost:7089";
    const defaultImage = "https://dummyimage.com/150x150/18181b/00f0ff.png&text=Camera";
    
    const handleProceedToCheckout = () => {
        const storedUser = localStorage.getItem('user') || localStorage.getItem('customer');
        if (!storedUser) {
            alert("Vui lòng Đăng nhập hoặc Đăng ký tài khoản để tiến hành đặt hàng nhé!");
            // 🌟 Mẹo hay: Truyền thêm chữ "?redirect=/checkout" để báo cho trang Login biết phải quay lại đâu
            navigate('/login?redirect=/checkout');
        } else {
            navigate('/checkout');
        }
    };
    if (cartItems.length === 0) {
        return (
            <div className="container mt-5 pt-5 mb-5 text-center h-100">
                <i className="fa-solid fa-cart-arrow-down fa-4x text-muted mb-4"></i>
                <h3 className="text-white mb-3">Giỏ hàng của bạn đang trống</h3>
                <p className="text-muted">Có vẻ như bạn chưa chọn được thiết bị nào.</p>
                <button className="btn btn-cyber mt-3 px-4" onClick={() => navigate('/')}>
                    Về Trang Chủ Mua Sắm
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-4 mb-5 pb-5">
            <h2 className="font-weight-bold text-white mb-4">
                <i className="fa-solid fa-cart-shopping mr-2 text-neon"></i> GIỎ HÀNG CỦA BẠN
            </h2>

            <div className="row">
                <div className="col-lg-8 mb-4">
                    <div className="glass-card p-0 overflow-hidden">
                        <table className="table table-hover table-borderless text-white mb-0 align-middle">
                            <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <tr>
                                    <th className="py-3 px-4">Thiết Bị</th>
                                    <th className="py-3 text-center">Đơn Giá</th>
                                    <th className="py-3 text-center">Số Lượng</th>
                                    <th className="py-3 text-right pr-4">Thành Tiền</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => {
                                    const finalImg = item.imageUrl && item.imageUrl.startsWith('http')
                                        ? item.imageUrl
                                        : (item.imageUrl ? `${BACKEND_URL}${item.imageUrl}` : defaultImage);

                                    return (
                                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td className="p-4 d-flex align-items-center">
                                                <img src={finalImg} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} className="mr-3 shadow-sm border border-secondary" />
                                                <div>
                                                    <h6 className="font-weight-bold mb-1">{item.name}</h6>
                                                    <span className="badge badge-dark text-muted">{item.categoryName}</span>
                                                </div>
                                            </td>
                                            <td className="text-center font-weight-bold" style={{ color: 'var(--text-muted)' }}>
                                                {new Intl.NumberFormat('vi-VN').format(item.price)}đ
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <button className="btn btn-sm btn-dark" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                                    <span className="mx-3 font-weight-bold">{item.quantity}</span>
                                                    <button className="btn btn-sm btn-dark" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                                </div>
                                            </td>
                                            <td className="text-right pr-4 font-weight-bold text-neon" style={{ fontSize: '1.1rem' }}>
                                                {new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ
                                            </td>
                                            <td className="text-center pr-3">
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.id)} title="Xóa khỏi giỏ">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* KHỐI TỔNG TIỀN & THANH TOÁN */}
                <div className="col-lg-4">
                    <div className="glass-card p-4 sticky-top" style={{ top: '100px' }}>
                        <h5 className="font-weight-bold text-white mb-4 border-bottom pb-3" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                            TỔNG QUAN ĐƠN HÀNG
                        </h5>

                        <div className="d-flex justify-content-between mb-3 text-muted">
                            <span>Tạm tính ({cartItems.length} sản phẩm):</span>
                            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4 text-muted border-bottom pb-4" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                            <span>Phí vận chuyển:</span>
                            <span>Đang cập nhật</span>
                        </div>

                        <div className="d-flex justify-content-between mb-4">
                            <span className="h5 text-white">Tổng cộng:</span>
                            <span className="h4 font-weight-bold text-neon">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}
                            </span>
                        </div>

                        <button
                            onClick={handleProceedToCheckout}
                            className="btn btn-primary btn-block py-2 font-weight-bold"
                            style={{ backgroundColor: '#005088', borderColor: '#005088', borderRadius: '8px' }}
                        >
                            TIẾN HÀNH CHỐT ĐƠN <i className="fas fa-arrow-right ml-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;