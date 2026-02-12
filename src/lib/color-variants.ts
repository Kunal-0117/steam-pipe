const solid = {
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  info: 'bg-info text-info-foreground',
  foreground: 'bg-foreground text-background',
  pink: 'bg-pink-500 text-pink-100',
  orange: 'bg-orange-500 text-orange-100',
  purple: 'bg-purple-500 text-purple-100',
  indigo: 'bg-indigo-500 text-indigo-100',
};

const bordered = {
  primary: 'bg-transparent border-primary text-primary',
  secondary: 'bg-transparent border-secondary text-secondary',
  success: 'bg-transparent border-success text-success',
  warning: 'bg-transparent border-warning text-warning',
  destructive: 'bg-transparent border-destructive text-destructive',
  info: 'bg-transparent border-info text-info',
  foreground: 'bg-transparent border-foreground text-foreground',
  pink: 'bg-transparent border-pink-500 text-pink-100',
  orange: 'bg-transparent border-orange-500 text-orange-100',
  purple: 'bg-transparent border-purple-500 text-purple-100',
  indigo: 'bg-transparent border-indigo-500 text-indigo-100',
};

const flat = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary/40 text-secondary-foreground border-secondary',
  success: 'bg-success/10 text-success border-success/10',
  warning: 'bg-warning/10 text-warning border-warning/10',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-info/10 text-info border-info/20',
  foreground: 'bg-foreground/10 text-background border-foreground/20',
  pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};

const ghost = {
  primary: 'border-primary text-primary',
  secondary: 'border-secondary text-secondary',
  success: 'border-success text-success',
  warning: 'border-warning text-warning',
  destructive: 'border-destructive text-destructive',
  info: 'border-info text-info',
  foreground: 'border-foreground text-foreground hover:!bg-foreground',
  pink: 'border-pink-500 text-pink-100',
  orange: 'border-orange-500 text-orange-100',
  purple: 'border-purple-500 text-purple-100',
  indigo: 'border-indigo-500 text-indigo-100',
};

export const colorVariants = {
  solid,
  bordered,
  flat,
  ghost,
};
