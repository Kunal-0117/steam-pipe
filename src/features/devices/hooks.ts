import { makeRequest } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  IDeviceFilters,
  IDeviceFormValues,
  IDeviceListResponse,
  IProvisionResponse,
} from "./types";

export function useGetDevicesQuery(filters: IDeviceFilters = {}) {
  return useQuery({
    queryKey: ["devices", filters],
    queryFn: async () => {
      const res = await makeRequest.get<IDeviceListResponse>(
        "/wireless-devices",
        {
          params: filters,
        },
      );
      return res.data;
    },
  });
}

export function useCreateDeviceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: IDeviceFormValues) => {
      const payload = {
        Type: "LoRaWAN",
        Name: values.Name,
        Description: values.Description,
        DestinationName: values.DestinationName,
        LoRaWAN: {
          DevEui: values.DevEui,
          DeviceProfileId: values.DeviceProfileId,
          ServiceProfileId: values.ServiceProfileId,
          OtaaV1_0_x: {
            AppKey: values.AppKey,
            AppEui: values.AppEUI,
          },
        },
        Tags: [
          { Key: "ClientId", Value: values.clientId },
          { Key: "LocationId", Value: values.locationId },
        ],
      };
      const res = await makeRequest.post("/wireless-devices", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      toast.success("Device created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create device");
    },
  });
}

export function useUpdateDeviceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Partial<IDeviceFormValues>;
    }) => {
      const payload = {
        Type: "LoRaWAN",
        Name: values.Name,
        Description: values.Description,
        DestinationName: values.DestinationName,
        LoRaWAN: {
          DevEui: values.DevEui,
          DeviceProfileId: values.DeviceProfileId,
          ServiceProfileId: values.ServiceProfileId,
          OtaaV1_0_x: {
            AppKey: values.AppKey,
            AppEui: values.AppEUI,
          },
        },
      };
      const res = await makeRequest.put(`/wireless-devices/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      toast.success("Device updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update device");
    },
  });
}

export function useDeleteDeviceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await makeRequest.delete(`/wireless-devices/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      toast.success("Device deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete device");
    },
  });
}

export function useGenerateKeysQuery() {
  return useQuery({
    queryKey: ["utils", "generate-keys"],
    queryFn: async () => {
      const res = await makeRequest.get<IProvisionResponse>(
        "/utils/generate-keys",
      );
      return res.data;
    },
    enabled: false, // Manual trigger only via refetch
  });
}

export function useGenerateGuidQuery() {
  return useQuery({
    queryKey: ["utils", "generate-guid"],
    queryFn: async () => {
      const res = await makeRequest.get<string>("/utils/generate-guid");
      return res.data;
    },
    enabled: false, // Manual trigger only
  });
}
