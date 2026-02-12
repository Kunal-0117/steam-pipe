import { colorVariants } from "@/lib/color-variants";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 tracking-tight",
  {
    variants: {
      variant: {
        solid: {},
        bordered: "border bg-transparent",
        flat: "border",
      },
      colorVariant: {
        primary: {},
        secondary: {},
        success: {},
        warning: {},
        destructive: {},
        info: {},
        pink: {},
        orange: {},
        purple: {},
        indigo: {},
      },
    },
    defaultVariants: {
      variant: "solid",
      colorVariant: "primary",
    },
    compoundVariants: [
      // solid / color
      {
        variant: "solid",
        colorVariant: "primary",
        className: colorVariants.solid.primary,
      },
      {
        variant: "solid",
        colorVariant: "secondary",
        className: colorVariants.solid.secondary,
      },
      {
        variant: "solid",
        colorVariant: "success",
        className: colorVariants.solid.success,
      },
      {
        variant: "solid",
        colorVariant: "warning",
        className: colorVariants.solid.warning,
      },
      {
        variant: "solid",
        colorVariant: "destructive",
        className: colorVariants.solid.destructive,
      },
      {
        variant: "solid",
        colorVariant: "info",
        className: colorVariants.solid.info,
      },
      {
        variant: "solid",
        colorVariant: "pink",
        className: colorVariants.solid.pink,
      },
      {
        variant: "solid",
        colorVariant: "orange",
        className: colorVariants.solid.orange,
      },
      {
        variant: "solid",
        colorVariant: "purple",
        className: colorVariants.solid.purple,
      },
      {
        variant: "solid",
        colorVariant: "indigo",
        className: colorVariants.solid.indigo,
      },

      // bordered / color
      {
        variant: "bordered",
        colorVariant: "primary",
        className: colorVariants.bordered.primary,
      },
      {
        variant: "bordered",
        colorVariant: "secondary",
        className: colorVariants.bordered.secondary,
      },
      {
        variant: "bordered",
        colorVariant: "success",
        className: colorVariants.bordered.success,
      },
      {
        variant: "bordered",
        colorVariant: "warning",
        className: colorVariants.bordered.warning,
      },
      {
        variant: "bordered",
        colorVariant: "destructive",
        className: colorVariants.bordered.destructive,
      },
      {
        variant: "bordered",
        colorVariant: "info",
        className: colorVariants.bordered.info,
      },
      {
        variant: "bordered",
        colorVariant: "pink",
        className: colorVariants.bordered.pink,
      },
      {
        variant: "bordered",
        colorVariant: "orange",
        className: colorVariants.bordered.orange,
      },
      {
        variant: "bordered",
        colorVariant: "purple",
        className: colorVariants.bordered.purple,
      },
      {
        variant: "bordered",
        colorVariant: "indigo",
        className: colorVariants.bordered.indigo,
      },
      // flat / color
      {
        variant: "flat",
        colorVariant: "primary",
        className: colorVariants.flat.primary,
      },
      {
        variant: "flat",
        colorVariant: "secondary",
        className: colorVariants.flat.secondary,
      },
      {
        variant: "flat",
        colorVariant: "success",
        className: colorVariants.flat.success,
      },
      {
        variant: "flat",
        colorVariant: "warning",
        className: colorVariants.flat.warning,
      },
      {
        variant: "flat",
        colorVariant: "destructive",
        className: colorVariants.flat.destructive,
      },
      {
        variant: "flat",
        colorVariant: "info",
        className: colorVariants.flat.info,
      },
      {
        variant: "flat",
        colorVariant: "pink",
        className: colorVariants.flat.pink,
      },
      {
        variant: "flat",
        colorVariant: "orange",
        className: colorVariants.flat.orange,
      },
      {
        variant: "flat",
        colorVariant: "purple",
        className: colorVariants.flat.purple,
      },
      {
        variant: "flat",
        colorVariant: "indigo",
        className: colorVariants.flat.indigo,
      },
    ],
  },
);

export interface BadgeProps
  extends React.ComponentProps<"div">, VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({
  className,
  variant,
  colorVariant,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, colorVariant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
