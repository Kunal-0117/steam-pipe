import { makeRequest } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import type {
  IDecodedDataFilters,
  IDecodedDataPaginatedResponse,
} from "./types";

export function useGetDecodedDataQuery(filters: IDecodedDataFilters) {
  return useQuery({
    queryKey: ["decoded-data", filters],
    queryFn: async () => {
      // The legacy code called apiClient.getDecodedData(params)
      // I'll assume the endpoint is /decoded-data
      const res = await makeRequest.get<IDecodedDataPaginatedResponse>(
        "/decoded-data",
        {
          params: filters,
        },
      );
      return res.data;
    },
  });
}
