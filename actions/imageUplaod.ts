import HttpInterceptor from "@/services/http-interceptor";

const httpJson = new HttpInterceptor({ ContentType: "application/json" });


export const UplaodImage = (data:any,callback:any) => {
    const httpForm = new HttpInterceptor({ ContentType: "multipart/form-data" });
    const endpoint = ``;
    httpForm.post(endpoint, data)
        .then((response:any) => {
            callback(response);
        })
        .catch((error:any) => {
            callback(error.response);
        });
}