import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDeletePIDMutation, useGetPIDsQuery } from "@/features/pid/hooks";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Calendar, Edit, Map, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PIDListPage() {
  const navigate = useNavigate();
  const { data: pids = [], isLoading, isError } = useGetPIDsQuery();
  const deleteMutation = useDeletePIDMutation();

  const handleEdit = (id: string) => {
    navigate(`/pid/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState />;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Piping & Instrumentation Diagrams
          </h1>
          <p className="text-muted-foreground">
            Manage your P&ID diagrams and device locations
          </p>
        </div>
        <Button onClick={() => navigate("/pid/new")} className="gap-2">
          <Plus className="h-4 w-4" />
          Upload New Diagram
        </Button>
      </div>

      {pids.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <Map className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <CardTitle>No diagrams found</CardTitle>
          <CardDescription className="max-w-sm mt-2">
            Upload your first P&ID diagram to start mapping your devices on the
            plant floor.
          </CardDescription>
          <Button
            variant="outline"
            onClick={() => navigate("/pid/new")}
            className="mt-6 gap-2"
          >
            <Plus className="h-4 w-4" />
            Upload Diagram
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pids.map((pid) => (
            <Card key={pid.id} className="overflow-hidden flex flex-col p-0">
              <div className="aspect-video relative bg-muted overflow-hidden">
                <img
                  src={pid.imageUrl}
                  alt={pid.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-medium border">
                  {pid.devices.length} Devices
                </div>
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg truncate">{pid.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(parseISO(pid.createdAt), {
                    addSuffix: true,
                  })}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0 mt-auto flex justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleEdit(pid.id)}
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete "${pid.name}"?`,
                      )
                    ) {
                      handleDelete(pid.id);
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
