import apiClientOrder from "../components/AxiosClient/AxiosClientOrder";

export const addOrder = async (orderData) => {
    try {
        const response = await apiClientOrder.post('/order/AddOrder', orderData);
        return response.data
    } catch (error) {
        throw error;
    }
};

export const getUndelivered = async () => {
    try {
        const response = await apiClientOrder.get('/order/Undelivered');
        return response.data
    } catch (error) {
        throw error;
    }
};

export const takeOrder = async (orderId) => {
    try {
        console.log(orderId)
        const response = await apiClientOrder.post(`/order/TakeOrder?orderId=${orderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCurrentOrder = async () => {
    try {
        const response = await apiClientOrder.get(`/order/currentOrder`);
        console.log(response)
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getOrderHistoryDeliverer = async () => {
    try {
        const response = await apiClientOrder.get(`/order/historyDeliverer`);
        console.log(response)
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getOrderHistoryUser = async () => {
    try {
        const response = await apiClientOrder.get(`/order/history`);
        console.log(response)
        return response.data;
    } catch (error) {
        throw error;
    }
};