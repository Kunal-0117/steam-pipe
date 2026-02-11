import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { TableSkeleton } from "@/components/table-skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteDeviceProfileMutation,
  useDeleteServiceProfileMutation,
  useGetDeviceProfilesQuery,
  useGetServiceProfilesQuery,
} from "@/features/profiles/hooks";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeviceProfileForm } from "./device-profile-form";
import { ServiceProfileForm } from "./service-profile-form";

export default function ProfilesPage() {
  const [activeTab, setActiveTab] = useState("device");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: deviceProfiles = [],
    isLoading: isDPLoading,
    isError: isDPError,
    refetch: refetchDP,
  } = useGetDeviceProfilesQuery();
  const {
    data: serviceProfiles = [],
    isLoading: isSPLoading,
    isError: isSPError,
    refetch: refetchSP,
  } = useGetServiceProfilesQuery();

  const deleteDPMutation = useDeleteDeviceProfileMutation();
  const deleteSPMutation = useDeleteServiceProfileMutation();

  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  const isLoading = isDPLoading || isSPLoading;
  const isError = isDPError || isSPError;

  if (isLoading) return <LoadingState />;
  if (isError)
    return (
      <ErrorState
        onRetry={() => {
          refetchDP();
          refetchSP();
        }}
      />
    );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Profiles</h1>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Create {activeTab === "device" ? "Device" : "Service"} Profile
        </Button>
      </div>

      <Tabs
        defaultValue="device"
        className="w-full"
        onValueChange={(v) => setActiveTab(v)}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="device">Device Profiles</TabsTrigger>
          <TabsTrigger value="service">Service Profiles</TabsTrigger>
        </TabsList>

        <TabsContent value="device">
          {isLoading ? (
            <TableSkeleton columns={3} />
          ) : (
            <div className="rounded-md border animate-in fade-in duration-500">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deviceProfiles.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No device profiles found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    deviceProfiles.map((p) => (
                      <TableRow key={p.Id}>
                        <TableCell className="font-medium">
                          {p.Name || p.Id}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {p.Id}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this device profile?",
                                )
                              ) {
                                deleteDPMutation.mutate(p.Id);
                              }
                            }}
                            disabled={deleteDPMutation.isPending}
                            title="Delete Profile"
                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="service">
          <div className="rounded-md border animate-in fade-in duration-500">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceProfiles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No service profiles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  serviceProfiles.map((p) => (
                    <TableRow key={p.Id}>
                      <TableCell className="font-medium">
                        {p.Name || p.Id}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {p.Id}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this service profile?",
                              )
                            ) {
                              deleteSPMutation.mutate(p.Id);
                            }
                          }}
                          disabled={deleteSPMutation.isPending}
                          title="Delete Profile"
                          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Create {activeTab === "device" ? "Device" : "Service"} Profile
            </DialogTitle>
          </DialogHeader>
          {activeTab === "device" ? (
            <DeviceProfileForm
              onCancel={() => setIsModalOpen(false)}
              onSuccess={() => setIsModalOpen(false)}
            />
          ) : (
            <ServiceProfileForm
              onCancel={() => setIsModalOpen(false)}
              onSuccess={() => setIsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
