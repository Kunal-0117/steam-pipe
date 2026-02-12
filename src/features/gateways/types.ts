export interface IGateway {
  Arn: string;
  Id: string;
  Name: string;
  Description?: string;
  LoRaWAN: ILoRaWan;
  LastUplinkReceivedAt?: string;
  LastLinkedUpdated?: string;
}

export interface ILoRaWan {
  GatewayEui: string;
  RfRegion: string;
  Beaconing: {};
}

export interface IGatewayFormValues {
  GatewayEui: string;
  RfRegion: string;
  clientId: string;
  locationId: string;
  Name: string;
  Description?: string;
}
