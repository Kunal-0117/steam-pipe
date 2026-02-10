export interface IDestination {
  Arn: string;
  Name: string;
  ExpressionType: "RuleName" | "MqttTopic";
  Expression: string;
  RoleArn: string;
  Description?: string;
}

export interface IDestinationFormValues {
  Name: string;
  ExpressionType: "RuleName" | "MqttTopic";
  Expression: string;
  RoleArn: string;
  Description?: string;
}
