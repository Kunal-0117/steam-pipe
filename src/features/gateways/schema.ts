import yup from "@/lib/yup";

export const gatewaySchema = yup.object({
  GatewayEui: yup
    .string()
    .matches(/^[0-9A-Fa-f]{16}$/, "Must be 16 hex characters")
    .required("Gateway EUI is required"),
  Name: yup.string().required("Name is required"),
  RfRegion: yup.string().required("RF Region is required"),
  clientId: yup.string().required("Client ID is required"),
  locationId: yup.string().required("Location ID is required"),
  Description: yup.string().optional().default(""),
});
