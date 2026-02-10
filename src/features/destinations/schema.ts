import yup from "@/lib/yup";

export const destinationSchema = yup.object({
  Name: yup.string().required("Name is required"),
  ExpressionType: yup
    .string()
    .oneOf(["RuleName", "MqttTopic"], "Invalid expression type")
    .required("Expression type is required"),
  Expression: yup.string().required("Expression is required"),
  RoleArn: yup
    .string()
    .matches(/^arn:aws:iam::\d{12}:role\/[\w+=,.@-]+$/, "Invalid Role ARN")
    .required("Role ARN is required"),
  Description: yup.string().optional().default(""),
});
