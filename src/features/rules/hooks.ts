import { makeRequest } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  ILambdaFunction,
  IRule,
  IRuleAction,
  IRuleFormValues,
} from "./types";

export function useGetRulesQuery() {
  return useQuery({
    queryKey: ["rules"],
    queryFn: async () => {
      const res = await makeRequest.get<IRule[]>("/v1/iot/rules");
      return res.data;
    },
  });
}

/** Lambda functions list is not in the new backend — returns empty for now */
export function useGetLambdaFunctionsQuery() {
  return useQuery({
    queryKey: ["lambda-functions"],
    queryFn: async (): Promise<ILambdaFunction[]> => {
      // This endpoint is not yet in the backend — return empty list gracefully
      return [];
    },
  });
}

function transformFormToPayload(values: IRuleFormValues) {
  const actions: IRuleAction[] = [];
  if (
    values.useRepublishAction &&
    values.RepublishTopic &&
    values.RepublishRole
  ) {
    actions.push({
      republish: {
        topic: values.RepublishTopic,
        roleArn: values.RepublishRole,
      },
    });
  }
  if (values.useLambdaAction && values.LambdaFunctionArn) {
    actions.push({
      lambda: {
        functionArn: values.LambdaFunctionArn,
      },
    });
  }
  return {
    RuleName: values.RuleName,
    Sql: values.Sql,
    Description: values.Description,
    Actions: actions,
  };
}

export function useCreateRuleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: IRuleFormValues) => {
      const payload = transformFormToPayload(values);
      const res = await makeRequest.post("/v1/iot/rules", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      toast.success("Rule created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create rule");
    },
  });
}

export function useUpdateRuleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      values,
    }: {
      name: string;
      values: IRuleFormValues;
    }) => {
      const payload = transformFormToPayload(values);
      const res = await makeRequest.put(`/v1/iot/rules/${name}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      toast.success("Rule updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update rule");
    },
  });
}

export function useDeleteRuleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await makeRequest.delete(`/v1/iot/rules/${name}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      toast.success("Rule deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete rule");
    },
  });
}
