import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import { launchToast } from "@/lib/utils";

const baseUrl = "http://localhost:3001";

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
    const fullUrl = baseUrl + url;
    try {
      const response: AxiosResponse<T | string> =
        method === "get"
          ? await axios.get(fullUrl, { headers })
          : method === "post"
          ? await axios.post(fullUrl, requestData, { headers })
          : method === "put"
          ? await axios.put(fullUrl, requestData, { headers })
          : method === "delete"
          ? await axios.delete(fullUrl, { headers })
          : await axios.get(fullUrl, { headers }); // Default to GET if the method is invalid

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

export default useAxios;
