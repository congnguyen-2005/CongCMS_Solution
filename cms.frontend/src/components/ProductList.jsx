import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();

                // CƠ CHẾ PHÒNG THỦ: Đảm bảo lấy đúng mảng dữ liệu (tránh lỗi .map is not a function)
                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (data && data.$values) {
                    setProducts(data.$values);
                } else if (data && data.data) {
                    setProducts(data.data);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Lỗi:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="text-center my-4 text-primary">Đang tải dữ liệu sản phẩm...</div>;

    return (
        <div className="row">
            {products.length === 0 ? (
                <div className="col-12"><p className="text-muted">Chưa có sản phẩm nào.</p></div>
            ) : (
                products.map((item) => (
                    <div className="col-md-6 mb-4" key={item.id}>
                        <div className="card h-100 shadow-sm border">
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold">{item.name}</h5>

                                <p className="card-text text-danger font-weight-bold mb-1">
                                    Giá bán: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                </p>

                                {/* 🌟 CHÚ Ý CHỖ NÀY: Hãy thay item.quantity bằng đúng tên cột của bạn nếu cần */}
                                <p className="card-text small text-muted">
                                    Tồn kho: {item.quantity || item.stock || item.soLuong || 0} sản phẩm
                                </p>
                            </div>
                            <div className="card-footer bg-transparent border-top-0 pt-0">
                                <button className="btn btn-outline-primary btn-sm btn-block">
                                    <i className="fa-solid fa-cart-plus mr-1"></i> Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductList;