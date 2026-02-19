"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import MESSAGES from "@/configs/messages";
import { colorVariants } from "@/lib/color-variants";
import clsx from "clsx";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  XOctagonIcon,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button, buttonVariants } from "./button";
import { Spinner } from "./spinner";

export interface ConfirmOptions {
  type?: "success" | "warning" | "info" | "destructive" | "default";
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmButton?: React.ComponentPropsWithRef<typeof Button>;
  cancelButton?: React.ComponentPropsWithRef<typeof Button> | null;
  alertDialogTitle?: React.ComponentPropsWithRef<typeof DialogTitle>;
  alertDialogDescription?: React.ReactNode;
}

export interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

export const ConfirmContext = createContext<ConfirmContextType | undefined>(
  undefined,
);

const baseDefaultOptions: ConfirmOptions = {
  title: MESSAGES.GENERAL.CONFIRM.TITLE,
  type: "default",
  description: MESSAGES.GENERAL.CONFIRM.DESCRIPTION,
  confirmText: "Confirm",
  cancelText: "Cancel",
  confirmButton: {},
  cancelButton: {},
  alertDialogTitle: {},
  alertDialogDescription: null,
};

const Icons = {
  warning: AlertTriangleIcon,
  destructive: XOctagonIcon,
  success: CheckCircle2Icon,
  info: InfoIcon,
};

const ConfirmDialogContent: React.FC<{
  config: ConfirmOptions;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  handleConfirm: () => void;
  handleCancel: () => void;
}> = memo(({ onOpenChange, isOpen, config, handleConfirm, handleCancel }) => {
  const {
    title,
    onCancel,
    onConfirm,
    description,
    cancelButton,
    confirmButton,
    confirmText,
    cancelText,
    type = "default",
    alertDialogDescription,
  } = config;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const { pathname } = useLocation();
  const prePathname = useRef(pathname);

  const onInternalCancel = useCallback(async () => {
    setCancelLoading(true);
    try {
      await onCancel?.();
    } catch (_err) {
      //fail silently
    } finally {
      handleCancel();
      setCancelLoading(false);
    }
  }, [handleCancel, onCancel]);

  async function onInternalConfirm() {
    setConfirmLoading(true);
    try {
      await onConfirm?.();
    } catch (_err) {
      //fail silently
    } finally {
      handleConfirm();
      //doing this so as to ensure that confirm button loading persist even after success so as to prevent accidental double click on confirm button after success.
      setTimeout(() => setConfirmLoading(false), 100);
    }
  }

  const cancelRef = useRef<HTMLButtonElement>(null);

  const disabled = confirmLoading || cancelLoading;

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => {
      cancelRef.current?.focus();
    }, 0);
  }, [isOpen]);

  useEffect(() => {
    if (prePathname.current === pathname) return;
    prePathname.current = pathname;
    onInternalCancel();
  }, [pathname, onInternalCancel]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px] p-4"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => disabled && e.preventDefault()}
        showCloseButton={false}
      >
        <div className="flex sm:flex-row gap-2 items-start">
          {type === "success" ? (
            <div className="bg-success/5 rounded-full p-2.5">
              <Icons.success className="text-success" />
            </div>
          ) : type === "destructive" ? (
            <div className="bg-destructive/5 rounded-full p-2.5">
              <Icons.destructive className="text-destructive" />
            </div>
          ) : type === "warning" ? (
            <div className="bg-warning/5 rounded-full p-2.5">
              <Icons.warning className="text-warning" />
            </div>
          ) : type === "info" ? (
            <div className="bg-info/5 rounded-full p-2.5">
              <Icons.info className="text-info" />
            </div>
          ) : null}

          <div className="flex-1">
            <DialogHeader>
              {title && (
                <DialogTitle className="text-left">{title}</DialogTitle>
              )}
              {description && (
                <DialogDescription className="text-left">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>

            {alertDialogDescription && (
              <div className="mt-4 text-sm text-muted-foreground">
                {alertDialogDescription}
              </div>
            )}

            <div className="w-full flex gap-2 max-w-max ml-auto mt-6">
              {cancelButton !== null && (
                <Button
                  ref={cancelRef}
                  variant={"outline"}
                  disabled={disabled}
                  onClick={onInternalCancel}
                  {...cancelButton}
                >
                  {cancelText}
                  {cancelLoading && <Spinner size={"sm"} />}
                </Button>
              )}
              <Button
                variant={"outline"}
                disabled={disabled}
                className={clsx(
                  "border-0",
                  type === "success" && colorVariants.flat.success,
                  type === "warning" && colorVariants.flat.warning,
                  type === "destructive" && colorVariants.flat.destructive,
                  type === "info" && colorVariants.flat.info,
                  type === "default" && buttonVariants({ variant: "default" }),
                )}
                onClick={onInternalConfirm}
                {...confirmButton}
              >
                {confirmText}
                {confirmLoading && <Spinner size={"sm"} />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ConfirmDialogContent.displayName = "ConfirmDialogContent";

const ConfirmDialog: React.FC<{
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  config: ConfirmOptions;
  handleConfirm: () => void;
  handleCancel: () => void;
}> = memo(({ isOpen, onOpenChange, config, handleConfirm, handleCancel }) => (
  <ConfirmDialogContent
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    config={config}
    handleConfirm={handleConfirm}
    handleCancel={handleCancel}
  />
));

ConfirmDialog.displayName = "ConfirmDialog";

export const ConfirmDialogProvider: React.FC<{
  defaultOptions?: ConfirmOptions;
  children: React.ReactNode;
}> = ({ defaultOptions, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>(baseDefaultOptions);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const mergedDefaultOptions = useMemo(
    () => ({
      ...baseDefaultOptions,
      ...defaultOptions,
    }),
    [defaultOptions],
  );

  const confirm = useCallback(
    (newOptions: ConfirmOptions) => {
      setOptions({ ...mergedDefaultOptions, ...newOptions });
      setIsOpen(true);
      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve;
      });
    },
    [mergedDefaultOptions],
  );

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolverRef.current) resolverRef.current(true);
  }, []);

  const handleCancel = useCallback(() => {
    setTimeout(() => {
      setIsOpen(false);
      if (resolverRef.current) resolverRef.current(false);
    }, 0);
  }, []);

  const contextValue = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={handleCancel}
        config={options}
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ((
  options: ConfirmOptions,
) => Promise<boolean>) => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmDialogProvider");
  }
  return context.confirm;
};
