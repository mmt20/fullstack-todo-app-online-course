import { useQuery } from "@tanstack/react-query";
import axIosinstance from "../config/axios.config";
import { AxiosRequestConfig } from "axios";

interface IAuthenticatedQuery {
  queryKey: string[];
  url: string;
  config?: AxiosRequestConfig;
}

const useQustomQuery = ({ queryKey, url, config }: IAuthenticatedQuery) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await axIosinstance.get(url, config);
      return data;
    },
  });
};

export default useQustomQuery;
