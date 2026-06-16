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

                // 1. IN RA ?? B?T T?N TAY C?U TRÚC D? LI?U
                console.log("D? li?u g?c t? API:", data);

                // 2. X? LÝ PHÒNG TH? CHO M?I TR??NG H?P C?A .NET CORE
                if (Array.isArray(data)) {
                    // Tr??ng h?p API chu?n: Tr? th?ng m?ng [...]
                    setCategoryProducts(data);
                }
                else if (data && data.$values) {
                    // Tr??ng h?p .NET Core ch?ng vòng l?p: Tr? v? { $id, $values: [...] }
                    setCategoryProducts(data.$values);
                }
                else if (data && data.data) {
                    // Tr??ng h?p API t? b?c Wrapper: Tr? v? { success: true, data: [...] }
                    setCategoryProducts(data.data);
                }
                else {
                    // N?u t?t c? ??u sai, gán m?ng r?ng ?? không b? s?p trang
                    console.warn("??nh d?ng d? li?u không xác ??nh!");
                    setCategoryProducts([]);
                }

            } catch (error) {
                console.error("L?i khi t?i danh m?c s?n ph?m:", error);
                setCategoryProducts([]); // Gán m?ng r?ng n?u g?i API th?t b?i
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, []);

    if (loading) {
        return <div className="text-center my-4">?ang t?i danh m?c s?n ph?m...</div>;
    }

    return (
        <div className="card shadow-sm border-0 rounded-lg">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4">
                <h5 className="card-title text-uppercase font-weight-bold text-dark d-flex align-items-center mb-0" style={{ letterSpacing: '0.5px', fontSize: '1.1rem' }}>
                    <i className="fa-solid fa-cubes text-primary mr-2" style={{ fontSize: '1.3rem' }}></i> Danh m?c SP
                </h5>
            </div>
            <div className="card-body p-0">
                <div className="list-group list-group-flush">
                    {categoryProducts.length === 0 ? (
                        <div className="p-4 text-center text-muted">Không có danh m?c nào.</div>
                    ) : (
                        categoryProducts.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 transition-all"
                                style={{ fontSize: '0.95rem', color: '#495057' }}
                            >
                                <span className="font-weight-normal">{item.name}</span>
                                <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '0.8rem', opacity: 0.5 }}></i>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryProductList;