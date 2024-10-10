import apiClient from "../components/AxiosClient/AxiosClient";

export const login = async (username, password) => {
    try {
        const response = await apiClient.post('/auth/login', {
            username,
            password
        });
        return await response.data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        console.log(userData)
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUsers = async () => {
    try {
        const response = await apiClient.get('/users/getAllUsers');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserProfile = async () => {
    try {
        const response = await apiClient.get('/users/currentProfile');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserProfile = async (userData) => {
    try {
        console.log(userData)
        const response = await apiClient.post('/users/editProfile', userData);
        console.log(response)
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUnactivated = async () => {
    try {
        const response = await apiClient.get('/users/getUnactivated');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verifyDeliver = async (userId) => {
    try {
        console.log(userId)
        const response = await apiClient.post(`/users/verifyUser?id=${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const denyDeliver = async (userId) => {
    try {
        console.log(userId)
        const response = await apiClient.post(`/users/rejectUser?id=${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};