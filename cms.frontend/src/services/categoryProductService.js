import axiosClient from '../api/axiosClient';

const productService = {
    getAllProducts: () => {
        return axiosClient.get('/Products');
    },

    // 🌟 ĐÃ SỬA LẠI ĐƯỜNG DẪN CHO KHỚP VỚI BACKEND
    getCategories: () => {
        return axiosClient.get('/categoriesproducts');
    },

    getProductById: (id) => {
        return axiosClient.get(`/Products/${id}`);
    }
};

export default productService;