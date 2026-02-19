import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDevicesQuery } from "@/features/devices/hooks";
import {
  useCreatePIDMutation,
  useGetPIDQuery,
  useUpdatePIDMutation,
} from "@/features/pid/hooks";
import type { IPIDDevice, IPIDFormValues } from "@/features/pid/types";
import { ArrowLeft, MapPin, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function PIDFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const {
    data: existingPID,
    isLoading: isLoadingPID,
    isError: isGetPIDError,
  } = useGetPIDQuery(id);
  const { data: devicesData } = useGetDevicesQuery({ maxResults: 100 });
  const createMutation = useCreatePIDMutation();
  const updateMutation = useUpdatePIDMutation();

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedDevices, setSelectedDevices] = useState<IPIDDevice[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>("");

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (existingPID) {
      setName(existingPID.name);
      setPreviewUrl(existingPID.imageUrl);
      setSelectedDevices(existingPID.devices);
    }
  }, [existingPID]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentDeviceId || !imageRef.current) return;

    const device = devicesData?.items.find((d) => d.Id === currentDeviceId);
    if (!device) return;

    // Check if device already placed
    if (selectedDevices.some((d) => d.deviceId === currentDeviceId)) {
      toast.error("This device is already placed on the diagram");
      return;
    }

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPIDDevice: IPIDDevice = {
      deviceId: device.Id,
      deviceName: device.Name,
      x,
      y,
    };

    setSelectedDevices([...selectedDevices, newPIDDevice]);
    setCurrentDeviceId(""); // Reset selection after placing
  };

  const removeDevice = (deviceId: string) => {
    setSelectedDevices(selectedDevices.filter((d) => d.deviceId !== deviceId));
  };

  const handleSave = async () => {
    if (!name) {
      toast.error("Please enter a name");
      return;
    }
    if (!previewUrl) {
      toast.error("Please upload an image");
      return;
    }

    const values: IPIDFormValues = {
      name,
      image,
      devices: selectedDevices,
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: id as string, values });
      } else {
        await createMutation.mutateAsync(values);
      }
      navigate("/pid");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const availableDevices =
    devicesData?.items.filter(
      (d) => !selectedDevices.some((sd) => sd.deviceId === d.Id),
    ) || [];

  if (isEditing && isLoadingPID) return <LoadingState />;
  if (isEditing && isGetPIDError) return <ErrorState />;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/pid")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit P&ID Diagram" : "Upload P&ID Diagram"}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Diagram Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Main Plant P&ID"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Upload Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className="flex flex-1 items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 cursor-pointer hover:bg-accent"
                >
                  <Upload className="h-4 w-4" />
                  <span>{previewUrl ? "Change Image" : "Select Image"}</span>
                </Label>
              </div>
            </div>

            <hr className="my-2" />

            <div className="flex flex-col gap-2">
              <Label htmlFor="device-select">Add Device to Map</Label>
              <Select
                value={currentDeviceId}
                onValueChange={setCurrentDeviceId}
              >
                <SelectTrigger id="device-select">
                  <SelectValue placeholder="Select a device" />
                </SelectTrigger>
                <SelectContent>
                  {availableDevices.map((device) => (
                    <SelectItem key={device.Id} value={device.Id}>
                      {device.Name}
                    </SelectItem>
                  ))}
                  {availableDevices.length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No more devices available
                    </div>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select a device then click on the image to place it.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Placed Devices</Label>
              <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                {selectedDevices.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No devices placed yet
                  </p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {selectedDevices.map((sd) => (
                      <div
                        key={sd.deviceId}
                        className="flex items-center justify-between p-2 rounded-sm bg-accent/50 text-sm"
                      >
                        <span className="truncate flex-1">{sd.deviceName}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => removeDevice(sd.deviceId)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button
              className="mt-4"
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {isEditing ? "Update Diagram" : "Save Diagram"}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Diagram Workspace</CardTitle>
          </CardHeader>
          <CardContent>
            {previewUrl ? (
              <div
                className="relative overflow-hidden rounded-lg border bg-muted cursor-crosshair"
                onClick={handleImageClick}
              >
                <img
                  ref={imageRef}
                  src={previewUrl}
                  alt="P&ID Preview"
                  className="w-full h-auto block"
                />
                {selectedDevices.map((sd) => (
                  <div
                    key={sd.deviceId}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${sd.x}%`, top: `${sd.y}%` }}
                  >
                    <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg border-2 border-background animate-in zoom-in-50 duration-200">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block z-10">
                      <div className="bg-popover text-popover-foreground text-[10px] px-1.5 py-0.5 rounded border whitespace-nowrap shadow-sm">
                        {sd.deviceName}
                      </div>
                    </div>
                  </div>
                ))}
                {currentDeviceId && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/5 pointer-events-none border-2 border-primary border-dashed">
                    <p className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-xl">
                      Click anywhere on the image to place the selected device
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg bg-muted/50 text-muted-foreground">
                <Upload className="h-10 w-10 mb-4 opacity-20" />
                <p>Upload a diagram to start placing devices</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
