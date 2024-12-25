import { createUploadthing, type FileRouter } from "uploadthing/next";
const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("file url", file.url);
  }),
  // Hỗ trợ .txt, .mp4, .mov, .mp3, .wav và .pdf
  productPdf: f(["text", "video", "audio", "pdf"]).onUploadComplete(
    async ({ metadata, file }) => {
      const userId = (metadata as any).userId;
      console.log("file url", file.url);
    }
  ),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
