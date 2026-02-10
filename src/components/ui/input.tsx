import { cn } from "@/lib/utils";

export function Input({ className, ...props }: any) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-black",
        className
      )}
      {...props}
    />
  );
}
