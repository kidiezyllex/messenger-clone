import { Button } from "@/components/ui/button";
import { Download, Eye, FileText, View } from "lucide-react";
import Link from "next/link";

interface FileMessageProps {
  file: string;
  fileName?: string;
}

export function FileMessage({ file, fileName }: FileMessageProps) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Link href={file} target="_blank">
        <Button
          size="icon"
          variant="secondary"
          className="hover:bg-primary-foreground rounded-full"
        >
          <FileText className="h-5 w-5 text-blue-500" />
        </Button>
      </Link>

      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        {fileName || "File đính kèm"}
      </p>
    </div>
  );
}
