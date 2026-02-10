import yup from "@/lib/yup";

export const ruleSchema = yup.object({
  RuleName: yup.string().required("Rule name is required"),
  Sql: yup.string().required("SQL is required"),
  Description: yup.string().optional().default(""),
  useRepublishAction: yup.boolean().default(false),
  RepublishTopic: yup.string().when("useRepublishAction", {
    is: true,
    then: (schema) => schema.required("Republish topic is required"),
    otherwise: (schema) => schema.optional(),
  }),
  RepublishRole: yup.string().when("useRepublishAction", {
    is: true,
    then: (schema) => schema.required("Republish role ARN is required"),
    otherwise: (schema) => schema.optional(),
  }),
  useLambdaAction: yup.boolean().default(false),
  LambdaFunctionArn: yup.string().when("useLambdaAction", {
    is: true,
    then: (schema) => schema.required("Lambda function is required"),
    otherwise: (schema) => schema.optional(),
  }),
});
