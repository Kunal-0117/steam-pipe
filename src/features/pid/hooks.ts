import { makeRequest } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { IPID, IPIDFormValues } from "./types";

export function useGetPIDsQuery() {
  return useQuery({
    queryKey: ["pids"],
    queryFn: async () => {
      const res = await makeRequest.get<IPID[]>("/v1/data/pids");
      return res.data;
    },
  });
}

export function useGetPIDQuery(id?: string) {
  return useQuery({
    queryKey: ["pids", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await makeRequest.get<IPID>(`/v1/data/pids/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

/** Helper to upload image to S3 using backend presigned URL */
async function uploadImageToS3(file: File): Promise<string> {
  // 1. Get presigned URL
  const { data: presignedData } = await makeRequest.post(
    "/v1/storage/upload-url",
    {
      filename: file.name,
      content_type: file.type,
      expires_in: 300,
      folder: "pids"
    }
  );

  // 2. Upload directly to S3
  await fetch(presignedData.upload_url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  // 3. Return the stored key/url
  // Since we don't have a public bucket URL mapped in the response, we might need a download URL later
  // but for now we store the file_key or just use the upload url baseline if public
  return presignedData.file_key;
}

export function useCreatePIDMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: IPIDFormValues) => {
      let imageUrl = "";
      if (values.image instanceof File) {
        imageUrl = await uploadImageToS3(values.image);
      }

      const payload = {
        name: values.name,
        imageUrl: imageUrl,
        devices: values.devices,
      };

      const res = await makeRequest.post("/v1/data/pids", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pids"] });
      toast.success("P&ID created successfully");
    },
  });
}

export function useUpdatePIDMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
      currentImageUrl,
    }: {
      id: string;
      values: IPIDFormValues;
      currentImageUrl?: string;
    }) => {
      let imageUrl = currentImageUrl || "";
      if (values.image instanceof File) {
        imageUrl = await uploadImageToS3(values.image);
      } else if (typeof values.image === "string") {
        imageUrl = values.image;
      }

      const payload = {
        name: values.name,
        imageUrl: imageUrl,
        devices: values.devices,
      };

      const res = await makeRequest.put(`/v1/data/pids/${id}`, payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pids"] });
      if (data && data.id) {
        queryClient.invalidateQueries({ queryKey: ["pids", data.id] });
      }
      toast.success("P&ID updated successfully");
    },
  });
}

export function useDeletePIDMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await makeRequest.delete(`/v1/data/pids/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pids"] });
      toast.success("P&ID deleted successfully");
    },
  });
}

