import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { CartContext } from '../contexts/CartContext'; // 🌟 Import CartContext

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 🌟 Lấy hàm thêm vào giỏ hàng từ Context
    const { addToCart } = useContext(CartContext);

    const BACKEND_URL = "https://localhost:7089";
    const defaultImage = "https://dummyimage.com/400x300/18181b/00f0ff.png&text=CameraClick+Product";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                if (Array.isArray(data)) setProducts(data);
                else if (data && data.$values) setProducts(data.$values);
                else if (data && data.data) setProducts(data.data);
                else setProducts([]);
            } catch (error) {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Hàm xử lý thêm giỏ hàng nhanh
    const handleQuickAddToCart = (e, item) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài thẻ card

        const maxStock = item.quantity || item.stockQuantity || item.stock || 0;

        if (maxStock <= 0) {
            alert(`⛔ Rất tiếc, ${item.name} hiện đang tạm hết hàng!`);
            return;
        }

        // Gọi hàm thêm vào giỏ với số lượng mặc định là 1
        addToCart(item, 1);
        alert(`🎉 Đã thêm thành công 1 sản phẩm "${item.name}" vào giỏ hàng!`);
    };

    if (loading) return <div className="text-center my-4 text-neon">Đang tải thiết bị...</div>;

    return (
        <div className="row">
            {products.length === 0 ? (
                <div className="col-12"><p className="text-muted">Chưa có sản phẩm nào.</p></div>
            ) : (
                products.map((item) => {
                    const finalImg = item.imageUrl && item.imageUrl.startsWith('http')
                        ? item.imageUrl
                        : (item.imageUrl ? `${BACKEND_URL}${item.imageUrl}` : defaultImage);

                    const maxStock = item.quantity || item.stockQuantity || item.stock || 0;

                    return (
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4" key={item.id}>
                            <div className="glass-card h-100 d-flex flex-column">
                                <div className="product-img-wrapper cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                                    <img src={finalImg} alt={item.name} className="glass-product-img" onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }} />
                                </div>
                                <div className="card-body">
                                    <span className="badge badge-dark border border-secondary mb-2" style={{ opacity: 0.7 }}>
                                        {item.categoryName}
                                    </span>
                                    <h5 className="card-title font-weight-bold text-white mb-3 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h5>
                                    <p className="card-text text-neon font-weight-bold h5 mb-2">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                    </p>
                                    <p className={`card-text small font-weight-bold ${maxStock > 0 ? 'text-muted' : 'text-danger'}`}>
                                        <i className="fa-solid fa-box-open mr-2"></i>Kho: {maxStock} {maxStock === 0 && "(Hết hàng)"}
                                    </p>
                                </div>

                                {/* 🌟 ĐÃ CẬP NHẬT GIAO DIỆN CHIA 2 NÚT BẤM */}
                                {/* 🌟 ĐÃ CẬP NHẬT GIAO DIỆN CHIA 2 NÚT BẤM ĐỀU TĂP TẮP */}
                                <div className="card-footer bg-transparent border-top-0 pt-0 mt-auto d-flex" style={{ gap: '10px' }}>
                                    <button
                                        onClick={() => navigate(`/product/${item.id}`)}
                                        className="btn btn-outline-info d-flex justify-content-center align-items-center"
                                        style={{ flex: 1, borderRadius: '8px', padding: '10px 5px', fontSize: '14px', whiteSpace: 'nowrap', textTransform: 'uppercase', fontWeight: 'bold' }}
                                        title="Xem chi tiết sản phẩm"
                                    >
                                        <i className="fa-solid fa-eye mr-2"></i> CHI TIẾT
                                    </button>

                                    <button
                                        onClick={(e) => handleQuickAddToCart(e, item)}
                                        className={`btn ${maxStock > 0 ? 'btn-cyber' : 'btn-secondary disabled'} d-flex justify-content-center align-items-center`}
                                        style={{ flex: 1, borderRadius: '8px', padding: '10px 5px', fontSize: '14px', whiteSpace: 'nowrap', textTransform: 'uppercase', fontWeight: 'bold' }}
                                        disabled={maxStock <= 0}
                                        title={maxStock > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
                                    >
                                        <i className="fa-solid fa-cart-plus mr-2"></i> THÊM GIỎ
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ProductList;