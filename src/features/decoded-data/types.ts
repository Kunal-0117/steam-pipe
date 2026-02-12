export interface IDecodedRecord {
  device_id: string;
  timestamp: string;
  t1_celsius: number | null;
  t2_celsius: number | null;
  battery_voltage: number | null;
  leak_detected: boolean;
  low_battery: boolean;
  s3_key?: string;
  raw_payload?: string;
  [key: string]: any;
}

export interface IDecodedDataFilters {
  device_id?: string;
  start_date?: string;
  end_date?: string;
  status_filter?: "leak_detected" | "low_battery" | "all";
  limit?: number;
  offset?: number;
}

export interface IDecodedDataPaginatedResponse {
  items: IDecodedRecord[];
  has_more: boolean;
  total?: number;
}
