import yup from "@/lib/yup";

export const deviceProfileSchema = yup.object({
  Name: yup.string().required("Name is required"),
  RfRegion: yup.string().required("RF Region is required"),
  MacVersion: yup.string().required("MAC Version is required"),
  RegParamsRevision: yup
    .string()
    .required("Regional Parameters Revision is required"),
  SupportsClassB: yup.boolean().default(false),
  SupportsClassC: yup.boolean().default(false),
});

export const serviceProfileSchema = yup.object({
  Name: yup.string().required("Name is required"),
  AddGwMetadata: yup.boolean().default(true),
});
