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
import { useGetDestinationsQuery } from "@/features/destinations/hooks";
import {
  useCreateDeviceMutation,
  useGenerateGuidQuery,
  useGenerateKeysQuery,
  useUpdateDeviceMutation,
} from "@/features/devices/hooks";
import { deviceSchema } from "@/features/devices/schema";
import type { IDeviceFormValues } from "@/features/devices/types";
import {
  useGetDeviceProfilesQuery,
  useGetServiceProfilesQuery,
} from "@/features/profiles/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";

interface DeviceFormProps {
  editId?: string;
  initialValues?: Partial<IDeviceFormValues>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DeviceForm({
  editId,
  initialValues,
  onSuccess,
  onCancel,
}: DeviceFormProps) {
  const { data: destinations = [] } = useGetDestinationsQuery();
  const { data: deviceProfiles = [] } = useGetDeviceProfilesQuery();
  const { data: serviceProfiles = [] } = useGetServiceProfilesQuery();

  const createMutation = useCreateDeviceMutation();
  const updateMutation = useUpdateDeviceMutation();

  const { refetch: generateKeys } = useGenerateKeysQuery();
  const { refetch: generateGuid } = useGenerateGuidQuery();

  const form = useForm<IDeviceFormValues>({
    resolver: yupResolver(deviceSchema) as any,
    defaultValues: {
      Name: "",
      Description: "",
      DevEui: "",
      DeviceProfileId: deviceProfiles[0]?.Id || "",
      ServiceProfileId: serviceProfiles[0]?.Id || "",
      DestinationName: destinations[0]?.Name || "",
      AppKey: "",
      AppEUI: "",
      clientId: "ClientA",
      locationId: "Loc1",
      ...initialValues,
    },
  });

  const onSubmit = (values: any) => {
    if (editId) {
      updateMutation.mutate(
        {
          id: editId,
          values: values,
        },
        {
          onSuccess,
        },
      );
    } else {
      createMutation.mutate(values, {
        onSuccess,
      });
    }
  };

  const handleGenerateKeys = async () => {
    const { data } = await generateKeys();
    if (data) {
      form.setValue("DevEui", data.DevEUI);
      form.setValue("AppEUI", data.AppEUI);
      form.setValue("AppKey", data.AppKey);
    }
  };

  const handleGenerateGuid = async (field: "clientId" | "locationId") => {
    const { data } = await generateGuid();
    if (data) {
      form.setValue(field, data);
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
                <Input placeholder="My Device" {...field} />
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
                <Textarea placeholder="Device description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!editId && (
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
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <div className="flex justify-between items-center pt-2">
          <FormLabel>LoRaWAN Configuration</FormLabel>
          {!editId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateKeys}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Generate Keys
            </Button>
          )}
        </div>
        <FormField
          control={form.control}
          name="DevEui"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DevEUI (16 hex)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. A1B2C3D4E5F60708"
                  disabled={!!editId}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Common Fields */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="DeviceProfileId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device Profile</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Profile" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {deviceProfiles.map((p) => (
                      <SelectItem key={p.Id} value={p.Id}>
                        {p.Name || p.Id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ServiceProfileId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Profile</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Profile" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {serviceProfiles.map((p) => (
                      <SelectItem key={p.Id} value={p.Id}>
                        {p.Name || p.Id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="DestinationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Destination" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {destinations.map((d) => (
                    <SelectItem key={d.Name} value={d.Name}>
                      {d.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {!editId && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="AppKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AppKey (32 hex)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="AppEUI"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AppEUI (16 hex)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {editId ? "Update" : "Create"} Device
          </Button>
        </div>
      </form>
    </Form>
  );
}
