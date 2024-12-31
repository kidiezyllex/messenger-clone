'use client'

import { useState } from 'react'
import Image from "next/image"
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Download from "yet-another-react-lightbox/plugins/download"
import "yet-another-react-lightbox/styles.css"
import { ZoomIn } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface ImageMessageProps {
  image: string;
}

export function ImageMessage({ image }: ImageMessageProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative w-auto mb-2 group">
      <div className="relative">
        <Image
          src={image}
          alt="Message Image"
          width={0}
          height={0}
          sizes="100vw"
          className="rounded-lg max-h-44 w-auto object-contain cursor-pointer"
          style={{
            width: "auto",
            height: "auto",
          }}
          onClick={() => setOpen(true)}
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setOpen(true)}
        >
          <ZoomIn className="h-4 w-4" />
          <span className="sr-only">Xem chi tiết ảnh</span>
        </Button>
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: image }]}
        plugins={[Zoom, Download]}
        zoom={{
          maxZoomPixelRatio: 5,
          zoomInMultiplier: 2,
        }}
      />
    </div>
  );
}

