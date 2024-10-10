import apiClientProduct from "../components/AxiosClient/AxiosClientProduct";

export const AddNewProduct = async (productData) => {
    try {
        const response = await apiClientProduct.post('/products/addProduct', productData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetAllProducts = async () => {
    try {
        const response = await apiClientProduct.get('/products/getAll');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteProduct = async (id) => {
    try {
        const response = await apiClientProduct.delete(`/products/deleteProduct/${id}`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

export const GetProductPrice = async (productId) => {
    try {
        const response = await apiClientProduct.get(`/products/getPrice/${productId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch price for product ${productId}:`, error);
        throw error;
    }
}
