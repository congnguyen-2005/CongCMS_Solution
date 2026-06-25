import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || ''; // Lấy từ khóa từ thanh địa chỉ URL
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const BACKEND_URL = "https://localhost:7089";
    const defaultImage = "https://dummyimage.com/400x300/18181b/00f0ff.png&text=CameraClick";

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

    // THUẬT TOÁN LỌC CHỈ GIỮ LẠI SẢN PHẨM KHỚP TỪ KHÓA
    const filteredResults = products.filter((item) => {
        const keyword = query.toLowerCase();
        const matchName = item.name && item.name.toLowerCase().includes(keyword);
        const matchCategory = item.categoryName && item.categoryName.toLowerCase().includes(keyword);
        return matchName || matchCategory;
    });

    if (loading) return <div className="text-center my-5 py-5 text-neon h4">Đang rà soát dữ liệu kho hàng...</div>;

    return (
        <div className="container mt-5 pt-4 mb-5 pb-5">
            <div className="mb-5 border-bottom pb-3" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                <span className="text-muted d-block mb-1">KẾT QUẢ TÌM KIẾM THỜI GIAN THỰC</span>
                <h2 className="text-white font-weight-bold">
                    Có <span style={{ color: 'var(--neon-cyan)' }}>{filteredResults.length}</span> thiết bị khớp với từ khóa "<span className="text-info">{query}</span>"
                </h2>
            </div>

            <div className="row">
                {filteredResults.length === 0 ? (
                    <div className="col-12 text-center py-5 glass-card">
                        <i className="fa-regular fa-face-frown fa-4x text-muted mb-3"></i>
                        <h4 className="text-muted">Hệ thống không tìm thấy sản phẩm nào phù hợp.</h4>
                        <p className="text-muted small">Vui lòng thử lại với từ khóa khác (ví dụ: Sony, Canon, DSLR...)</p>
                        <button className="btn btn-cyber mt-3 px-4" onClick={() => navigate('/')}>Quay về Trang chủ</button>
                    </div>
                ) : (
                    filteredResults.map((item) => {
                        const finalImg = item.imageUrl && item.imageUrl.startsWith('http')
                            ? item.imageUrl
                            : (item.imageUrl ? `${BACKEND_URL}${item.imageUrl}` : defaultImage);

                        return (
                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4" key={item.id}> {/* Chia 3 cột nhìn cho thông thoáng */}
                                <div className="glass-card h-100 d-flex flex-column">
                                    <div className="product-img-wrapper cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                                        <img src={finalImg} alt={item.name} className="glass-product-img" />
                                    </div>
                                    <div className="card-body">
                                        <span className="badge badge-dark border border-secondary mb-2" style={{ opacity: 0.7 }}>
                                            {item.categoryName}
                                        </span>
                                        <h5 className="card-title font-weight-bold text-white mb-3 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h5>
                                        <p className="card-text text-neon font-weight-bold h5 mb-2">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                        </p>
                                    </div>
                                    <div className="card-footer bg-transparent border-top-0 pt-0 mt-auto">
                                        <button onClick={() => navigate(`/product/${item.id}`)} className="btn btn-cyber btn-block w-100">
                                            <i className="fa-solid fa-eye mr-2"></i> XEM CHI TIẾT
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SearchPage;