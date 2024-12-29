import { Button } from "@/components/ui/button";
import {
  File,
  FileArchive,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  X,
} from "lucide-react";
import React from "react";

export default function SelectedFile({
  selectedFile,
  setSelectedFile,
}: {
  selectedFile: File;
  setSelectedFile: (val: any) => void;
}) {
  const renderFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "text/plain":
        return <FileText className="h-4 w-4" />;
      case "image/jpeg":
      case "image/png":
      case "image/gif":
      case "image/webp":
        return <FileImage className="h-4 w-4" />;
      case "audio/mpeg":
      case "audio/wav":
      case "audio/ogg":
        return <FileAudio className="h-4 w-4" />;
      case "video/mp4":
      case "video/mpeg":
      case "video/quicktime":
        return <FileVideo className="h-4 w-4" />;
      case "application/pdf":
        return <File className="h-4 w-4" />;
      case "application/zip":
      case "application/x-rar-compressed":
        return <FileArchive className="h-4 w-4" />;
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return <FileSpreadsheet className="h-4 w-4" />;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };
  return (
    <div className="relative mb-2 dark:bg-zinc-700 p-4 rounded-lg">
      <div className="flex flex-row items-center gap-2">
        {renderFileTypeIcon(selectedFile.type)}
        <p className="text-sm font-semibold dark:text-slate-300 text-slate-600">
          {selectedFile.name}
        </p>
      </div>
      <Button
        size="icon"
        variant="secondary"
        className="h-6 w-6 absolute top-2 right-2 rounded-full bg-zinc-800 dark:hover:bg-primary-foreground"
        onClick={() => setSelectedFile(null)}
      >
        <X className="h-4 w-4 text-white" />
      </Button>
    </div>
  );
}
