import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

interface CallMessageProps {
  onCallClick: () => void;
}

export function CallMessage({ onCallClick }: CallMessageProps) {
  return (
    <div
      className="flex flex-row gap-2 items-center cursor-pointer"
      onClick={onCallClick}
    >
      <Button
        size="icon"
        variant="secondary"
        className="hover:bg-primary-foreground rounded-full"
      >
        <Video className="h-5 w-5 text-blue-500 " />
      </Button>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        Cuộc gọi đến
      </p>
    </div>
  );
}
