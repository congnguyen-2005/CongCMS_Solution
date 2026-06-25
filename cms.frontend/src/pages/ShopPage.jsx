import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';

const ShopPage = () => {
    const navigate = useNavigate();

    // State lưu dữ liệu gốc
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // State dùng cho Bộ lọc
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL'); // 'ALL' là tất cả
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });

    const BACKEND_URL = "https://localhost:7089";
    const defaultImage = "https://dummyimage.com/600x600/18181b/00f0ff.png&text=Camera";

    // 1. GỌI API LẤY TOÀN BỘ SẢN PHẨM 1 LẦN DUY NHẤT
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                let productList = [];

                if (Array.isArray(data)) productList = data;
                else if (data && data.$values) productList = data.$values;

                setAllProducts(productList);
                setFilteredProducts(productList);

                // Tự động trích xuất các Danh mục có trong danh sách sản phẩm
                const uniqueCats = [];
                productList.forEach(p => {
                    if (p.categoryId && !uniqueCats.find(c => c.id === p.categoryId)) {
                        uniqueCats.push({ id: p.categoryId, name: p.categoryName || 'Chưa phân loại' });
                    }
                });
                setCategories(uniqueCats);

            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. LOGIC LỌC SẢN PHẨM (Chạy mỗi khi user gõ phím, chọn giá, chọn danh mục)
    useEffect(() => {
        let result = allProducts;

        // Lọc theo Tên
        if (searchTerm.trim() !== '') {
            result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Lọc theo Danh mục
        if (selectedCategory !== 'ALL') {
            result = result.filter(p => p.categoryId === selectedCategory);
        }

        // Lọc theo Giá
        result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

        setFilteredProducts(result);
    }, [searchTerm, selectedCategory, priceRange, allProducts]);

    if (loading) return <div className="container mt-5 pt-5 text-center text-neon h4">Đang tải cửa hàng...</div>;

    return (
        <div className="container mt-5 pt-4 mb-5 pb-5">
            <h2 className="font-weight-bold text-white mb-4 text-uppercase" style={{ letterSpacing: '2px' }}>
                <i className="fa-solid fa-store mr-2 text-neon"></i> Khám Phá Thiết Bị
            </h2>

            <div className="row">
                {/* CỘT TRÁI: BỘ LỌC (SIDEBAR) */}
                <div className="col-lg-3 mb-4">
                    <div className="glass-card p-4 sticky-top" style={{ top: '90px' }}>
                        <h5 className="text-white font-weight-bold mb-4 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                            <i className="fa-solid fa-filter mr-2"></i> BỘ LỌC
                        </h5>

                        {/* Lọc theo tên */}
                        <div className="mb-4">
                            <label className="text-muted small font-weight-bold">TÌM KIẾM TÊN</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="Nhập tên thiết bị..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Lọc theo Danh mục (Có thể Click) */}
                        <div className="mb-4">
                            <label className="text-muted small font-weight-bold mb-2">DANH MỤC SẢN PHẨM</label>
                            <div className="d-flex flex-column gap-2">
                                <button
                                    className={`btn btn-sm text-left ${selectedCategory === 'ALL' ? 'btn-cyber' : 'btn-outline-secondary text-white'}`}
                                    onClick={() => setSelectedCategory('ALL')}
                                    style={{ marginBottom: '8px' }}
                                >
                                    Tất cả thiết bị
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`btn btn-sm text-left ${selectedCategory === cat.id ? 'btn-cyber' : 'btn-outline-secondary text-white'}`}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        style={{ marginBottom: '8px' }}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Lọc theo khoảng giá */}
                        <div className="mb-4">
                            <label className="text-muted small font-weight-bold">KHOẢNG GIÁ</label>
                            <div className="d-flex align-items-center mb-2">
                                <input
                                    type="number"
                                    className="form-control bg-dark text-white border-secondary form-control-sm mr-2"
                                    placeholder="Từ..."
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                                />
                                <span className="text-muted">-</span>
                                <input
                                    type="number"
                                    className="form-control bg-dark text-white border-secondary form-control-sm ml-2"
                                    placeholder="Đến..."
                                    value={priceRange.max === 100000000 ? '' : priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 100000000 })}
                                />
                            </div>
                        </div>

                        {/* Nút reset bộ lọc */}
                        <button
                            className="btn btn-sm btn-outline-danger w-100 mt-2"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('ALL');
                                setPriceRange({ min: 0, max: 100000000 });
                            }}
                        >
                            <i className="fa-solid fa-rotate-right mr-1"></i> Đặt lại bộ lọc
                        </button>
                    </div>
                </div>

                {/* CỘT PHẢI: LƯỚI SẢN PHẨM */}
                <div className="col-lg-9">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <span className="text-muted">
                            Hiển thị <strong className="text-white">{filteredProducts.length}</strong> kết quả phù hợp
                        </span>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="glass-card p-5 text-center">
                            <i className="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
                            <h5 className="text-white">Không tìm thấy sản phẩm nào!</h5>
                            <p className="text-muted">Vui lòng thử thay đổi điều kiện lọc.</p>
                        </div>
                    ) : (
                        <div className="row">
                            {filteredProducts.map(item => {
                                const finalImg = item.imageUrl && item.imageUrl.startsWith('http')
                                    ? item.imageUrl
                                    : (item.imageUrl ? `${BACKEND_URL}${item.imageUrl}` : defaultImage);

                                return (
                                    <div className="col-md-4 col-sm-6 mb-4" key={item.id}>
                                        <div className="glass-card h-100 p-0 overflow-hidden d-flex flex-column product-card-hover">
                                            <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                                {/* Badge Tình trạng kho */}
                                                <span className={`badge ${item.stockQuantity > 0 ? 'badge-success' : 'badge-danger'} position-absolute`} style={{ top: '10px', right: '10px', zIndex: 1 }}>
                                                    {item.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                                                </span>

                                                <img src={finalImg} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>

                                            <div className="p-3 d-flex flex-column flex-grow-1">
                                                <span className="badge badge-dark text-muted mb-2 align-self-start">{item.categoryName}</span>
                                                <h6 className="font-weight-bold text-white text-truncate" title={item.name}>
                                                    {item.name}
                                                </h6>
                                                <div className="mt-auto pt-3 d-flex justify-content-between align-items-center border-top" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                                                    <span className="font-weight-bold text-neon" style={{ fontSize: '1.1rem' }}>
                                                        {new Intl.NumberFormat('vi-VN').format(item.price)}đ
                                                    </span>
                                                    <button
                                                        className="btn btn-sm btn-outline-cyber text-white border-white"
                                                        onClick={() => navigate(`/product/${item.id}`)}
                                                    >
                                                        Chi tiết
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopPage;