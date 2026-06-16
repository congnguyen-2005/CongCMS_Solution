import axiosClient from '../api/axiosClient';

const productService = {
    getAllProducts: () => {
        const url = '/Products';
        return axiosClient.get(url);
    }
};

export default productService;