import { makeRequest } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { IDestination, IDestinationFormValues } from "./types";

export function useGetDestinationsQuery() {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      const res = await makeRequest.get<IDestination[]>("/destinations");
      return res.data;
    },
  });
}

export function useCreateDestinationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: IDestinationFormValues) => {
      const res = await makeRequest.post("/destinations", data);
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
      const res = await makeRequest.put(`/destinations/${name}`, data);
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
      const res = await makeRequest.delete(`/destinations/${name}`);
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
