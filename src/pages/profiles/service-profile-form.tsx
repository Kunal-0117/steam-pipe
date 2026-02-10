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
import { useCreateServiceProfileMutation } from "@/features/profiles/hooks";
import { serviceProfileSchema } from "@/features/profiles/schema";
import type { IServiceProfileFormValues } from "@/features/profiles/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

interface ServiceProfileFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialFormValues?: IServiceProfileFormValues;
}

export function ServiceProfileForm(props: ServiceProfileFormProps) {
  const createMutation = useCreateServiceProfileMutation();
  const form = useForm<IServiceProfileFormValues>({
    resolver: yupResolver(serviceProfileSchema) as any,
    defaultValues: props.initialFormValues || {
      Name: "",
      AddGwMetadata: true,
    },
  });

  const onSubmit = async (values: IServiceProfileFormValues) => {
    createMutation.mutate(values, {
      onSuccess: props.onSuccess,
    });
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
                <Input placeholder="My Service Profile" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="AddGwMetadata"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Add Gateway Metadata</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            Create Service Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
