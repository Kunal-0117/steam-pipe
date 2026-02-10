import { Button } from "@/components/ui/button";
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
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
} from "@/features/destinations/hooks";
import { destinationSchema } from "@/features/destinations/schema";
import type { IDestinationFormValues } from "@/features/destinations/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

interface DestinationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialFormValues?: IDestinationFormValues;
  editId?: string;
}

export function DestinationForm(props: DestinationFormProps) {
  const createMutation = useCreateDestinationMutation();
  const updateMutation = useUpdateDestinationMutation();
  const form = useForm<IDestinationFormValues>({
    resolver: yupResolver(destinationSchema) as any,
    defaultValues: props.initialFormValues || {
      Name: "",
      ExpressionType: "RuleName",
      Expression: "",
      RoleArn: "",
      Description: "",
    },
  });

  const onSubmit = async (values: IDestinationFormValues) => {
    if (props.editId) {
      updateMutation.mutate(
        {
          name: props.editId,
          data: values,
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
          name="Name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="My Destination"
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
          name="ExpressionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expression Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="RuleName">RuleName</SelectItem>
                  <SelectItem value="MqttTopic">MqttTopic</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Expression"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expression</FormLabel>
              <FormControl>
                <Input placeholder="e.g. MyIoTRule or my/topic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="RoleArn"
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

        <FormField
          control={form.control}
          name="Description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Optional description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {props.editId ? "Update Destination" : "Create Destination"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
