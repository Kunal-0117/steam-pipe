import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteRuleMutation,
  useGetRulesQuery,
} from "@/features/rules/hooks";
import type { IRule } from "@/features/rules/types";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { format, parseISO } from "date-fns";
import { Calendar, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { RuleForm } from "./form";

export default function RulesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<IRule | null>(null);

  const { data: rules = [], isLoading, isError, refetch } = useGetRulesQuery();
  const deleteMutation = useDeleteRuleMutation();
  const deleteConfirm = useDeleteConfirm();

  const openCreateModal = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const openEditModal = (rule: IRule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">IoT Rules</h1>
          <p className="text-muted-foreground">
            Configure rules to process and route your incoming IoT data.
          </p>
        </div>
        <Button onClick={openCreateModal} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Rule
        </Button>
      </div>

      <div className="rounded-md border bg-card animate-in fade-in duration-500 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule Name</TableHead>
              <TableHead>Topic Pattern</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No rules found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              rules.map((rule) => (
                <TableRow key={rule.ruleName}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        {rule.ruleName}
                      </div>
                      {rule.ruleArn && (
                        <span className="text-xs text-muted-foreground font-mono mt-1 truncate max-w-[200px]">
                          {rule.ruleArn}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                      {rule.topicPattern || "N/A"}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {rule.createdAt
                        ? format(parseISO(rule.createdAt), "MMM d, yyyy")
                        : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="flat"
                      colorVariant={
                        rule.ruleDisabled ? "destructive" : "success"
                      }
                      className="font-normal"
                    >
                      {rule.ruleDisabled ? "Disabled" : "Enabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditModal(rule)}
                        title="Edit Rule"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          deleteConfirm({
                            onConfirm: () =>
                              deleteMutation.mutateAsync(rule.ruleName),
                          });
                        }}
                        disabled={deleteMutation.isPending}
                        title="Delete Rule"
                        className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? "Edit IoT Rule" : "Create IoT Rule"}
            </DialogTitle>
          </DialogHeader>
          <RuleForm
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => setIsModalOpen(false)}
            editId={editingRule?.ruleName}
            initialFormValues={
              editingRule
                ? {
                    RuleName: editingRule.ruleName,
                    Sql: editingRule.topicRulePayload?.sql || "",
                    Description:
                      editingRule.topicRulePayload?.description || "",
                    useRepublishAction:
                      !!editingRule.topicRulePayload?.actions.find(
                        (a) => a.republish,
                      ),
                    RepublishTopic:
                      editingRule.topicRulePayload?.actions.find(
                        (a) => a.republish,
                      )?.republish?.topic || "",
                    RepublishRole:
                      editingRule.topicRulePayload?.actions.find(
                        (a) => a.republish,
                      )?.republish?.roleArn || "",
                    useLambdaAction:
                      !!editingRule.topicRulePayload?.actions.find(
                        (a) => a.lambda,
                      ),
                    LambdaFunctionArn:
                      editingRule.topicRulePayload?.actions.find(
                        (a) => a.lambda,
                      )?.lambda?.functionArn || "",
                  }
                : undefined
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
