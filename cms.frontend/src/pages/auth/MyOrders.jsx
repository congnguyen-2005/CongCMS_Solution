import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import productService from '../../services/productService';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const formatVND = (number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number || 0);

    const getStatusLabel = (statusCode) => {
        const statuses = {
            0: { label: "Chờ duyệt", icon: "fa-hourglass-half", color: "text-warning" },
            1: { label: "Đang giao", icon: "fa-truck-fast", color: "text-info" },
            2: { label: "Hoàn thành", icon: "fa-check-circle", color: "text-success" },
            "-1": { label: "Đã hủy", icon: "fa-ban", color: "text-danger" }
        };
        const s = statuses[statusCode] || { label: "Không xác định", icon: "fa-question", color: "text-secondary" };
        return <span className={s.color}><i className={`fa-solid ${s.icon} mr-1`}></i> {s.label}</span>;
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user') || localStorage.getItem('customer');
        const currentUser = storedUser ? JSON.parse(storedUser) : null;

        if (!currentUser || !currentUser.id) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                // Gọi API
                const data = await productService.getOrdersByCustomer(currentUser.id);

                // Xử lý dữ liệu: data có thể là mảng trực tiếp hoặc nằm trong $values
                const ordersList = Array.isArray(data) ? data : (data?.$values || []);
                setOrders(ordersList);
            } catch (error) {
                console.error("Lỗi tải đơn hàng:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    if (loading) return <div className="container mt-5 pt-5 text-center text-neon h4">Đang tải đơn hàng...</div>;

    return (
        <div className="container mt-5 pt-4 mb-5">
            <h3 className="text-white mb-4"><i className="fa-solid fa-box-open mr-2"></i> ĐƠN HÀNG CỦA BẠN</h3>

            {orders.length === 0 ? (
                <div className="glass-card text-center py-5">
                    <h5>Bạn chưa có đơn hàng nào!</h5>
                    <Link to="/shop" className="btn btn-cyber mt-3">MUA SẮM NGAY</Link>
                </div>
            ) : (
                <div className="glass-card p-4 overflow-hidden">
                    <table className="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th>MÃ ĐƠN</th>
                                <th>NGÀY ĐẶT</th>
                                <th>CHI TIẾT SẢN PHẨM</th>
                                <th>TRẠNG THÁI</th>
                                <th className="text-right">TỔNG TIỀN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="align-middle">#{order.id}</td>
                                    <td className="align-middle">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>

                                    {/* 🌟 CỘT CHI TIẾT SẢN PHẨM */}
                                    <td className="align-middle">
                                        {order.orderDetails && order.orderDetails.length > 0 ? (
                                            <ul className="list-unstyled mb-0 small">
                                                {order.orderDetails.map((detail, idx) => (
                                                    <li key={idx}>
                                                        • {detail.product?.name || "Sản phẩm"} (x{detail.quantity})
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : "Không có chi tiết"}
                                    </td>

                                    <td className="align-middle">{getStatusLabel(order.status)}</td>
                                    <td className="align-middle text-right text-neon font-weight-bold">
                                        {formatVND(order.totalAmount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyOrders;