import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { isWithinTwoMinutes } from "../../../../lib/utils";

interface CallMessageProps {
  onCallClick: () => void;
  createdAt: Date;
}

export function CallMessage({ onCallClick, createdAt }: CallMessageProps) {
  return !isWithinTwoMinutes(createdAt, new Date()) ? (
    <div className="flex flex-row gap-2 items-center">
      <Button
        size="icon"
        variant="secondary"
        className="hover:bg-primary-foreground rounded-full"
        disabled
      >
        <Video className="h-5 w-5 text-muted-foreground" />
      </Button>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        Cuộc gọi đã kết thúc
      </p>
    </div>
  ) : (
    <div
      className="flex flex-row gap-2 items-center cursor-pointer"
      onClick={onCallClick}
    >
      <Button
        size="icon"
        variant="secondary"
        className="bg-primary-foreground rounded-full"
      >
        <Video className="h-5 w-5 text-green-500" />
      </Button>
      <p className="text-sm font-semibold text-slate-600 dark:text-green-500">
        Cuộc gọi đang diễn ra
      </p>
    </div>
  );
}
