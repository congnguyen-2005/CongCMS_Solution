import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import axiosClient from '../api/axiosClient'; // Đảm bảo bạn đã cấu hình file này

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // State lưu thông tin khách hàng
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        address: '',
        note: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // HÀM XỬ LÝ KHI BẤM XÁC NHẬN ĐẶT HÀNG
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            // 1. Chuẩn bị dữ liệu theo đúng DTO của Backend
            const payload = {
                // Gộp thông tin lại thành 1 chuỗi Notes vì Backend hiện tại chỉ nhận Notes
                notes: `[Tên: ${formData.customerName}] [SĐT: ${formData.phone}] [Địa chỉ: ${formData.address}] [Ghi chú: ${formData.note}]`,
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    unitPrice: item.price
                }))
            };

            // 2. Gọi API POST xuống Backend
            const response = await axiosClient.post('/Checkout/PlaceOrder', payload);

            // 3. Xử lý khi thành công
            alert(response.message || "Đặt hàng thành công!");
            clearCart(); // Dọn dẹp giỏ hàng
            navigate('/'); // Tạm thời chuyển về trang chủ (hoặc trang Success)

        } catch (error) {
            console.error("Lỗi đặt hàng:", error);

            // 🌟 LÔI LỖI CHI TIẾT TỪ BACKEND RA MÀN HÌNH
            const serverError = error.response?.data?.error;
            const serverMsg = error.response?.data?.message;

            setErrorMsg(`Lỗi Server: ${serverError || serverMsg || "Không rõ nguyên nhân, hãy xem F12"}`);
        } finally {
            setIsLoading(false); // Tắt trạng thái đang load
        } // 🌟 ĐÓNG NGOẶC CỦA KHỐI FINALLY TẠI ĐÂY
    }; // 🌟 RỒI MỚI ĐÓNG NGOẶC CỦA HÀM handlePlaceOrder TẠI ĐÂY

    // Tránh việc khách gõ URL /checkout khi giỏ trống
    if (cartItems.length === 0) {
    };

    // Tránh việc khách gõ URL /checkout khi giỏ trống
    if (cartItems.length === 0) {
        return (
            <div className="container mt-5 pt-5 text-center">
                <h4 className="text-white">Giỏ hàng rỗng! Bạn không thể thanh toán.</h4>
                <button className="btn btn-cyber mt-3" onClick={() => navigate('/shop')}>Quay lại Cửa hàng</button>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-4 mb-5 pb-5">
            <h2 className="font-weight-bold text-white mb-4">THÔNG TIN THANH TOÁN</h2>

            {errorMsg && (
                <div className="alert alert-danger font-weight-bold mb-4 border-left-danger shadow-sm">
                    <i className="fa-solid fa-triangle-exclamation mr-2"></i> {errorMsg}
                </div>
            )}

            <div className="row">
                {/* CỘT TRÁI: FORM NHẬP THÔNG TIN */}
                <div className="col-lg-7 mb-4">
                    <div className="glass-card p-4">
                        <h5 className="font-weight-bold text-neon border-bottom pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                            Thông Tin Giao Hàng
                        </h5>
                        <form onSubmit={handlePlaceOrder} id="checkoutForm">
                            <div className="row">
                                <div className="form-group col-md-6 mb-3">
                                    <label className="text-white small">Họ và tên người nhận <span className="text-danger">*</span></label>
                                    <input type="text" name="customerName" className="form-control bg-dark text-white border-secondary" required
                                        value={formData.customerName} onChange={handleInputChange} />
                                </div>
                                <div className="form-group col-md-6 mb-3">
                                    <label className="text-white small">Số điện thoại <span className="text-danger">*</span></label>
                                    <input type="tel" name="phone" className="form-control bg-dark text-white border-secondary" required
                                        value={formData.phone} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group mb-3">
                                <label className="text-white small">Địa chỉ nhận hàng chi tiết <span className="text-danger">*</span></label>
                                <input type="text" name="address" className="form-control bg-dark text-white border-secondary" required
                                    placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP"
                                    value={formData.address} onChange={handleInputChange} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="text-white small">Ghi chú thêm cho shipper (Tùy chọn)</label>
                                <textarea name="note" className="form-control bg-dark text-white border-secondary" rows="3"
                                    value={formData.note} onChange={handleInputChange}></textarea>
                            </div>
                        </form>
                    </div>
                </div>

                {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
                <div className="col-lg-5">
                    <div className="glass-card p-4 sticky-top" style={{ top: '100px' }}>
                        <h5 className="font-weight-bold text-white border-bottom pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                            Tóm Tắt Đơn Hàng
                        </h5>

                        <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="mb-4 pr-2 custom-scrollbar">
                            {cartItems.map(item => (
                                <div key={item.id} className="d-flex justify-content-between mb-3 align-items-center">
                                    <div className="d-flex align-items-center" style={{ maxWidth: '70%' }}>
                                        <span className="badge badge-secondary mr-2">{item.quantity}x</span>
                                        <span className="text-muted text-truncate">{item.name}</span>
                                    </div>
                                    <span className="font-weight-bold text-white">
                                        {new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex justify-content-between mb-3 text-muted">
                            <span>Tạm tính:</span>
                            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4 text-muted border-bottom pb-4" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                            <span>Phí giao hàng:</span>
                            <span className="text-success">Miễn phí</span>
                        </div>

                        <div className="d-flex justify-content-between mb-4">
                            <span className="h5 text-white">Tổng thanh toán:</span>
                            <span className="h4 font-weight-bold text-neon">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}
                            </span>
                        </div>

                        <button
                            type="submit"
                            form="checkoutForm"
                            className="btn btn-cyber btn-block py-3 w-100 font-weight-bold"
                            disabled={isLoading}
                        >
                            {isLoading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;