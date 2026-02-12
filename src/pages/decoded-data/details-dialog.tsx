import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { IDecodedRecord } from "@/features/decoded-data/types";
import { format, parseISO } from "date-fns";

interface DetailsDialogProps {
  record: IDecodedRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailsDialog({
  record,
  open,
  onOpenChange,
}: DetailsDialogProps) {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Data Point Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4 w-full h-[80vh] overflow-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Device ID
              </p>
              <p className="font-mono text-sm">{record.device_id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Timestamp
              </p>
              <p className="text-sm">
                {format(parseISO(record.timestamp), "yyyy-MM-dd HH:mm:ss")}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold mb-3">Measurements</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">T1</p>
                <p className="text-lg font-semibold">
                  {record.t1_celsius?.toFixed(1) ?? "N/A"}°C
                </p>
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">T2</p>
                <p className="text-lg font-semibold">
                  {record.t2_celsius?.toFixed(1) ?? "N/A"}°C
                </p>
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Battery</p>
                <p className="text-lg font-semibold">
                  {record.battery_voltage?.toFixed(2) ?? "N/A"}V
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Status Flags</h3>
            <div className="flex gap-2">
              <Badge
                variant="flat"
                colorVariant={record.leak_detected ? "destructive" : "success"}
              >
                {record.leak_detected ? "Leak Detected" : "No Leak"}
              </Badge>
              <Badge
                variant="flat"
                colorVariant={record.low_battery ? "warning" : "success"}
              >
                {record.low_battery ? "Low Battery" : "Battery OK"}
              </Badge>
            </div>
          </div>

          {record.s3_key && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                S3 Storage Key
              </p>
              <p className="text-xs font-mono break-all bg-muted p-2 rounded">
                {record.s3_key}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Raw Payload Metadata
            </p>
            <pre className="text-xs font-mono p-3 bg-muted rounded max-w-full break-all whitespace-break-spaces">
              {JSON.stringify(record, null, 2)}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
