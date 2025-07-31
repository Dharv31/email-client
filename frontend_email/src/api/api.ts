import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000',
    withCredentials: true, // for cookies
});

export const loginWithMicrosoft = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;
};



export default api;
