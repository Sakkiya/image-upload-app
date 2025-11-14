import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

class HttpInterceptor {
    private instance: AxiosInstance;

    constructor(props: any) {
        const defaultOptions: AxiosRequestConfig = {
            headers: {
                "Content-Type": props.ContentType,
                "Accept": "application/json, multipart/form-data",
                "Access-Control-Allow-Origin": "*",
               
            },
        };
        this.instance = axios.create(defaultOptions);

        this.instance.interceptors.request.use(
            async (request) => {
                try {
                    const userJson = await AsyncStorage.getItem("user");
                    if (userJson) {
                        const authToken = JSON.parse(userJson);
                        if (authToken) {
                            request.headers.Authorization = "Bearer " + authToken.accessToken;
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
                return request;
            },
            (error) => {
                if (error.request) {
                    console.log("[ERROR]", " [HTTP Interceptor, The request was made but no response was received", error.request);
                } else {
                    console.log("[ERROR]", " [HTTP Interceptor, Something happened in setting up the request ", error);
                }
                return Promise.reject(error);
            }
        );

        this.instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (!error.response) {
                    console.log('[ERROR]', ' [HTTP Interceptor, Network Error', error);
                } else {
                    console.log('[ERROR]', ' [HTTP Interceptor, The request was made and the server responded', error.response);
                    if (error.response.status) {
                        switch (error.response.status) {
                            case 401: {
                                break;
                            }
                            default: {
                                console.log('[ERROR]', ' [HTTP Interceptor, Status Code]', error.response.status);
                                break;
                            }
                        }
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    // Expose the axios instance methods
    public post(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        return this.instance.post(url, data, config);
    }

    // Add other HTTP methods as needed
}

export default HttpInterceptor;
