import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { CartContext } from '../contexts/CartContext';
const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);
    const BACKEND_URL = "https://localhost:7089";
    const defaultImage = "https://dummyimage.com/600x450/18181b/00f0ff.png&text=CameraClick";

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi lấy chi tiết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);
    const handleAddToCart = () => {
        addToCart(product, 1);
        alert("Đã thêm thiết bị vào giỏ hàng!"); // Báo hiệu nhỏ cho người dùng
    };
    if (loading) return <div className="text-center my-5 py-5 text-neon h4">Đang phân tích thông số thiết bị...</div>;
    if (!product) return <div className="text-center my-5 py-5 text-muted">Thiết bị không tồn tại trong hệ thống.</div>;

    const finalImg = product.imageUrl && product.imageUrl.startsWith('http')
        ? product.imageUrl
        : (product.imageUrl ? `${BACKEND_URL}${product.imageUrl}` : defaultImage);

    return (
        <div className="container mt-5 pt-4 mb-5">
            <button className="btn btn-cyber mb-4" onClick={() => navigate(-1)} style={{ border: 'none' }}>
                <i className="fa-solid fa-arrow-left mr-2"></i> Trở về
            </button>

            <div className="row glass-card p-4 mx-0">
                <div className="col-md-6 mb-4 mb-md-0 text-center">
                    <img src={finalImg} alt={product.name} className="img-fluid rounded shadow-lg" style={{ border: '1px solid rgba(0, 240, 255, 0.2)', maxHeight: '500px', objectFit: 'contain' }} />
                </div>
                <div className="col-md-6 d-flex flex-column justify-content-center pl-md-5">
                    <span className="badge badge-dark border border-secondary mb-3 w-25 text-center p-2" style={{ fontSize: '0.9rem' }}>
                        {product.categoryName}
                    </span>
                    <h2 className="font-weight-bold text-white mb-3" style={{ fontSize: '2.5rem' }}>{product.name}</h2>
                    <h3 className="text-neon font-weight-bold mb-4" style={{ fontSize: '2rem' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </h3>

                    <p className="text-muted mb-4" style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
                        {product.description || "Thiết bị nhiếp ảnh cao cấp được phân phối chính hãng tại hệ thống CameraClick. Mang lại trải nghiệm khung hình sắc nét và sống động nhất."}
                    </p>

                    <div className="d-flex align-items-center mb-5 p-3 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <i className="fa-solid fa-box-open fa-2x mr-3 text-muted"></i>
                        <div>
                            <span className="text-muted d-block small mb-1">Tình trạng kho hàng</span>
                            <span className="text-white font-weight-bold" style={{ fontSize: '1.1rem' }}>
                                {product.stockQuantity > 0 ? `Sẵn sàng giao (${product.stockQuantity} bộ)` : 'Tạm hết hàng'}
                            </span>
                        </div>
                    </div>

                    {/* 🌟 Gắn sự kiện onClick vào nút */}
                    <button
                        className="btn btn-cyber py-3 mt-4"
                        style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                        disabled={product.stockQuantity <= 0}
                        onClick={handleAddToCart}
                    >
                        <i className="fa-solid fa-cart-plus mr-2"></i>
                        {product.stockQuantity > 0 ? 'THÊM VÀO GIỎ HÀNG NGAY' : 'Liên hệ đặt hàng'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;