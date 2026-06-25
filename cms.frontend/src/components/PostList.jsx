import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 🌟 Import thêm useLocation
import blogService from '../services/blogService';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation(); // 🌟 Lắng nghe URL

    const BACKEND_URL = "https://localhost:7089";
    const defaultImage = "https://dummyimage.com/600x400/18181b/00f0ff.png&text=Tech+News";

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);

                // 🌟 Lấy categoryId từ URL (Ví dụ: /posts?categoryId=2)
                const queryParams = new URLSearchParams(location.search);
                const categoryId = queryParams.get('categoryId');

                let data;
                // Nếu có categoryId trên URL -> Gọi API lọc theo danh mục
                if (categoryId) {
                    data = await blogService.getPostsByCategory(categoryId);
                }
                // Nếu không có -> Gọi API lấy tất cả
                else {
                    data = await blogService.getAllPosts();
                }

                if (Array.isArray(data)) setPosts(data);
                else if (data && data.$values) setPosts(data.$values);
                else if (data && data.data) setPosts(data.data);
                else setPosts([]);
            } catch (error) {
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [location.search]); // 🌟 Hook chạy lại mỗi khi URL thay đổi (Khách click menu Header)

    if (loading) return <div className="text-center my-5 text-neon h5">Đang tải tin công nghệ...</div>;

    return (
        <div>
            <h4 className="text-uppercase font-weight-bold mb-4" style={{ color: 'var(--neon-cyan)', letterSpacing: '1px' }}>
                Tin tức & Đánh giá
            </h4>

            {posts.length === 0 ? (
                <div className="p-5 text-center text-muted glass-card">
                    <i className="fa-regular fa-newspaper fa-3x mb-3"></i>
                    <h5>Chưa có bài viết nào trong danh mục này.</h5>
                </div>
            ) : (
                <div className="row">
                    {posts.map((item) => {
                        const finalImg = item.imageUrl && item.imageUrl.startsWith('http')
                            ? item.imageUrl
                            : (item.imageUrl ? `${BACKEND_URL}${item.imageUrl}` : defaultImage);

                        // Lọc bỏ HTML cho phần mô tả ngắn
                        const cleanDescription = item.shortDescription
                            ? item.shortDescription.replace(/<[^>]+>/g, '')
                            : 'Cập nhật các thông tin công nghệ, đánh giá thiết bị nhiếp ảnh mới nhất thị trường...';

                        return (
                            <div className="col-md-4 mb-4" key={item.id}>
                                <div className="glass-card h-100 p-0 d-flex flex-column overflow-hidden product-card-hover">
                                    <div
                                        onClick={() => navigate(`/post/${item.id}`)}
                                        className="d-block cursor-pointer"
                                        style={{ height: '220px', overflow: 'hidden' }}
                                    >
                                        <img
                                            src={finalImg}
                                            alt={item.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
                                        />
                                    </div>

                                    <div className="p-4 d-flex flex-column flex-grow-1">
                                        <span className="badge badge-cyber align-self-start mb-2">{item.categoryName}</span>
                                        <h5 className="font-weight-bold mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            <span
                                                onClick={() => navigate(`/post/${item.id}`)}
                                                className="text-white text-decoration-none cursor-pointer"
                                                style={{ transition: 'color 0.3s' }}
                                                onMouseOver={e => e.target.style.color = 'var(--neon-cyan)'}
                                                onMouseOut={e => e.target.style.color = 'white'}
                                            >
                                                {item.title}
                                            </span>
                                        </h5>

                                        <p className="text-muted small mb-4 flex-grow-1" style={{ lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {cleanDescription}
                                        </p>

                                        <div className="d-flex justify-content-between align-items-center mt-auto border-top pt-3" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                                            <span className="small text-muted">
                                                <i className="fa-regular fa-clock mr-1"></i>
                                                {new Date(item.createdDate).toLocaleDateString('vi-VN')}
                                            </span>
                                            <span
                                                className="small font-weight-bold text-neon cursor-pointer"
                                                onClick={() => navigate(`/post/${item.id}`)}
                                                style={{ letterSpacing: '1px' }}
                                            >
                                                ĐỌC TIẾP <i className="fa-solid fa-arrow-right ml-1"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PostList;