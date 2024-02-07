import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { launchToast } from "./utils";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;

const customAxios = async <T>(
  url: string,
  method: AxiosRequestConfig["method"] = "get",
  requestData?: AxiosRequestConfig["data"],
  headers?: AxiosRequestConfig["headers"]
) => {
  try {
    const response: AxiosResponse<T | string> =
      method === "get"
        ? await axiosInstance.get(url, { headers })
        : method === "post"
        ? await axiosInstance.post(url, requestData, { headers })
        : method === "put"
        ? await axiosInstance.put(url, requestData, { headers })
        : method === "delete"
        ? await axiosInstance.delete(url, { headers })
        : await axiosInstance.get(url, { headers }); // Default to GET if the method is invalid

    if (response.status !== 200 && response.status !== 201) {
      throw Error(response.data as string);
    }
    const data = response.data as T;
    return data;
  } catch (err) {
    const e = err as AxiosError;
    // setError(e);
    console.log(e);
    launchToast(e.response?.data as string, "", "destructive");
    return null;
  }
};

export default customAxios;
