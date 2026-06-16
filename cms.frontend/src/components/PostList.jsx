import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const PostList = () => {
    // Khai báo State chứa mảng bài viết lấy từ SQL Server
    const [posts, setPosts] = useState([]);
    // Khai báo State quản lý trạng thái chờ (Loading)
    const [loading, setLoading] = useState(true);

    // Sử dụng useEffect để kiểm soát vòng đời gọi dữ liệu
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();

                // CƠ CHẾ PHÒNG THỦ: Đảm bảo bóc tách đúng mảng dữ liệu JSON
                if (Array.isArray(data)) {
                    setPosts(data);
                } else if (data && data.$values) {
                    setPosts(data.$values);
                } else if (data && data.data) {
                    setPosts(data.data);
                } else {
                    setPosts([]);
                }
            } catch (error) {
                console.error("Quá trình kết nối API bài viết thất bại:", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []); // Mảng rỗng [] cực kỳ quan trọng: Đảm bảo API chỉ gọi 1 LẦN DUY NHẤT

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-info" role="status"></div>
                <p className="mt-2 text-muted">Đang kết nối Database lấy tin tức thời trang...</p>
            </div>
        );
    }

    return (
        <div className="card shadow-sm p-4 bg-white rounded">
            <h4 className="card-title text-uppercase font-weight-bold text-dark border-bottom pb-3 mb-4">
                <i className="fa-solid fa-newspaper mr-2 text-info"></i> Xu hướng & Bí quyết mặc đẹp
            </h4>

            {posts.length === 0 ? (
                <div className="alert alert-light text-center border">
                    <p className="text-muted m-0">Hiện tại chưa có bài viết xu hướng nào trong hệ thống.</p>
                </div>
            ) : (
                <div className="row">
                    {posts.map((item) => (
                        <div className="col-12 mb-4" key={item.id}>
                            <div className="card h-100 border-0 shadow-sm bg-light">
                                <div className="card-body">
                                    <h5 className="font-weight-bold">
                                        <a href={`/post/${item.id}`} className="text-dark text-decoration-none text-hover-primary">
                                            {item.title}
                                        </a>
                                    </h5>
                                    <p className="text-secondary small mt-2 card-text-truncate">
                                        {item.shortDescription || 'Nhấn để xem chi tiết bài viết chia sẻ về xu hướng phối đồ công sở...'}
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-light text-muted small">
                                        <span>
                                            <i className="fa-regular fa-calendar-days mr-1 text-secondary"></i>
                                            {new Date(item.createdDate).toLocaleDateString('vi-VN')}
                                        </span>
                                        <span className="badge badge-pill badge-info px-3 py-2 cursor-pointer">
                                            Đọc tiếp <i className="fa-solid fa-angle-right ml-1"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostList;