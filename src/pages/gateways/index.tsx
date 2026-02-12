import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { Badge } from "@/components/ui/badge";
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
import {
  useDeleteGatewayMutation,
  useDownloadGatewayConfigMutation,
  useGetGatewaysQuery,
} from "@/features/gateways/hooks";
import type { IGateway } from "@/features/gateways/types";
import { differenceInHours, format, parseISO } from "date-fns";
import { Download, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { GatewayForm } from "./form";

export default function GatewaysPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState<IGateway | null>(null);

  const {
    data: gateways = [],
    isLoading,
    isError,
    refetch,
  } = useGetGatewaysQuery();

  const deleteMutation = useDeleteGatewayMutation();
  const downloadMutation = useDownloadGatewayConfigMutation();

  const openCreateModal = () => {
    setEditingGateway(null);
    setIsModalOpen(true);
  };

  const openEditModal = (gw: IGateway) => {
    setEditingGateway(gw);
    setIsModalOpen(true);
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Gateways</h1>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Create Gateway
        </Button>
      </div>

      <div className="rounded-md border animate-in fade-in duration-500">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>EUI</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gateways.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No gateways found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              gateways.map((gw) => (
                <TableRow key={gw.Id}>
                  <TableCell className="font-medium">
                    {gw.Name || gw.Id}
                  </TableCell>
                  <TableCell>{gw.LoRaWAN?.GatewayEui || "N/A"}</TableCell>
                  <TableCell>{gw.LoRaWAN?.RfRegion || "N/A"}</TableCell>
                  <TableCell>
                    {gw.LastLinkedUpdated ? (
                      differenceInHours(
                        new Date(),
                        parseISO(gw.LastLinkedUpdated),
                      ) <= 2 ? (
                        <Badge variant="flat" colorVariant="success">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="flat" colorVariant="destructive">
                          Inactive
                        </Badge>
                      )
                    ) : (
                      <Badge variant="flat" colorVariant="secondary">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {gw.LastLinkedUpdated
                      ? format(parseISO(gw.LastLinkedUpdated), "PPp")
                      : "Never"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {gw.Description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => downloadMutation.mutate(gw.Id)}
                        disabled={downloadMutation.isPending}
                        title="Download Configuration"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(gw)}
                        title="Edit Gateway"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this gateway?",
                            )
                          ) {
                            deleteMutation.mutate(gw.Id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        title="Delete Gateway"
                        className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingGateway ? "Edit Gateway" : "Create Gateway"}
            </DialogTitle>
            <GatewayForm
              onCancel={setIsModalOpen.bind(null, false)}
              onSuccess={setIsModalOpen.bind(null, false)}
              editId={editingGateway?.Id}
              initialFormValues={
                editingGateway
                  ? {
                      GatewayEui: editingGateway.LoRaWAN?.GatewayEui || "",
                      RfRegion: editingGateway.LoRaWAN?.RfRegion || "US915",
                      clientId: "ClientA",
                      locationId: "Loc1",
                      Name: editingGateway.Name || "",
                      Description: editingGateway.Description || "",
                    }
                  : {
                      GatewayEui: "",
                      RfRegion: "US915",
                      clientId: "ClientA",
                      locationId: "Loc1",
                      Name: "",
                      Description: "",
                    }
              }
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
