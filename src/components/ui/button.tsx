import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-button text-primary-foreground hover:bg-gradient-hover shadow-button hover:shadow-button-hover hover:scale-105 transition-all duration-300",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-button hover:shadow-button-hover hover:scale-105 transition-all duration-300",
        outline:
          "border-2 border-primary-light/40 bg-gradient-soft text-primary hover:bg-primary-light/30 hover:border-primary hover:shadow-button transition-all duration-300 backdrop-blur-sm",
        secondary:
          "bg-gradient-soft text-secondary-foreground hover:bg-muted shadow-button hover:shadow-button-hover hover:scale-105 transition-all duration-300",
        ghost: "hover:bg-primary-light/20 hover:text-primary hover:shadow-button transition-all duration-300",
        link: "text-primary underline-offset-4 hover:underline transition-all duration-200",
        cta: "bg-gradient-button text-primary-foreground hover:bg-gradient-hover shadow-glow hover:shadow-[0_0_40px_hsl(200_100%_70%_/_0.4)] transition-all duration-300 animate-glow-pulse hover:scale-105",
        glass: "bg-primary-light/20 text-primary border border-primary-light/40 shadow-inset hover:bg-primary-light/30 hover:shadow-button transition-all duration-300 backdrop-blur-sm",
        floating: "bg-card border border-border/20 text-foreground shadow-lg hover:shadow-glow hover:-translate-y-1 transition-all duration-300",
        orange: "bg-gradient-button text-primary-foreground hover:bg-gradient-hover shadow-button hover:shadow-button-hover hover:scale-105 transition-all duration-300",
        "orange-outline": "border-2 border-primary text-primary bg-gradient-soft hover:bg-primary hover:text-primary-foreground shadow-button hover:shadow-button-hover hover:scale-105 transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
