export interface IProfile {
  Arn: string;
  Id: string;
  Name: string;
}

export interface IDeviceProfile extends IProfile {
  RfRegion: string;
  MacVersion: string;
  RegParamsRevision: string;
  SupportsClassB: boolean;
  SupportsClassC: boolean;
}

export interface IServiceProfile extends IProfile {
  AddGwMetadata: boolean;
}

export interface IDeviceProfileFormValues {
  Name: string;
  RfRegion: string;
  MacVersion: string;
  RegParamsRevision: string;
  SupportsClassB: boolean;
  SupportsClassC: boolean;
}

export interface IServiceProfileFormValues {
  Name: string;
  AddGwMetadata: boolean;
}
