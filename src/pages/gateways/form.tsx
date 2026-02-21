import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
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
  useCreateGatewayMutation,
  useUpdateGatewayMutation,
} from "@/features/gateways/hooks";
import { gatewaySchema } from "@/features/gateways/schema";
import type { IGatewayFormValues } from "@/features/gateways/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";

interface GatewayFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialFormValues?: IGatewayFormValues;
  editId?: string;
}

export function GatewayForm(props: GatewayFormProps) {
  const createMutation = useCreateGatewayMutation();
  const updateMutation = useUpdateGatewayMutation();
  const form = useForm<IGatewayFormValues>({
    resolver: yupResolver(gatewaySchema) as any,
    defaultValues: props.initialFormValues,
  });

  const handleGenerateEui = async () => {
    try {
      //   const keys = await apiClient.generateKeys();
      //   setValue("GatewayEui", keys.DevEUI);
    } catch (error) {
      console.error("Failed to generate EUI", error);
    }
  };

  const handleGenerateGuid = async (_field: keyof IGatewayFormValues) => {
    try {
      //   const guid = await apiClient.generateGuid();
      //   setValue(field, guid);
    } catch (error) {
      console.error("Failed to generate GUID", error);
    }
  };

  const onSubmit = async (values: IGatewayFormValues) => {
    if (props.editId) {
      updateMutation.mutate(
        {
          id: props.editId,
          data: {
            Name: values.Name,
            Description: values.Description,
          },
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
        {!props.editId && (
          <FormField
            control={form.control}
            name="GatewayEui"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gateway EUI (16 hex chars)</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="e.g. A1B2C3D4E5F60708" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleGenerateEui}
                    title="Generate EUI"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="Name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Gateway" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!props.editId && (
          <>
            <FormField
              control={form.control}
              name="RfRegion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RF Region</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client ID</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleGenerateGuid("clientId")}
                        title="Generate GUID"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location ID</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleGenerateGuid("locationId")}
                        title="Generate GUID"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        <FormField
          control={form.control}
          name="Description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Gateway Description"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {props.editId ? "Update" : "Create"} Gateway
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
