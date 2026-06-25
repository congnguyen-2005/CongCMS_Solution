import axiosClient from '../api/axiosClient';

const layoutService = {
    // G?i API l?y danh sách Menu ?i?u h??ng
    getMenus: () => {
        const url = '/Menus'; // Kh?p v?i MenusController ? Backend
        return axiosClient.get(url);
    },

    // G?i API l?y danh sách Banner qu?ng cáo
    getBanners: () => {
        const url = '/Banners'; // Kh?p v?i BannersController ? Backend
        return axiosClient.get(url);
    }
};

export default layoutService;