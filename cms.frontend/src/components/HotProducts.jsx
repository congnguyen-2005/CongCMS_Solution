import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const BACKEND_URL = "https://localhost:7089";

const HotProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {

        axios.get(`${BACKEND_URL}/api/Products/hot-products`)
            .then(res => {
                // Kiểm tra cấu trúc dữ liệu trả về từ ASP.NET Core
                const data = res.data;

                // Xử lý dữ liệu: 
                // 1. Nếu là mảng trực tiếp -> dùng luôn
                // 2. Nếu có $values (do cấu hình ReferenceHandler.Preserve) -> lấy từ $values
                // 3. Nếu không có gì -> gán mảng rỗng
                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (data && data.$values) {
                    setProducts(data.$values);
                } else {
                    setProducts([]);
                }
            })
            .catch(err => {
                console.error("Lỗi tải SP bán chạy:", err);
                setProducts([]); // Đảm bảo UI không bị treo nếu gọi API thất bại
            });
    }, []);

    if (products.length === 0) return null;

    return (
        <div className="container my-5">
            <h4 className="mb-4 text-uppercase font-weight-bold" style={{ color: 'var(--neon-cyan)' }}>
                🔥 Sản phẩm bán chạy
            </h4>
            <div className="row">
                {products.map(product => (
                    <div key={product.id} className="col-md-4 mb-4">
                        <div className="product-card">
                            <img
                                src={
                                    product.imageUrl
                                        ? `${BACKEND_URL}${product.imageUrl}`
                                        : "/images/no-image.png"
                                }
                                alt={product.name}
                                className="img-fluid"
                            />
                            <h5 className="mt-2">{product.name}</h5>
                            <p className="text-primary">{product.price.toLocaleString()} VNĐ</p>
                            <Link to={`/product/details/${product.id}`} className="btn btn-outline-info">Chi tiết</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotProducts;