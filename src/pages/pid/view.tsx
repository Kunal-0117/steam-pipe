import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetDevicesQuery } from "@/features/devices/hooks";
import { useGetPIDQuery } from "@/features/pid/hooks";
import { cn } from "@/lib/utils";
import { ArrowLeft, MapPin, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PIDViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    data: pid,
    isLoading: isLoadingPID,
    isError: isPIDError,
  } = useGetPIDQuery(id);
  const { data: devicesData, isLoading: isLoadingDevices } = useGetDevicesQuery(
    { maxResults: 100 },
  );

  if (isLoadingPID || isLoadingDevices) return <LoadingState />;
  if (isPIDError || !pid)
    return <ErrorState message="P&ID diagram not found" />;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 p-6 transition-all duration-300",
        isFullscreen && "fixed inset-0 z-50 bg-background p-0 overflow-auto",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-4 px-6 pt-6",
          !isFullscreen && "px-0 pt-0",
        )}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/pid")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{pid.name}</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
          {isFullscreen ? (
            <Minimize2 className="h-5 w-5" />
          ) : (
            <Maximize2 className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className={cn("flex-1", isFullscreen ? "px-6 pb-6" : "")}>
        <Card className="overflow-hidden border-none shadow-none bg-transparent">
          <CardContent className="p-0 relative">
            <div className="relative rounded-lg overflow-hidden border bg-muted shadow-2xl">
              <img
                src={pid.imageUrl}
                alt={pid.name}
                className="w-full h-auto block"
              />
              {pid.devices.map((sd) => {
                const device = devicesData?.items.find(
                  (d) => d.Id === sd.deviceId,
                );
                const isOnline = device?.isOnline;

                return (
                  <div
                    key={sd.deviceId}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${sd.x}%`, top: `${sd.y}%` }}
                  >
                    <div
                      className={cn(
                        "rounded-full p-2 shadow-lg border-2 border-background animate-in zoom-in-50 duration-200 transition-colors",
                        isOnline
                          ? "bg-success text-success-foreground"
                          : "bg-destructive text-destructive-foreground",
                        "relative",
                      )}
                    >
                      {/* Pulse effect wrapper */}
                      <div
                        className={cn(
                          "absolute inset-0 rounded-full",
                          isOnline
                            ? "animate-ping bg-success/40"
                            : "animate-ping bg-destructive/40",
                        )}
                      />

                      <MapPin className="h-5 w-5 relative z-10" />
                    </div>

                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                      <div className="bg-popover text-popover-foreground text-xs font-medium px-2 py-1.5 rounded-md border shadow-md whitespace-nowrap flex flex-col items-center">
                        <span>{sd.deviceName}</span>
                        <span
                          className={cn(
                            "text-[10px]",
                            isOnline
                              ? "text-green-500"
                              : "text-red-500 uppercase",
                          )}
                        >
                          {isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
