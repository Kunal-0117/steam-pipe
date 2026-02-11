export interface ILoraWanDevice {
  DevEui: string;
  DeviceProfileId: string;
  ServiceProfileId: string;
  OtaaV1_0_x?: {
    AppKey: string;
    AppEui: string;
  };
}

export interface IDevice {
  Id: string;
  Name: string;
  Description?: string;
  DestinationName: string;
  isOnline: boolean;
  lastUplink?: string;
  LoRaWAN: ILoraWanDevice;
  Type: string;
}

export interface IDeviceListResponse {
  items: IDevice[];
  nextToken?: string;
  totalCount: number;
}

export interface IDeviceFormValues {
  Name: string;
  Description: string;
  DevEui: string;
  DeviceProfileId: string;
  ServiceProfileId: string;
  DestinationName: string;
  AppKey: string;
  AppEUI: string;
  clientId: string;
  locationId: string;
}

export interface IProvisionFormValues {
  serialNumber: string;
  clientId: string;
  locationId: string;
  DestinationName: string;
  DeviceProfileId: string;
  ServiceProfileId: string;
}

export interface IProvisionResponse {
  DevEUI: string;
  AppEUI: string;
  AppKey: string;
}

export interface IDeviceFilters {
  maxResults?: number;
  nextToken?: string;
  name?: string;
  destinationName?: string;
  isOnline?: boolean;
}
