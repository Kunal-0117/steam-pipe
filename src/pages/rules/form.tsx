import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateRuleMutation,
  useGetLambdaFunctionsQuery,
  useUpdateRuleMutation,
} from "@/features/rules/hooks";
import { ruleSchema } from "@/features/rules/schema";
import type { IRuleFormValues } from "@/features/rules/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

interface RuleFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialFormValues?: IRuleFormValues;
  editId?: string;
}

export function RuleForm(props: RuleFormProps) {
  const createMutation = useCreateRuleMutation();
  const updateMutation = useUpdateRuleMutation();
  const { data: lambdas = [], isLoading: isLoadingLambdas } =
    useGetLambdaFunctionsQuery();

  const form = useForm<IRuleFormValues>({
    resolver: yupResolver(ruleSchema) as any,
    defaultValues: props.initialFormValues || {
      RuleName: "",
      Sql: "SELECT * FROM 'topic'",
      Description: "",
      useRepublishAction: false,
      RepublishTopic: "",
      RepublishRole: "",
      useLambdaAction: false,
      LambdaFunctionArn: "",
    },
  });

  const onSubmit = async (values: IRuleFormValues) => {
    if (!values.useRepublishAction && !values.useLambdaAction) {
      form.setError("root", {
        message: "Please configure at least one action (Republish or Lambda)",
      });
      return;
    }

    if (props.editId) {
      updateMutation.mutate(
        {
          name: props.editId,
          values,
        },
        {
          onSuccess: props.onSuccess,
        },
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: props.onSuccess,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="RuleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rule Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="MyIoTRule"
                  {...field}
                  disabled={!!props.editId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Sql"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SQL Statement</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="SELECT * FROM 'topic/subtopic'"
                  className="font-mono"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Optional description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 border rounded-md p-4">
          <h3 className="text-sm font-medium">Actions</h3>
          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="useRepublishAction"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Republish to IoT Topic</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("useRepublishAction") && (
              <div className="ml-7 space-y-3">
                <FormField
                  control={form.control}
                  name="RepublishTopic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="republished/topic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="RepublishRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role ARN</FormLabel>
                      <FormControl>
                        <Input placeholder="arn:aws:iam::..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <div className="space-y-4 pt-2 border-t">
            <FormField
              control={form.control}
              name="useLambdaAction"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Invoke Lambda Function</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("useLambdaAction") && (
              <div className="ml-7 space-y-3">
                <FormField
                  control={form.control}
                  name="LambdaFunctionArn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lambda Function</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a function" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingLambdas ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            lambdas.map((l) => (
                              <SelectItem
                                key={l.FunctionArn}
                                value={l.FunctionArn}
                              >
                                {l.FunctionName}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {props.editId ? "Update Rule" : "Create Rule"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
