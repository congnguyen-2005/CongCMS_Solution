import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();

                // 1. In ra Console ?? xem Backend th?c s? tr? v? hình thù gì
                console.log("D? li?u Posts g?c t? API:", data);

                // 2. Tách v? b?c (Unwrap) d? li?u y nh? ph?n S?n ph?m
                if (Array.isArray(data)) {
                    setPosts(data);
                }
                else if (data && data.$values) {
                    // X? lý v? b?c ch?ng vòng l?p c?a ASP.NET Core
                    setPosts(data.$values);
                }
                else if (data && data.data) {
                    // X? lý v? b?c chu?n RESTful chung
                    setPosts(data.data);
                }
                else {
                    console.warn("??nh d?ng d? li?u Posts không xác ??nh!");
                    setPosts([]);
                }

            } catch (error) {
                console.error("L?i khi t?i danh sách bài vi?t:", error);
                setPosts([]); // N?u l?i m?ng, gán m?ng r?ng ?? không s?p trang
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <div className="text-center my-4">?ang t?i tin t?c...</div>;

    return (
        <div className="mt-5">
            <h4 className="mb-4 text-uppercase text-secondary font-weight-bold border-bottom pb-2">
                <i className="fa-solid fa-newspaper text-info mr-2"></i> Xu h??ng th?i trang
            </h4>
            <div className="row">
                {posts.map((post) => (
                    <div className="col-12 mb-3" key={post.id}>
                        <div className="card shadow-sm border-light">
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold">{post.title}</h5>
                                <p className="card-text text-muted small">{post.shortDescription || '?ang c?p nh?t...'}</p>
                                <div className="d-flex justify-content-between text-secondary small">
                                    <span><i className="fa-regular fa-calendar mr-1"></i> {new Date(post.createdDate).toLocaleDateString('vi-VN')}</span>
                                    <span className="badge badge-info px-2 py-1">Xem thêm</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;