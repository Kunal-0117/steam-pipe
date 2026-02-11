import * as yup from "yup";

export const deviceSchema = yup.object({
  Name: yup.string().required("Name is required"),
  Description: yup.string().optional(),
  DevEui: yup
    .string()
    .matches(/^[0-9A-Fa-f]{16}$/, "DevEUI must be 16 hex characters")
    .required("DevEUI is required"),
  DeviceProfileId: yup.string().required("Device profile is required"),
  ServiceProfileId: yup.string().required("Service profile is required"),
  DestinationName: yup.string().required("Destination is required"),
  AppKey: yup
    .string()
    .matches(/^[0-9A-Fa-f]{32}$/, "AppKey must be 32 hex characters")
    .required("AppKey is required"),
  AppEUI: yup
    .string()
    .matches(/^[0-9A-Fa-f]{16}$/, "AppEUI must be 16 hex characters")
    .required("AppEUI is required"),
  clientId: yup.string().required("Client ID is required"),
  locationId: yup.string().required("Location ID is required"),
});
