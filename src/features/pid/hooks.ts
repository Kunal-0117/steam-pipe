import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { IPID, IPIDFormValues } from "./types";

const PID_STORAGE_KEY = "steam-pipe-pids";

const getPIDs = (): IPID[] => {
  const data = localStorage.getItem(PID_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const savePIDs = (pids: IPID[]) => {
  localStorage.setItem(PID_STORAGE_KEY, JSON.stringify(pids));
};

export function useGetPIDsQuery() {
  return useQuery({
    queryKey: ["pids"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getPIDs();
    },
  });
}

export function useGetPIDQuery(id?: string) {
  return useQuery({
    queryKey: ["pids", id],
    queryFn: async () => {
      if (!id) return null;
      await new Promise((resolve) => setTimeout(resolve, 500));
      const pids = getPIDs();
      return pids.find((p) => p.id === id) || null;
    },
    enabled: !!id,
  });
}

export function useCreatePIDMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: IPIDFormValues) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const pids = getPIDs();

      let imageUrl = "";
      if (values.image instanceof File) {
        // Mock image upload by converting to base64
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(values.image as File);
        });
      }

      const newPID: IPID = {
        id: crypto.randomUUID(),
        name: values.name,
        imageUrl: imageUrl,
        devices: values.devices,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      savePIDs([newPID, ...pids]);
      return newPID;
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
    }: {
      id: string;
      values: IPIDFormValues;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const pids = getPIDs();
      const index = pids.findIndex((p) => p.id === id);

      if (index === -1) throw new Error("P&ID not found");

      let imageUrl = pids[index].imageUrl;
      if (values.image instanceof File) {
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(values.image as File);
        });
      }

      const updatedPID: IPID = {
        ...pids[index],
        name: values.name,
        imageUrl: imageUrl,
        devices: values.devices,
        updatedAt: new Date().toISOString(),
      };

      pids[index] = updatedPID;
      savePIDs(pids);
      return updatedPID;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pids"] });
      queryClient.invalidateQueries({ queryKey: ["pids", data.id] });
      toast.success("P&ID updated successfully");
    },
  });
}

export function useDeletePIDMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const pids = getPIDs();
      const filteredPids = pids.filter((p) => p.id !== id);
      savePIDs(filteredPids);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pids"] });
      toast.success("P&ID deleted successfully");
    },
  });
}
