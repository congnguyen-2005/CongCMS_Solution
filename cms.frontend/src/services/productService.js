import axiosClient from '../api/axiosClient';

const productService = {
    getAllProducts: () => {
        const url = '/Products';
        return axiosClient.get(url);
    },
    getCategories: () => {
        return axiosClient.get('/Categories');
    },
    getProductById: (id) => {
        return axiosClient.get(`/Products/${id}`);
    },
    getOrdersByCustomer: async (customerId) => {
        try {
            const response = await axiosClient.get(`/Orders/customer/${customerId}`);
            return response.data || response;
        } catch (error) {
            console.error("Lỗi lấy lịch sử đơn hàng:", error);
            throw error;
        }
    }
};

export default productService;