import router from "@/router";
import axios from "axios";
import { notification } from "ant-design-vue";

const axiosIns = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BASE_URL}/api`,
});

axiosIns.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = token ? `Bearer ${token}` : "";
  }
  return config;
});

axiosIns.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("accessToken");

      // If 401
      router.push("/login");
    } else {
      return Promise.reject(error.response.data);
    }
  }
);


export async function handleRequest(request, calllback, successMessage = null, showError = true,) {
  try {
    const res = await request;
    if (res.ok) {
      successMessage && notification.success({
        message: successMessage
      });
      calllback && calllback(res)
    } else {
      showError && notification.error({
        message: res.e || "Lỗi",
      });
    }
  } catch (error) {
    showError && notification.error({
      message: error.message || "Lỗi",
    });
  }
}

export default axiosIns;
