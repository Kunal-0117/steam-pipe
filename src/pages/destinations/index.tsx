import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
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
  useDeleteDestinationMutation,
  useGetDestinationsQuery,
} from "@/features/destinations/hooks";
import type { IDestination } from "@/features/destinations/types";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { Pencil, Plus, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { DestinationForm } from "./form";

export default function DestinationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] =
    useState<IDestination | null>(null);

  const {
    data: destinations = [],
    isLoading,
    isError,
    refetch,
  } = useGetDestinationsQuery();
  const deleteMutation = useDeleteDestinationMutation();
  const deleteConfirm = useDeleteConfirm();

  const openCreateModal = () => {
    setEditingDestination(null);
    setIsModalOpen(true);
  };

  const openEditModal = (destination: IDestination) => {
    setEditingDestination(destination);
    setIsModalOpen(true);
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Destinations</h1>
          <p className="text-muted-foreground">
            Configure where your decoded data should be sent.
          </p>
        </div>
        <Button onClick={openCreateModal} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Destination
        </Button>
      </div>

      <div className="rounded-md border bg-card animate-in fade-in duration-500 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Expression</TableHead>
              <TableHead>Role ARN</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {destinations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No destinations found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              destinations.map((d) => (
                <TableRow key={d.Name}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-primary" />
                      {d.Name}
                    </div>
                  </TableCell>
                  <TableCell>{d.ExpressionType}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {d.Expression}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                    {d.RoleArn}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditModal(d)}
                        title="Edit Destination"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          deleteConfirm({
                            onConfirm: () => deleteMutation.mutateAsync(d.Name),
                          });
                        }}
                        disabled={deleteMutation.isPending}
                        title="Delete Destination"
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
              {editingDestination ? "Edit Destination" : "Create Destination"}
            </DialogTitle>
          </DialogHeader>
          <DestinationForm
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => setIsModalOpen(false)}
            editId={editingDestination?.Name}
            initialFormValues={
              editingDestination
                ? {
                    Name: editingDestination.Name,
                    ExpressionType: editingDestination.ExpressionType,
                    Expression: editingDestination.Expression,
                    RoleArn: editingDestination.RoleArn,
                    Description: editingDestination.Description || "",
                  }
                : undefined
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
