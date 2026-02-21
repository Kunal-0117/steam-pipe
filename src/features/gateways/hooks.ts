import { makeRequest } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { IGateway, IGatewayFormValues } from "./types";

export function useGetGatewaysQuery() {
  return useQuery({
    queryKey: ["gateways"],
    queryFn: async () => {
      const res = await makeRequest.get<IGateway[]>("/v1/iot/gateways");
      return res.data;
    },
  });
}

export function useCreateGatewayMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: IGatewayFormValues) => {
      const res = await makeRequest.post("/v1/iot/gateways", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gateways"] });
      toast.success("Gateway created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create gateway");
    },
  });
}

export function useUpdateGatewayMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Pick<IGatewayFormValues, "Name" | "Description">;
    }) => {
      const res = await makeRequest.put(`/v1/iot/gateways/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gateways"] });
      toast.success("Gateway updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update gateway");
    },
  });
}

export function useDeleteGatewayMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await makeRequest.delete(`/v1/iot/gateways/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gateways"] });
      toast.success("Gateway deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete gateway");
    },
  });
}

export function useDownloadGatewayConfigMutation() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeRequest.get(`/v1/iot/gateways/${id}/configuration`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `gateway_config_${id}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to download configuration");
    },
  });
}
