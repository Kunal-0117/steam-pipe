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
import { Pencil, Plus, RefreshCw, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { DestinationForm } from "./form";

export default function DestinationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] =
    useState<IDestination | null>(null);

  const { data: destinations = [], isLoading } = useGetDestinationsQuery();
  const deleteMutation = useDeleteDestinationMutation();

  const openCreateModal = () => {
    setEditingDestination(null);
    setIsModalOpen(true);
  };

  const openEditModal = (destination: IDestination) => {
    setEditingDestination(destination);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Destinations</h1>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Create Destination
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <RefreshCw className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : (
        <div className="rounded-md border">
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
                          variant="outline"
                          size="icon"
                          onClick={() => openEditModal(d)}
                          title="Edit Destination"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this destination?",
                              )
                            ) {
                              deleteMutation.mutate(d.Name);
                            }
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
      )}

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
