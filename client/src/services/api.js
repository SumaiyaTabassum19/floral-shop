const API_URL = "http://localhost:5000/api";


export const getProducts = async () => {

    const response = await fetch(
        `${API_URL}/products`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch products"
        );
    }

    return data.products;
};


export const registerUser = async (userData) => {

    const response = await fetch(
        `${API_URL}/auth/register`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)
        }
    );


    const data = await response.json();


    if (!response.ok) {
        throw new Error(data.message);
    }


    return data;
};


export const loginUser = async (loginData) => {

    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(loginData)
        }
    );


    const data = await response.json();


    if (!response.ok) {
        throw new Error(data.message);
    }


    return data;
};