import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://localhost:44309"
})
axiosInstance.interceptors.response.use(
    (response) => response
)