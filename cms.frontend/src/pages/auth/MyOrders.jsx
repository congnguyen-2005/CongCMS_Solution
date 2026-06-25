import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import productService from '../../services/productService';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Định dạng tiền tệ
    const formatVND = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number || 0);
    };

    // Hàm chuyển đổi mã Trạng thái thành Label đẹp mắt
    const getStatusLabel = (statusCode) => {
        switch (statusCode) {
            case 0: return <span className="badge badge-warning px-2 py-1"><i className="fa-solid fa-hourglass-half mr-1"></i> Chờ duyệt</span>;
            case 1: return <span className="badge badge-info px-2 py-1"><i className="fa-solid fa-truck-fast mr-1"></i> Đang giao hàng</span>;
            case 2: return <span className="badge badge-success px-2 py-1"><i className="fa-solid fa-check-circle mr-1"></i> Đã hoàn thành</span>;
            case -1: return <span className="badge badge-danger px-2 py-1"><i className="fa-solid fa-ban mr-1"></i> Đã hủy</span>;
            default: return <span className="badge badge-secondary px-2 py-1">Không xác định</span>;
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        // Kiểm tra xem User đã đăng nhập chưa (Lấy từ LocalStorage theo logic bạn đang dùng)
        const storedUser = localStorage.getItem('user') || localStorage.getItem('customer');
        const currentUser = storedUser ? JSON.parse(storedUser) : null;

        if (!currentUser) {
            alert("Vui lòng đăng nhập để xem lịch sử đơn hàng!");
            navigate('/login');
            return;
        }

        // Gọi API lấy đơn hàng
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await productService.getOrdersByCustomer(currentUser.id);

                // Xử lý mảng trả về (phòng trường hợp cấu trúc $values của .NET)
                let ordersList = [];
                if (Array.isArray(data)) ordersList = data;
                else if (data && data.$values) ordersList = data.$values;

                setOrders(ordersList);
            } catch (error) {
                console.error("Lỗi khi tải danh sách đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    if (loading) return <div className="container mt-5 pt-5 text-center text-neon h4">Đang tải dữ liệu đơn hàng...</div>;

    return (
        <div className="container mt-5 pt-4 mb-5">
            <h3 className="font-weight-bold mb-4 text-uppercase" style={{ color: 'var(--neon-cyan)', letterSpacing: '1px' }}>
                <i className="fa-solid fa-box-open mr-2"></i> Lịch Sử Đơn Hàng Của Bạn
            </h3>

            {orders.length === 0 ? (
                <div className="glass-card text-center py-5 shadow-lg">
                    <i className="fa-solid fa-receipt fa-4x text-muted mb-4"></i>
                    <h5 className="text-white mb-3">Bạn chưa có đơn hàng nào!</h5>
                    <p className="text-muted mb-4">Có vẻ như bạn chưa thực hiện giao dịch nào trên hệ thống. Hãy dạo quanh cửa hàng và chọn cho mình những thiết bị ưng ý nhé.</p>
                    <Link to="/shop" className="btn btn-cyber">
                        ĐẾN CỬA HÀNG NGAY <i className="fa-solid fa-arrow-right ml-1"></i>
                    </Link>
                </div>
            ) : (
                <div className="glass-card p-4 shadow-lg overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-dark table-hover mb-0" style={{ backgroundColor: 'transparent' }}>
                            <thead style={{ borderBottom: '2px solid var(--neon-cyan)' }}>
                                <tr>
                                    <th className="border-0 text-muted">MÃ ĐƠN</th>
                                    <th className="border-0 text-muted">NGÀY ĐẶT</th>
                                    <th className="border-0 text-muted text-center">TRẠNG THÁI</th>
                                    <th className="border-0 text-muted">GHI CHÚ</th>
                                    <th className="border-0 text-muted text-right">TỔNG TIỀN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td className="align-middle font-weight-bold text-white">
                                            #{order.id}
                                        </td>
                                        <td className="align-middle text-light">
                                            {new Date(order.orderDate).toLocaleString('vi-VN')}
                                        </td>
                                        <td className="align-middle text-center">
                                            {getStatusLabel(order.status)}
                                        </td>
                                        <td className="align-middle text-muted small" style={{ maxWidth: '200px' }}>
                                            {order.notes || <span className="font-italic">Không có ghi chú</span>}
                                        </td>
                                        <td className="align-middle text-right font-weight-bold text-neon" style={{ fontSize: '1.1rem' }}>
                                            {formatVND(order.totalAmount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;