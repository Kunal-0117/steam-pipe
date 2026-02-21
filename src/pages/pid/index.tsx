import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useGetDevicesQuery } from "@/features/devices/hooks";
import { useDeletePIDMutation, useGetPIDsQuery } from "@/features/pid/hooks";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  Calendar,
  Circle,
  Edit,
  ExternalLink,
  Map,
  Plus,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PIDListPage() {
  const navigate = useNavigate();
  const {
    data: pids = [],
    isLoading: isPIDsLoading,
    isError,
    refetch,
  } = useGetPIDsQuery();
  const { data: devicesData, isLoading: isDevicesLoading } = useGetDevicesQuery(
    { maxResults: 1000 },
  );
  const deleteMutation = useDeletePIDMutation();

  const handleEdit = (id: string) => {
    navigate(`/pid/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/pid/view/${id}`);
  };

  const deleteConfirm = useDeleteConfirm();

  const handleDelete = (id: string) => {
    deleteConfirm({
      onConfirm: () => {
        return deleteMutation.mutateAsync(id);
      },
      onSuccess: refetch,
    });
  };

  const isLoading = isPIDsLoading || isDevicesLoading;

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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {pids.map((pid) => {
            const pidDevices = pid.devices
              .map((d) =>
                devicesData?.items.find((item) => item.Id === d.deviceId),
              )
              .filter(Boolean);
            const onlineCount = pidDevices.filter((d) => d?.isOnline).length;
            const totalCount = pid.devices.length;
            const healthPercentage =
              totalCount > 0 ? (onlineCount / totalCount) * 100 : 0;

            return (
              <Card
                key={pid.id}
                className="group overflow-hidden flex flex-row p-0 transition-all hover:border-primary/50"
              >
                <div
                  className="w-32 sm:w-48 shrink-0 relative bg-muted border-r overflow-hidden cursor-pointer"
                  onClick={() => handleView(pid.id)}
                >
                  <img
                    src={pid.imageUrl}
                    alt={pid.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink className="text-white h-6 w-6" />
                  </div>
                </div>

                <div className="flex-1 flex flex-col p-4 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <CardTitle
                        className="text-base sm:text-lg truncate cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleView(pid.id)}
                      >
                        {pid.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>
                          Updated{" "}
                          {pid.updatedAt
                            ? formatDistanceToNow(parseISO(pid.updatedAt), { addSuffix: true })
                            : "recently"}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(pid.id)}
                        title="Edit Configuration"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(pid.id)}
                        title="Delete Diagram"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <Circle className="h-2 w-2 fill-success text-success" />
                          <span className="font-medium">
                            {onlineCount} Online
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 grayscale opacity-60">
                          <Circle className="h-2 w-2 fill-muted-foreground text-muted-foreground" />
                          <span>{totalCount - onlineCount} Offline</span>
                        </div>
                      </div>
                      <Badge
                        variant="flat"
                        colorVariant={
                          healthPercentage === 100
                            ? "success"
                            : healthPercentage > 50
                              ? "warning"
                              : "destructive"
                        }
                        className="px-1.5 py-0"
                      >
                        {totalCount > 0
                          ? `${Math.round(healthPercentage)}% Active`
                          : "No Devices"}
                      </Badge>
                    </div>

                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success transition-all duration-500"
                        style={{ width: `${healthPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
