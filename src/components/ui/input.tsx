import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm",
        "placeholder:text-gray-500",
        "focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  )
}

export { Input }
