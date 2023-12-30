import { toast } from "@/components/ui/use-toast";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const launchToast = (
  title: string | undefined,
  description = "",
  variant: "destructive" | "success" | null = null
) => {
  if (!title) {
    return;
  }
  toast({
    variant,
    title,
    description,
  });
};
