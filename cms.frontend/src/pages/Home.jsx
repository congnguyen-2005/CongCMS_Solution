import React from 'react';
import BannerSlider from '../components/BannerSlider';
import CategoryProductList from '../components/CategoryProductList';
import ProductList from '../components/ProductList';
import PostList from '../components/PostList';
import HotProducts from '../components/HotProducts';

const Home = () => {
    return (
        <div>
            {/* 1. Khối Banner hoành tráng */}
            <BannerSlider />
            <HotProducts />
            <div className="container mb-5 mt-5 pb-5">
                {/* 2. Khối hiển thị tất cả sản phẩm và phân loại */}
                <div className="row mb-5">
                    <div className="col-md-20">
                        <h4 className="mb-4 text-uppercase font-weight-bold" style={{ color: 'var(--neon-cyan)', letterSpacing: '1px' }}>
                            Tất Cả Thiết Bị
                        </h4>
                        <ProductList /> {/* Hiện full sản phẩm tại đây */}
                    </div>
                </div>

                {/* 3. Khối tin công nghệ */}
                <div className="row mt-5 pt-5 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.1) !important' }}>
                    <div className="col-12">
                        <PostList />
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Home;