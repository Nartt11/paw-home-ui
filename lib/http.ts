import axios, {
  Axios,
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: "https://pet-rescue-api-0uhx.onrender.com/api/v1",
      timeout: 1000,
      headers: { "Content-Type": "application/json" },
    });
    //   add response interceptor
    this.instance.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error: AxiosError) {
        // Do something with response error

        if (error.response?.status != 422) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data;
          const message = data?.message || error.message;
          alert(`Unauthorized: ${message}`);
        }
        console.error("HTTP Error:", error);
        return Promise.reject(error);
      },
    );

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error),
    );
  }
}

const http = new Http().instance;
export default http;
