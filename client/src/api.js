import axios from "axios";

const API_URL = "http://localhost:5000/api/grocery";

export const getGroceries = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addGroceryItem = async (item) => {
    const response = await axios.post(API_URL, item);
    return response.data;
};

export const markAsPurchased = async (id) => {
    const response = await axios.patch(`${API_URL}/${id}`);
    return response.data;
};
