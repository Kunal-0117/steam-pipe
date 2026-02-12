import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetDecodedDataQuery } from "@/features/decoded-data/hooks";
import type {
  IDecodedDataFilters,
  IDecodedRecord,
} from "@/features/decoded-data/types";
import { useGetDevicesQuery } from "@/features/devices/hooks";
import { format, parseISO } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  Eye,
  Filter,
  RefreshCw,
  X,
} from "lucide-react";
import { useState } from "react";
import { DetailsDialog } from "./details-dialog";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function DecodedDataPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [selectedRecord, setSelectedRecord] = useState<IDecodedRecord | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [filters, setFilters] = useState<
    Omit<IDecodedDataFilters, "limit" | "offset">
  >({
    device_id: "all",
    start_date: "",
    end_date: "",
    status_filter: "all",
  });

  const { data: devicesData } = useGetDevicesQuery({ maxResults: 100 });
  const devices = devicesData?.items || [];

  const activeFilters: IDecodedDataFilters = {
    limit: pageSize,
    offset: page * pageSize,
    device_id: filters.device_id === "all" ? undefined : filters.device_id,
    start_date: filters.start_date || undefined,
    end_date: filters.end_date || undefined,
    status_filter:
      filters.status_filter === "all" ? undefined : filters.status_filter,
  };

  const { data, isLoading, isError, refetch } =
    useGetDecodedDataQuery(activeFilters);

  const items = data?.items || [];
  const hasMore = data?.has_more || false;

  const handleResetFilters = () => {
    setFilters({
      device_id: "all",
      start_date: "",
      end_date: "",
      status_filter: "all",
    });
    setPage(0);
  };

  const handleUpdateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), "MMM d, yyyy HH:mm:ss");
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Decoded Data</h1>
          <p className="text-muted-foreground">
            Monitor and explore incoming data from your wireless devices.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide" : "Show"} Filters
          </Button>
          <Button onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">Filters</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground"
                onClick={handleResetFilters}
              >
                <X className="mr-1 h-3 w-3" /> Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="device">Device</Label>
                <Select
                  value={filters.device_id}
                  onValueChange={(v) => handleUpdateFilter("device_id", v)}
                >
                  <SelectTrigger id="device">
                    <SelectValue placeholder="All Devices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Devices</SelectItem>
                    {devices.map((dev) => (
                      <SelectItem key={dev.Id} value={dev.Id}>
                        {dev.Name || dev.Id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Special Status</Label>
                <Select
                  value={filters.status_filter}
                  onValueChange={(v) => handleUpdateFilter("status_filter", v)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="leak_detected">Leak Detected</SelectItem>
                    <SelectItem value="low_battery">Low Battery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start">Start Date</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  value={filters.start_date?.substring(0, 16)}
                  onChange={(e) =>
                    handleUpdateFilter(
                      "start_date",
                      e.target.value ? e.target.value + ":00Z" : "",
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end">End Date</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={filters.end_date?.substring(0, 16)}
                  onChange={(e) =>
                    handleUpdateFilter(
                      "end_date",
                      e.target.value ? e.target.value + ":00Z" : "",
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device Name</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">T1 (°C)</TableHead>
              <TableHead className="text-right">T2 (°C)</TableHead>
              <TableHead className="text-right">Battery (V)</TableHead>
              <TableHead className="text-center">Status Filters</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin text-primary" />
                    Loading data...
                  </div>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Database className="h-12 w-12 mb-2 opacity-20" />
                    <p>No decoded data records found.</p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={handleResetFilters}
                    >
                      Clear all filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((record) => (
                <TableRow
                  key={
                    record.s3_key || `${record.device_id}-${record.timestamp}`
                  }
                >
                  <TableCell className="font-mono text-xs font-medium">
                    {record.device_id}
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    {formatTimestamp(record.timestamp)}
                  </TableCell>
                  <TableCell className="text-right">
                    {record.t1_celsius?.toFixed(1) ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {record.t2_celsius?.toFixed(1) ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {record.battery_voltage?.toFixed(2) ?? "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      {record.leak_detected && (
                        <Badge
                          variant="flat"
                          colorVariant="destructive"
                          className="text-xs h-5 px-1.5 uppercase"
                        >
                          Leak
                        </Badge>
                      )}
                      {record.low_battery && (
                        <Badge
                          variant="bordered"
                          colorVariant="warning"
                          className="text-xs h-5 px-1.5 uppercase"
                        >
                          Low Batt
                        </Badge>
                      )}
                      {!record.leak_detected && !record.low_battery && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedRecord(record);
                        setIsDetailModalOpen(true);
                      }}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(v) => {
                setPageSize(Number(v));
                setPage(0);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span>
            {items.length > 0
              ? `Showing ${page * pageSize + 1} to ${page * pageSize + items.length}`
              : "No results"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="flex items-center justify-center min-w-[32px] font-medium text-sm">
            {page + 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore || isLoading}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <DetailsDialog
        record={selectedRecord}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
      />
    </div>
  );
}
