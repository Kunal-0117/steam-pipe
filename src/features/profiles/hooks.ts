import { makeRequest } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  IDeviceProfile,
  IDeviceProfileFormValues,
  IServiceProfile,
  IServiceProfileFormValues,
} from "./types";

export function useGetDeviceProfilesQuery() {
  return useQuery({
    queryKey: ["profiles", "device-profiles"],
    queryFn: async () => {
      const res = await makeRequest.get<IDeviceProfile[]>("/device-profiles");
      return res.data;
    },
  });
}

export function useCreateDeviceProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: IDeviceProfileFormValues) => {
      const res = await makeRequest.post("/device-profiles", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profiles", "device-profiles"],
      });
      toast.success("Device profile created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create device profile");
    },
  });
}

export function useDeleteDeviceProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await makeRequest.delete(`/device-profiles/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profiles", "device-profiles"],
      });
      toast.success("Device profile deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete device profile");
    },
  });
}

export function useGetServiceProfilesQuery() {
  return useQuery({
    queryKey: ["profiles", "service-profiles"],
    queryFn: async () => {
      const res = await makeRequest.get<IServiceProfile[]>("/service-profiles");
      return res.data;
    },
  });
}

export function useCreateServiceProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: IServiceProfileFormValues) => {
      const res = await makeRequest.post("/service-profiles", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profiles", "service-profiles"],
      });
      toast.success("Service profile created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create service profile");
    },
  });
}

export function useDeleteServiceProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await makeRequest.delete(`/service-profiles/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profiles", "service-profiles"],
      });
      toast.success("Service profile deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete service profile");
    },
  });
}
