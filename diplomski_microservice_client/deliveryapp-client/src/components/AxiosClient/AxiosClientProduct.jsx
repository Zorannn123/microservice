import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL_PRODUCT;

// Create an Axios instance
const apiClientProduct = axios.create({
    baseURL: `${API_BASE_URL}`, // Replace with your API base URL
});

// Request interceptor
apiClientProduct.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = localStorage.getItem('authToken');

        // If token exists, add it to the request headers
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClientProduct.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Check if the error is due to a 401 Unauthorized response
        if (error.response && error.response.status === 401) {
            // Remove token from localStorage
            localStorage.removeItem('authToken');

            // Reload the page
            window.location.reload();
        }

        return Promise.reject(error);
    }
);

export default apiClientProduct;