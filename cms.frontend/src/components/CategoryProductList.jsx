import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = () => {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                if (Array.isArray(data)) setCategoryProducts(data);
                else if (data && data.$values) setCategoryProducts(data.$values);
                else if (data && data.data) setCategoryProducts(data.data);
                else setCategoryProducts([]);
            } catch (error) {
                setCategoryProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, []);

    if (loading) return <div className="text-center my-4 text-neon">Đang quét dữ liệu...</div>;

    return (
        // ĐÃ ĐỔI: Dùng glass-card
        <div className="glass-card">
           
            <div className="card-body p-0 pb-3">
                <div className="list-group list-group-flush">
                    {categoryProducts.length === 0 ? (
                        <div className="p-4 text-center text-muted">Hệ thống trống.</div>
                    ) : (
                        categoryProducts.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                // ĐÃ ĐỔI: Dùng glass-list-item
                                className="list-group-item glass-list-item d-flex justify-content-between align-items-center px-4 py-3"
                                style={{ fontSize: '0.95rem' }}
                            >
                                <span className="font-weight-normal">{item.name}</span>
                                <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem', opacity: 0.5 }}></i>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryProductList;