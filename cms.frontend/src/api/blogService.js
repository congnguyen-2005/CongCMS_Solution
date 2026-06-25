    import axiosClient from '../api/axiosClient';

    const blogService = {
        // 1. Hàm lấy danh sách toàn bộ bài viết (Post) từ Backend
        getAllPosts: () => {
            const url = '/Posts'; // Khớp chính xác với PostsController (Số nhiều)
            return axiosClient.get(url);
        },

        // 2. Hàm lấy danh mục bài viết
        getBlogCategories: () => {
            return axiosClient.get('/Categories');
        },

        // 3. Hàm lấy chi tiết 1 bài viết theo ID (Đã xóa bản trùng lặp)
        getPostById: (id) => {
            const url = `/Posts/${id}`; // Đồng bộ dùng số nhiều '/Posts/' giống hàm getAllPosts
            return axiosClient.get(url);
        },
       

        // 2. Lấy chi tiết 1 bài viết
       

        // 🌟 3. THÊM HÀM NÀY: Lấy bài viết theo Danh mục
        getPostsByCategory: (categoryId) => {
            return axiosClient.get(`/Posts/category/${categoryId}`);
        }
    };

    export default blogService;