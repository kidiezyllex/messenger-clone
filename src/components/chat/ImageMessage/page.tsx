import Image from "next/image";

interface ImageMessageProps {
  image: string;
}

export function ImageMessage({ image }: ImageMessageProps) {
  return (
    <div className="relative max-h-52 w-auto mb-2">
      <Image
        src={image}
        alt="Message Image"
        width={0}
        height={0}
        sizes="100vw"
        className="rounded-lg max-h-52 w-auto object-contain"
        style={{
          width: "auto",
          height: "auto",
        }}
      />
    </div>
  );
}
