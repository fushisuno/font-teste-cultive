import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: `http://${import.meta.env.VITE_API_URL}:5000/api`,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    const msg = response?.data?.message;
    if (msg && !response.config?.silent) toast.success(msg);
    return response;
  },
  (error) => {
    const msg =
      error.response?.data?.message || "Ocorreu um erro inesperado no servidor";
    if (!error.config?.silent) toast.error(msg);
    return Promise.reject(error);
  }
);

export default axiosInstance;
