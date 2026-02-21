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
      // Maps to GET /v1/telemetry/readings on the backend
      const res = await makeRequest.get<IDecodedDataPaginatedResponse>(
        "/v1/telemetry/readings",
        {
          params: filters,
        },
      );
      return res.data;
    },
  });
}
