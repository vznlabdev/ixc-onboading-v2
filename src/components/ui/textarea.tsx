import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-[80px] w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm",
        "placeholder:text-gray-500",
        "focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
        "resize-y",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
