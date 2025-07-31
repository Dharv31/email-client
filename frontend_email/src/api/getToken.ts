import api from './api';

export const getToken = async () => {
    try {
        const response = await api.get(`/api/getToken`);
        return response.data;
    } catch (error) {
        console.error("Error fetching token:", error);
        throw error;
    }
};