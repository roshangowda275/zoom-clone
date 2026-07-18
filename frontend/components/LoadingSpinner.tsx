import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  message?: string;
  size?: "sm" | "md" | "lg";
};

const SIZE_MAP = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export default function LoadingSpinner({
  message = "Loading...",
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <Loader2 className={`${SIZE_MAP[size]} animate-spin text-primary`} />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  );
}