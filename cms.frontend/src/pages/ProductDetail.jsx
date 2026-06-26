import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { CartContext } from '../contexts/CartContext';

const ProductDetailPage = () => {
    const { id } = useParams(); // Lấy ID sản phẩm từ URL
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1); // 🌟 State quản lý số lượng mua
    const [loading, setLoading] = useState(true);

    const BACKEND_URL = "https://localhost:7089";
    const defaultImage = "https://dummyimage.com/600x500/18181b/00f0ff.png&text=No+Image";

    useEffect(() => {
        // Cuộn lên đầu trang mỗi khi đổi sản phẩm
        window.scrollTo(0, 0);

        const fetchProductDetailAndRelated = async () => {
            try {
                setLoading(true);
                setQuantity(1); // Reset lại số lượng về 1 khi đổi sản phẩm

                // 1. Lấy chi tiết sản phẩm hiện tại
                const detailData = await productService.getProductById(id);
                setProduct(detailData);

                // 2. Lấy toàn bộ sản phẩm để lọc ra các sản phẩm liên quan (Cùng danh mục)
                const allProducts = await productService.getAllProducts();

                // Giải mã mảng sản phẩm tương thích với mọi kiểu JSON từ Backend
                let list = [];
                if (Array.isArray(allProducts)) list = allProducts;
                else if (allProducts?.$values) list = allProducts.$values;
                else if (allProducts?.data) list = allProducts.data;

                // Lọc: Cùng danh mục nhưng loại trừ chính nó ra khỏi danh sách gợi ý
                const filtered = list.filter(p =>
                    p.categoryName === detailData.categoryName && p.id !== detailData.id
                );

                // Chỉ lấy tối đa 4 sản phẩm liên quan để hiển thị cho đẹp giao diện
                setRelatedProducts(filtered.slice(0, 4));

            } catch (error) {
                console.error("Lỗi nạp chi tiết sản phẩm:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetailAndRelated();
    }, [id]); // 🌟 Render lại mỗi khi bấm vào sản phẩm liên quan (ID thay đổi)

    // Hàm xử lý tăng giảm số lượng
    const handleQuantityChange = (type) => {
        const maxStock = product.quantity || product.stockQuantity || product.stock || 0;
        if (type == 'minus' && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type == 'plus') {
            if (quantity >= maxStock) {
                alert(`⛔ Trong kho chỉ còn tối đa ${maxStock} sản phẩm!`);
            } else {
                setQuantity(quantity + 1);
            }
        }
    };

    // Hàm thêm vào giỏ hàng
    const handleAddToCart = () => {
        const maxStock = product.quantity || product.stockQuantity || product.stock || 0;
        if (maxStock <= 0) {
            alert("⛔ Sản phẩm đã hết hàng, không thể thêm vào giỏ!");
            return;
        }
        addToCart(product, quantity);
        alert(`🎉 Đã thêm thành công ${quantity} sản phẩm vào giỏ hàng!`);
    };

    if (loading) return <div className="text-center my-5 py-5 text-neon">Đang kết nối hệ thống dữ liệu C#...</div>;
    if (!product) return <div className="text-center my-5 py-5 text-danger font-weight-bold">⛔ Không tìm thấy sản phẩm yêu cầu!</div>;

    const mainImg = product.imageUrl && product.imageUrl.startsWith('http')
        ? product.imageUrl
        : (product.imageUrl ? `${BACKEND_URL}${product.imageUrl}` : defaultImage);

    const stock = product.quantity || product.stockQuantity || product.stock || 0;

    return (
        <div className="container mt-5 pt-4 mb-5 pb-5">
            {/* KHỐI 1: CHI TIẾT SẢN PHẨM CHÍNH */}
            <div className="glass-card p-5 shadow-lg mb-5">
                <div className="row">
                    {/* Ảnh sản phẩm bên trái */}
                    <div className="col-md-6 mb-4 mb-md-0 text-center">
                        <div className="p-2 border border-secondary rounded overflow-hidden" style={{ background: 'rgba(0,0,0,0.2)' }}>
                            <img src={mainImg} alt={product.name} className="img-fluid rounded shadow" style={{ maxHeight: '450px', objectFit: 'contain' }} />
                        </div>
                    </div>

                    {/* Thông tin sản phẩm bên phải */}
                    <div className="col-md-6 pl-md-5 d-flex flex-column">
                        {/* 🌟 1. HIỂN THỊ DANH MỤC */}
                        <span className="badge badge-info px-3 py-2 font-weight-bold align-self-start mb-3 border border-info" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
                            <i className="fa-solid fa-tags mr-2"></i> Danh mục: {product.categoryName || "Chưa phân loại"}
                        </span>

                        <h2 className="text-white font-weight-bold mb-3">{product.name}</h2>

                        <p className="text-neon font-weight-bold h3 mb-4">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </p>

                        <div className="mb-4 text-muted border-top border-bottom py-3" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                            <p className="mb-2 text-white"><i className="fa-solid fa-circle-info mr-2 text-info"></i> Mô tả ngắn về thiết bị cao cấp, hiệu năng cao phục vụ dự án.</p>
                            <span className={`font-weight-bold ${stock > 0 ? 'text-success' : 'text-danger'}`}>
                                <i className="fa-solid fa-box-open mr-2"></i> Trạng thái: {stock > 0 ? `Còn hàng (Kho: ${stock} chiếc)` : "Hết hàng"}
                            </span>
                        </div>

                        {/* 🌟 2. BỘ TĂNG GIẢM SỐ LƯỢNG MUA */}
                        {stock > 0 && (
                            <div className="d-flex align-items-center mb-5">
                                <span className="text-white small font-weight-bold mr-4 text-uppercase">Chọn số lượng:</span>
                                <div className="input-group" style={{ width: '130px' }}>
                                    <button className="btn btn-outline-secondary font-weight-bold px-3" type="button" onClick={() => handleQuantityChange('minus')}>-</button>
                                    <input type="text" className="form-control text-center bg-dark text-white font-weight-bold border-secondary" value={quantity} readOnly />
                                    <button className="btn btn-outline-secondary font-weight-bold px-3" type="button" onClick={() => handleQuantityChange('plus')}>+</button>
                                </div>
                            </div>
                        )}

                        {/* Nút hành động chính */}
                        <div className="mt-auto">
                            <button
                                onClick={handleAddToCart}
                                className={`btn ${stock > 0 ? 'btn-cyber' : 'btn-secondary disabled'} btn-block py-3 font-weight-bold`}
                                disabled={stock <= 0}
                                style={{ borderRadius: '8px', fontSize: '16px' }}
                            >
                                <i className="fa-solid fa-cart-plus mr-2"></i> {stock > 0 ? 'THÊM VÀO GIỎ HÀNG' : 'TẠM HẾT HÀNG'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🌟 3. KHỐI SẢN PHẨM LIÊN QUAN (RELATED PRODUCTS) */}
            <div className="mt-5">
                <h4 className="text-white font-weight-bold mb-4 position-relative d-inline-block pb-2">
                    <i className="fa-solid fa-wand-magic-sparkles text-neon mr-2"></i> THIẾT BỊ CÙNG DANH MỤC
                    <div className="position-absolute w-100" style={{ height: '2px', background: 'var(--neon-cyan)', bottom: 0, left: 0 }}></div>
                </h4>

                {relatedProducts.length === 0 ? (
                    <p className="text-muted font-italic">Không có sản phẩm nào khác trong danh mục này.</p>
                ) : (
                    <div className="row">
                        {relatedProducts.map((item) => {
                            const relImg = item.imageUrl && item.imageUrl.startsWith('http')
                                ? item.imageUrl
                                : (item.imageUrl ? `${BACKEND_URL}${item.imageUrl}` : defaultImage);

                            const relStock = item.quantity || item.stockQuantity || item.stock || 0;

                            return (
                                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4" key={item.id}>
                                    <div className="glass-card h-100 d-flex flex-column">
                                        <div className="product-img-wrapper cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                                            <img src={relImg} alt={item.name} className="glass-product-img" onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }} />
                                        </div>
                                        <div className="card-body">
                                            <h6 className="card-title font-weight-bold text-white mb-2 text-truncate cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h6>
                                            <p className="card-text text-neon font-weight-bold mb-2">
                                                {new Intl.NumberFormat('vi-VN').format(item.price)}đ
                                            </p>
                                        </div>

                                        {/* Áp dụng chuẩn nút đều tăm tắp vừa sửa xong */}
                                        <div className="card-footer bg-transparent border-top-0 pt-0 mt-auto d-flex" style={{ gap: '8px' }}>
                                            <button
                                                onClick={() => navigate(`/product/${item.id}`)}
                                                className="btn btn-outline-info d-flex justify-content-center align-items-center"
                                                style={{ flex: 1, borderRadius: '6px', padding: '8px 2px', fontSize: '12px', whiteSpace: 'nowrap', fontWeight: 'bold' }}
                                            >
                                                <i className="fa-solid fa-eye mr-1"></i> XEM
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (relStock <= 0) return alert("Hết hàng!");
                                                    addToCart(item, 1);
                                                    alert(`🎉 Đã thêm nhanh "${item.name}" vào giỏ!`);
                                                }}
                                                className={`btn ${relStock > 0 ? 'btn-cyber' : 'btn-secondary disabled'} d-flex justify-content-center align-items-center`}
                                                style={{ flex: 1, borderRadius: '6px', padding: '8px 2px', fontSize: '12px', whiteSpace: 'nowrap', fontWeight: 'bold' }}
                                                disabled={relStock <= 0}
                                            >
                                                <i className="fa-solid fa-cart-plus mr-1"></i> + GIỎ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;