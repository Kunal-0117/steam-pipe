import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetDestinationsQuery } from "@/features/destinations/hooks";
import {
  useDeleteDeviceMutation,
  useGetDevicesQuery,
} from "@/features/devices/hooks";
import type { IDevice, IDeviceFilters } from "@/features/devices/types";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Circle, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeviceForm } from "./form";

export default function DevicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<IDevice | null>(null);

  const [filters, setFilters] = useState<IDeviceFilters>({
    maxResults: 10,
    name: "",
    destinationName: "all",
    isOnline: undefined,
  });

  const { data: destinationsData = [] } = useGetDestinationsQuery();
  const { data, isLoading, refetch } = useGetDevicesQuery({
    ...filters,
    destinationName:
      filters.destinationName === "all" ? undefined : filters.destinationName,
  });
  const deleteMutation = useDeleteDeviceMutation();

  const devices = data?.items || [];
  const nextToken = data?.nextToken;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      name: e.target.value,
      nextToken: undefined,
    }));
  };

  const handleNextPage = () => {
    if (nextToken) {
      setFilters((prev) => ({ ...prev, nextToken }));
    }
  };

  const handleResetFilters = () => {
    setFilters({
      maxResults: 10,
      name: "",
      destinationName: "all",
      isOnline: undefined,
      nextToken: undefined,
    });
  };

  const openCreateModal = () => {
    setEditingDevice(null);

    setIsModalOpen(true);
  };

  const openEditModal = (device: IDevice) => {
    setEditingDevice(device);
    setIsModalOpen(true);
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "Never";
    try {
      const date = parseISO(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Wireless Devices</h1>
        <div className="flex gap-2">
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Create Device
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-muted/30 p-4 rounded-lg border">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            className="pl-8"
            value={filters.name}
            onChange={handleSearch}
          />
        </div>

        <Select
          value={filters.destinationName}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              destinationName: value,
              nextToken: undefined,
            }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Destinations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Destinations</SelectItem>
            {destinationsData.map((d) => (
              <SelectItem key={d.Name} value={d.Name}>
                {d.Name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={
            filters.isOnline === undefined
              ? "all"
              : filters.isOnline
                ? "online"
                : "offline"
          }
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              isOnline:
                value === "all" ? undefined : value === "online" ? true : false,
              nextToken: undefined,
            }))
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => refetch()}
          title="Refresh list"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
        {(filters.nextToken ||
          filters.name ||
          filters.destinationName !== "all" ||
          filters.isOnline !== undefined) && (
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            Reset
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>

              <TableHead>DevEUI</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Last Uplink</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin text-primary" />
                    Loading devices...
                  </div>
                </TableCell>
              </TableRow>
            ) : devices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No devices found.
                </TableCell>
              </TableRow>
            ) : (
              devices.map((dev) => (
                <TableRow key={dev.Id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Circle
                        className={`h-2.5 w-2.5 fill-current ${
                          dev.isOnline ? "text-green-500" : "text-red-500"
                        }`}
                      />
                      <span className="text-xs font-medium">
                        {dev.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{dev.Name}</div>
                    {dev.Description && (
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {dev.Description}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="font-mono text-xs">
                    {dev.LoRaWAN?.DevEui || "N/A"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {dev.DestinationName || "N/A"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatTimestamp(dev.lastUplink)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(dev)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this device?",
                            )
                          ) {
                            deleteMutation.mutate(dev.Id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {data?.totalCount ? `Total: ${data.totalCount}` : ""}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            disabled={!filters.nextToken}
          >
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!nextToken}
          >
            Next Page
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDevice ? "Edit Device" : "Create Device"}
            </DialogTitle>
          </DialogHeader>
          <DeviceForm
            editId={editingDevice?.Id}
            initialValues={
              editingDevice
                ? {
                    Name: editingDevice.Name,
                    Description: editingDevice.Description,
                    DevEui: editingDevice.LoRaWAN?.DevEui,
                    DeviceProfileId: editingDevice.LoRaWAN?.DeviceProfileId,
                    ServiceProfileId: editingDevice.LoRaWAN?.ServiceProfileId,
                    DestinationName: editingDevice.DestinationName,
                  }
                : undefined
            }
            onSuccess={() => {
              setIsModalOpen(false);
              refetch();
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
