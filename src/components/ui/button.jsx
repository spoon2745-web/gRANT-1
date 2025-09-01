import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 group relative overflow-hidden", {
    variants: {
        variant: {
            default: "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 focus-visible:ring-blue-500/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/10 before:to-white/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
            destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 focus-visible:ring-red-500/50",
            outline: "border-2 border-gray-200 bg-white/80 backdrop-blur-md text-gray-700 shadow-sm hover:bg-white hover:border-blue-300 hover:text-blue-700 hover:shadow-md hover:scale-105 focus-visible:ring-blue-500/50",
            secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-sm hover:shadow-md hover:scale-105 hover:from-gray-200 hover:to-gray-300 focus-visible:ring-gray-500/50",
            ghost: "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 hover:scale-105 backdrop-blur-sm",
            link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700",
            premium: "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/50 hover:scale-105 focus-visible:ring-amber-500/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        },
        size: {
            default: "h-11 px-6 py-3 text-sm",
            sm: "h-9 px-4 py-2 text-xs rounded-lg",
            lg: "h-14 px-8 py-4 text-base rounded-2xl",
            icon: "size-11 rounded-xl",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? Slot : "button";
    return (<Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props}/>);
}
export { Button, buttonVariants };
