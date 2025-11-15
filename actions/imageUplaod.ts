import HttpInterceptor from "@/services/http-interceptor";

// For JSON requests (not needed here but keeping your structure)
const httpJson = new HttpInterceptor({ ContentType: "application/json" });

export const UploadImage = (data: any, callback: any) => {
    const httpForm = new HttpInterceptor({ ContentType: "multipart/form-data" });

    // Correct endpoint for your DRF action
    const endpoint = "http://192.168.8.141:8000/api/classifications/predict/";

    httpForm
        .post(endpoint, data)
        .then((response: any) => {
            callback(response);
        })
        .catch((error: any) => {
            console.log(error)
            callback(error.response);
        });
};
