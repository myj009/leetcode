import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { launchToast } from "@/lib/utils";
import { axiosInstance } from "@/lib/customAxios";

const useAxios = <T>(
  url: string,
  method: AxiosRequestConfig["method"] = "get",
  requestData?: AxiosRequestConfig["data"],
  headers?: AxiosRequestConfig["headers"]
) => {
  const [data, setData] = useState<T | null>(null);
  const [err, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      console.log("axios call");
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
      setData(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      const e = err as AxiosError;
      setError(e);
      console.log(e);
      launchToast(e.response?.data as string), "", "destructive";
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url, method, requestData, headers]);

  return { data, loading, err };
};

export const useAxiosArray = <T>(
  url: string,
  method: AxiosRequestConfig["method"] = "get",
  requestData?: AxiosRequestConfig["data"],
  headers?: AxiosRequestConfig["headers"]
) => {
  const [data, setData] = useState<T[]>([]);
  const [err, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      console.log("axios call");
      const response: AxiosResponse<T[] | string> =
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
      const data = response.data as T[];
      setData(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      const e = err as AxiosError;
      setError(e);
      console.log(e);
      launchToast(e.response?.data as string), "", "destructive";
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [headers]);

  return { data, loading, err } as const;
};

export default useAxios;
