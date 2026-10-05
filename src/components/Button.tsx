import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonClass = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none min-h-12 select-none",
  {
    variants: {
      variant: {
        primary: "bg-spark text-ink shadow-soft hover:shadow-lift hover:-translate-y-0.5",
        secondary: "bg-light text-ink border-2 border-ink/15 hover:border-ink/40",
        sky: "bg-sky text-ink hover:bg-sky/85",
        ink: "bg-ink text-light hover:bg-ink/90",
        ghost: "text-ink hover:bg-ink/5",
      },
      size: {
        md: "px-6 text-[17px]",
        lg: "px-8 text-lg min-h-14",
        sm: "px-4 text-base min-h-11",
      },
      block: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonClass>;

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant, size, block, ...props }, ref) => (
    <button ref={ref} className={cn(buttonClass({ variant, size, block }), className)} {...props} />
  ),
);
Button.displayName = "Button";
