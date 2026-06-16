import axiosClient from '../api/axiosClient';

const blogService = {
    getBlogCategories: () => axiosClient.get('/Categories'),
    getAllPosts: () => axiosClient.get('/Posts')
};

export default blogService;