import { useConfirm } from "@/components/ui/confirm-dialog";
import MESSAGES from "@/configs/messages";
import { useCallback } from "react";
import { toast } from "sonner";

interface ToastConfig {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

interface UseDeleteConfirmProps {
  onConfirm: () => Promise<any>;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  toastConfig?: ToastConfig;
}

export function useDeleteConfirm() {
  const confirm = useConfirm();

  return useCallback(
    (options: UseDeleteConfirmProps) => {
      const toastConfig = {
        showSuccessToast: true,
        showErrorToast: true,
        successMessage: null,
        errorMessage: null,
        ...options.toastConfig,
      };
      confirm({
        title: MESSAGES.DELETE.CONFIRM.TITLE,
        description: MESSAGES.DELETE.CONFIRM.DESCRIPTION,
        type: "destructive",
        onConfirm: async () => {
          try {
            const response = await options.onConfirm();
            options.onSuccess?.(response);
            if (!toastConfig.showSuccessToast) return;
            if (
              typeof response?.message === "string" &&
              response.message.trim().length > 10
            ) {
              toast.success(MESSAGES.DELETE.SUCCESS.TITLE, {
                description: response.message,
              });
            } else if (toastConfig.successMessage) {
              toast.success(MESSAGES.DELETE.SUCCESS.TITLE, {
                description: toastConfig.successMessage,
              });
            } else {
              toast.success(MESSAGES.DELETE.SUCCESS.TITLE, {
                description: MESSAGES.DELETE.SUCCESS.DESCRIPTION,
              });
            }
          } catch (error: any) {
            options.onError?.(error);
            if (!toastConfig.showErrorToast) return;
            if (error.message) {
              toast.error(MESSAGES.DELETE.ERROR.TITLE, {
                description: error.message,
                duration: 30000,
                closeButton: true,
              });
            } else if (toastConfig.errorMessage) {
              toast.error(MESSAGES.DELETE.ERROR.TITLE, {
                description: toastConfig.errorMessage,
                duration: 30000,
                closeButton: true,
              });
            } else {
              toast.error(MESSAGES.DELETE.ERROR.TITLE, {
                description: MESSAGES.DELETE.ERROR.DESCRIPTION,
                duration: 30000,
                closeButton: true,
              });
            }
          }
        },
      });
    },
    [confirm],
  );
}
