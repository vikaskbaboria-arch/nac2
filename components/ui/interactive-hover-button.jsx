import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function InteractiveHoverButton({
  children,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        "group relative overflow-hidden rounded-full   px-6 py-2 font-semibold text-white transition-all duration-300  ",
        className
      )}
      {...props}
    >
      {/* soft animated background */}
      <span className="absolute inset-0 rounded-full  opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* glow ring */}
      <span className="absolute -inset-[1px] rounded-fullopacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

      {/* default text */}
      <span className="relative z-10 flex items-center gap-2 transition-all duration-300 group-hover:-translate-x-2 group-hover:opacity-0">
        {children}
      </span>

      {/* hover text */}
      <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight className="h-4 w-4 translate-x-[-6px] transition-transform duration-300 group-hover:translate-x-0" />
      </span>
    </button>
  );
}

