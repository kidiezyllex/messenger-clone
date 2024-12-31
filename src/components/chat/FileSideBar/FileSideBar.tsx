import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Lightbox from "yet-another-react-lightbox";
import { Conversation } from "../../../../lib/entity-types";
import useStore from "@/store/useStore";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, File, FileText, ZoomIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";

export default function FileSidebar({
  conversation,
}: {
  conversation: Conversation;
}) {
  const { setShowFileSideBar } = useStore();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = conversation?.messages.filter(
    (message) => message?.image && message?.type === "image"
  );
  const files = conversation?.messages.filter((message) => message?.file);

  const lightboxImages = images.map((image) => ({ src: image.image }));

  return (
    <ScrollArea className="rounded-tl-xl rounded-bl-xl h-full">
      <div className="w-[320px] h-full min-h-screen flex flex-grow flex-col bg-secondary rounded-xl pr-2">
        {/* Header */}
        <div className="flex flex-row gap-3 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowFileSideBar(false);
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <p className="text-base font-semibold text-slate-600 dark:text-slate-300">
            File phương tiện và file
          </p>
        </div>
        {/* Image */}
        <div className="flex flex-col gap-2 px-4 py-2">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            File phương tiện
          </p>
          <div className="grid grid-cols-3 gap-1">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image?.image}
                  alt="Message Image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="rounded-lg max-h-52 h-full w-auto object-cover"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Nếu bạn không tìm thấy file phương tiện mình cần, hãy thử dùng ứng
            dụng di động Messenger.
          </p>
        </div>
        <div className="flex flex-col gap-2 px-4 py-2">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            File
          </p>
          <div className="flex flex-col">
            {files.map((file, index) => (
              <Link
                key={index}
                className="border-b dark:border-b-zinc-700 py-2 flex flex-row items-center gap-2"
                href={file?.file}
                target="_blank"
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-md bg-primary-foreground hover:bg-primary-foreground"
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {file?.fileName?.length > 23
                    ? file?.fileName?.slice(0, 23) + "..."
                    : file?.fileName}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <ScrollBar
          orientation="vertical"
          className="dark:bg-primary-foreground bg-secondary"
        />
      </div>
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxImages}
        index={currentImageIndex}
        plugins={[Zoom, Download]}
        zoom={{
          maxZoomPixelRatio: 5,
          zoomInMultiplier: 2,
        }}
      />
    </ScrollArea>
  );
}

