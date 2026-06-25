import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                                    <p className="card-text small text-muted">
                                        <i className="fa-solid fa-box-open mr-2"></i>Kho: {item.quantity || item.stockQuantity || item.stock || 0}
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
    );
};

export default ProductList;