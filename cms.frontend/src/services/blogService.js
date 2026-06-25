import axiosClient from '../api/axiosClient';

const blogService = {
    // Lấy danh mục
    getBlogCategories: () => axiosClient.get('/Categories'),

    // Lấy tất cả bài viết
    getAllPosts: () => axiosClient.get('/Posts'),

    // Lấy chi tiết bài viết theo id
    getPostById: (id) => axiosClient.get(`/Posts/${id}`)
};

export default blogService;