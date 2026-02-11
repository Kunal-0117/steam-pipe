import { IconInnerShadowTop } from "@tabler/icons-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[500px] w-full animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        {/* Outer pulse Ring */}
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/20 duration-[2000ms]" />

        {/* Rotating border */}
        <div className="h-16 w-16 animate-spin rounded-full border-2 border-primary border-t-transparent" />

        {/* Center Icon */}
        <div className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
          <IconInnerShadowTop className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2 text-center">
        <h3 className="text-lg font-semibold tracking-tight">Steam Pipe</h3>
        <p className="text-sm text-muted-foreground animate-pulse max-w-[200px]">
          Synchronizing your data...
        </p>
      </div>
    </div>
  );
}
