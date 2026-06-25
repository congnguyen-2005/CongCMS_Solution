import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import blogService from '../services/blogService';

const PostDetail = () => {
    const { id } = useParams(); // Lấy ID bài viết từ URL
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [otherPosts, setOtherPosts] = useState([]); // 🌟 State lưu các bài viết khác
    const [loading, setLoading] = useState(true);

    const BACKEND_URL = "https://localhost:7089";
    const defaultImage = "https://dummyimage.com/1200x500/18181b/00f0ff.png&text=Tech+News";

    useEffect(() => {
        // 🌟 Tự động cuộn lên đầu trang mỗi khi chuyển sang bài viết mới
        window.scrollTo(0, 0);

        const fetchData = async () => {
            try {
                setLoading(true);

                // 🌟 Gọi song song 2 API: Lấy bài chi tiết và Lấy tất cả bài viết
                const [currentPostData, allPostsData] = await Promise.all([
                    blogService.getPostById(id),
                    blogService.getAllPosts()
                ]);

                setPost(currentPostData);

                // Xử lý mảng bài viết khác
                let allPostsList = [];
                if (Array.isArray(allPostsData)) allPostsList = allPostsData;
                else if (allPostsData && allPostsData.$values) allPostsList = allPostsData.$values;
                else if (allPostsData && allPostsData.data) allPostsList = allPostsData.data;

                // 🌟 Lọc bỏ bài viết hiện tại và chỉ lấy 3 bài viết mới nhất
                const filteredPosts = allPostsList
                    .filter(p => p.id.toString() !== id.toString())
                    .slice(0, 3);

                setOtherPosts(filteredPosts);

            } catch (error) {
                console.error("Lỗi lấy chi tiết bài viết:", error);
                setPost(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]); // 🌟 Hook sẽ chạy lại mỗi khi ID trên URL thay đổi

    if (loading) return <div className="container mt-5 pt-5 text-center text-neon h4">Đang tải nội dung...</div>;

    if (!post) return (
        <div className="container mt-5 pt-5 text-center">
            <h4 className="text-white mb-3">Không tìm thấy bài viết!</h4>
            <button className="btn btn-cyber" onClick={() => navigate('/')}>Quay về Trang chủ</button>
        </div>
    );

    // Xử lý ảnh bìa
    const finalImg = post.imageUrl && post.imageUrl.startsWith('http')
        ? post.imageUrl
        : (post.imageUrl ? `${BACKEND_URL}${post.imageUrl}` : defaultImage);

    // Xử lý nội dung
    const postContent = post.content || post.description || "<p>Nội dung đang được cập nhật...</p>";

    return (
        <div className="container mt-5 pt-4 mb-5 pb-5">
            <div className="row justify-content-center">
                <div className="col-lg-9">

                    {/* Nút quay lại */}
                    <button className="btn btn-outline-secondary mb-4 text-white border-secondary" onClick={() => navigate(-1)}>
                        <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại
                    </button>

                    {/* NỘI DUNG BÀI VIẾT CHÍNH */}
                    <div className="glass-card p-4 p-md-5 shadow-lg bg-dark mb-5">
                        <h1 className="font-weight-bold mb-3" style={{ color: 'var(--neon-cyan)', lineHeight: '1.4' }}>
                            {post.title}
                        </h1>
                        <div className="text-muted mb-4 pb-3 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                            <i className="fa-regular fa-clock mr-2"></i> Đăng ngày: {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                        </div>

                        <div className="mb-5 text-center" style={{ overflow: 'hidden', borderRadius: '12px' }}>
                            <img
                                src={finalImg}
                                alt={post.title}
                                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                            />
                        </div>

                        <div
                            className="post-content-wrapper text-white"
                            style={{ lineHeight: '1.8', fontSize: '1.1rem' }}
                            dangerouslySetInnerHTML={{ __html: postContent }}
                        />
                    </div>

                    {/* 🌟 KHU VỰC BÀI VIẾT KHÁC (RELATED POSTS) */}
                    {otherPosts.length > 0 && (
                        <div className="mt-5">
                            <h4 className="font-weight-bold mb-4 text-uppercase border-left pl-3" style={{ color: 'var(--neon-cyan)', letterSpacing: '1px', borderColor: 'var(--neon-cyan) !important', borderWidth: '4px !important' }}>
                                Có thể bạn sẽ thích
                            </h4>
                            <div className="row">
                                {otherPosts.map(item => {
                                    const relatedImg = item.imageUrl && item.imageUrl.startsWith('http')
                                        ? item.imageUrl
                                        : (item.imageUrl ? `${BACKEND_URL}${item.imageUrl}` : defaultImage);

                                    return (
                                        <div className="col-md-4 mb-4" key={item.id}>
                                            <div
                                                className="glass-card h-100 p-0 overflow-hidden d-flex flex-column product-card-hover"
                                                onClick={() => navigate(`/post/${item.id}`)}
                                                style={{ cursor: 'pointer', transition: 'transform 0.3s', backgroundColor: 'rgba(24, 24, 27, 0.8)' }}
                                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                                            >
                                                {/* Ảnh thu nhỏ */}
                                                <div style={{ height: '160px', overflow: 'hidden' }}>
                                                    <img src={relatedImg} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                                {/* Nội dung thu nhỏ */}
                                                <div className="p-3 d-flex flex-column flex-grow-1">
                                                    <h6 className="font-weight-bold text-white mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                                                        {item.title}
                                                    </h6>
                                                    <div className="mt-auto pt-2 border-top small text-muted d-flex justify-content-between align-items-center" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                                                        <span><i className="fa-regular fa-clock mr-1"></i> {new Date(item.createdDate).toLocaleDateString('vi-VN')}</span>
                                                        <span className="text-neon"><i className="fa-solid fa-arrow-right"></i></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default PostDetail;