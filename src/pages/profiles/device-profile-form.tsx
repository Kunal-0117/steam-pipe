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
import { useCreateDeviceProfileMutation } from "@/features/profiles/hooks";
import { deviceProfileSchema } from "@/features/profiles/schema";
import type { IDeviceProfileFormValues } from "@/features/profiles/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

interface DeviceProfileFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialFormValues?: IDeviceProfileFormValues;
}

export function DeviceProfileForm(props: DeviceProfileFormProps) {
  const createMutation = useCreateDeviceProfileMutation();
  const form = useForm<IDeviceProfileFormValues>({
    resolver: yupResolver(deviceProfileSchema) as any,
    defaultValues: props.initialFormValues || {
      Name: "",
      RfRegion: "US915",
      MacVersion: "1.0.3",
      RegParamsRevision: "RP002-1.0.1",
      SupportsClassB: false,
      SupportsClassC: false,
    },
  });

  const onSubmit = async (values: IDeviceProfileFormValues) => {
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
                <Input placeholder="My Device Profile" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="RfRegion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RF Region</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="US915">US915</SelectItem>
                  <SelectItem value="EU868">EU868</SelectItem>
                  <SelectItem value="AU915">AU915</SelectItem>
                  <SelectItem value="AS923-1">AS923-1</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="MacVersion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MAC Version</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select MAC version" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1.0.2">1.0.2</SelectItem>
                  <SelectItem value="1.0.3">1.0.3</SelectItem>
                  <SelectItem value="1.1.0">1.1.0</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="RegParamsRevision"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Regional Parameters Revision</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select revision" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="RP002-1.0.0">RP002-1.0.0</SelectItem>
                  <SelectItem value="RP002-1.0.1">RP002-1.0.1</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="SupportsClassB"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Supports Class B</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="SupportsClassC"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Supports Class C</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            Create Device Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
