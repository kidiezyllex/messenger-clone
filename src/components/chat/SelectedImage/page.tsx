import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function SelectedImage({
  selectedImage,
  setSelectedImage,
}: {
  selectedImage: File;
  setSelectedImage: (val: any) => void;
}) {
  return (
    <div className="relative mb-2 dark:bg-zinc-700 p-4 rounded-lg">
      <Image
        src={URL.createObjectURL(selectedImage)}
        alt="Selected image"
        width={100}
        height={100}
        className="rounded-lg"
      />
      <Button
        size="icon"
        variant="secondary"
        className="h-6 w-6 absolute top-2 right-2 rounded-full bg-zinc-800 dark:hover:bg-primary-foreground"
        onClick={() => setSelectedImage(null)}
      >
        <X className="h-4 w-4 text-white" />
      </Button>
    </div>
  );
}
