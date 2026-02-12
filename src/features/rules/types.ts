export interface IRuleAction {
  republish?: {
    topic: string;
    roleArn: string;
  };
  lambda?: {
    functionArn: string;
  };
}

export interface IRulePayload {
  sql: string;
  description?: string;
  actions: IRuleAction[];
  ruleDisabled?: boolean;
}

export interface IRule {
  ruleArn: string;
  ruleName: string;
  topicPattern: string;
  createdAt: string;
  ruleDisabled: boolean;
  topicRulePayload?: IRulePayload;
}

export interface IRuleFormValues {
  RuleName: string;
  Sql: string;
  Description?: string;
  useRepublishAction: boolean;
  RepublishTopic?: string;
  RepublishRole?: string;
  useLambdaAction: boolean;
  LambdaFunctionArn?: string;
}

export interface ILambdaFunction {
  FunctionName: string;
  FunctionArn: string;
  Runtime: string;
}
