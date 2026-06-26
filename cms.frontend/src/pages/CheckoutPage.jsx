import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        customerName: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        note: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        // Validation Regex
        const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

        if (!nameRegex.test(formData.customerName)) {
            setErrorMsg('⛔ Họ tên không hợp lệ!');
            setIsLoading(false);
            return;
        }
        if (!phoneRegex.test(formData.phone)) {
            setErrorMsg('⛔ Số điện thoại không hợp lệ!');
            setIsLoading(false);
            return;
        }

        try {
            // 🌟 Cấu trúc Payload khớp 100% với Backend CheckoutRequest
            const payload = {
                notes: `[Tên: ${formData.customerName}] [SĐT: ${formData.phone}] [Địa chỉ: ${formData.address}] [Ghi chú: ${formData.note}]`,
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    unitPrice: item.price
                }))
            };

            // 🌟 Gọi đúng endpoint đã định nghĩa trong Controller
            await axiosClient.post('/Checkout/PlaceOrder', payload);

            alert("🎉 Đặt hàng thành công!");
            clearCart();
            navigate('/my-orders');

        } catch (error) {
            console.error("Lỗi đặt hàng:", error.response?.data);
            setErrorMsg(error.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mt-5 pt-5 text-center">
                <h4 className="text-white">Giỏ hàng rỗng!</h4>
                <button className="btn btn-cyber mt-3" onClick={() => navigate('/shop')}>Quay lại Cửa hàng</button>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-4 mb-5 pb-5">
            <h2 className="font-weight-bold text-white mb-4">THÔNG TIN THANH TOÁN</h2>
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <div className="row">
                <div className="col-lg-7 mb-4">
                    <div className="glass-card p-4">
                        <form onSubmit={handlePlaceOrder} id="checkoutForm">
                            <div className="form-group mb-3">
                                <label className="text-white small">Họ và tên <span className="text-danger">*</span></label>
                                <input type="text" name="customerName" className="form-control" required value={formData.customerName} onChange={handleInputChange} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="text-white small">Số điện thoại <span className="text-danger">*</span></label>
                                <input type="tel" name="phone" className="form-control" required value={formData.phone} onChange={handleInputChange} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="text-white small">Địa chỉ <span className="text-danger">*</span></label>
                                <input type="text" name="address" className="form-control" required value={formData.address} onChange={handleInputChange} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="text-white small">Ghi chú</label>
                                <textarea name="note" className="form-control" rows="3" value={formData.note} onChange={handleInputChange}></textarea>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="glass-card p-4">
                        <h5 className="text-white border-bottom pb-2 mb-3">Tóm Tắt Đơn Hàng</h5>
                        {cartItems.map(item => (
                            <div key={item.id} className="d-flex justify-content-between mb-2">
                                <span>{item.quantity}x {item.name}</span>
                                <span>{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ</span>
                            </div>
                        ))}
                        <hr className="bg-light" />
                        <div className="d-flex justify-content-between h4 text-neon">
                            <span>Tổng tiền:</span>
                            <span>{new Intl.NumberFormat('vi-VN').format(cartTotal)}đ</span>
                        </div>
                        <button type="submit" form="checkoutForm" className="btn btn-cyber btn-block mt-4" disabled={isLoading}>
                            {isLoading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;