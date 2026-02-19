export interface IPIDDevice {
  deviceId: string;
  deviceName: string;
  x: number;
  y: number;
}

export interface IPID {
  id: string;
  name: string;
  imageUrl: string;
  devices: IPIDDevice[];
  createdAt: string;
  updatedAt: string;
}

export interface IPIDFormValues {
  name: string;
  image: File | string | null;
  devices: IPIDDevice[];
}
