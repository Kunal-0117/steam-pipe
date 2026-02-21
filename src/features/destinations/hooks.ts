import { makeRequest } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { IDestination, IDestinationFormValues } from "./types";

export function useGetDestinationsQuery() {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      const res = await makeRequest.get<IDestination[]>("/v1/iot/destinations");
      return res.data;
    },
  });
}

export function useCreateDestinationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: IDestinationFormValues) => {
      const res = await makeRequest.post("/v1/iot/destinations", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      toast.success("Destination created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create destination");
    },
  });
}

export function useUpdateDestinationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      data,
    }: {
      name: string;
      data: IDestinationFormValues;
    }) => {
      // Backend doesn't have a PUT /destinations/:name — use the generic data update
      const res = await makeRequest.put(`/v1/iot/destinations/${name}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      toast.success("Destination updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update destination");
    },
  });
}

export function useDeleteDestinationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await makeRequest.delete(`/v1/iot/destinations/${name}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      toast.success("Destination deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete destination");
    },
  });
}
