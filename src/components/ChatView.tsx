import {
  Phone,
  Video,
  MoreVertical,
  Send,
  CirclePlus,
  Image,
  Sticker,
  SmilePlus,
  ThumbsUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export function ChatView() {
  return (
    <div className="flex h-full flex-1 flex-col flex-grow bg-secondary rounded-xl ml-4">
      <div className="flex items-center justify-between p-3 border-b border-b-zinc-700">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            className="rounded-full bg-secondary border border-blue-500"
          ></Button>
          <div>
            <h2 className="font-semibold">Trần Nam</h2>
            <p className="text-sm text-muted-foreground">
              Hoạt động 6 phút trước
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-violet-500 hover:text-violet-300"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-violet-500 hover:text-violet-300"
          >
            <Video className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-violet-500 hover:text-violet-300"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-auto space-y-2">
        {/* Chat messages would go here */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="rounded-lg bg-muted p-3">
              <p>Hey, how are you?</p>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="rounded-lg bg-primary p-3 text-primary-foreground">
              <p>Nma t éo biết quay chụp</p>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="rounded-lg bg-primary p-3 text-primary-foreground">
              <p>Nma video ông gắn giỏ hàng</p>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <div className="flex flex-row p-3">
        <div className="flex flex-row">
          <Button
            size="icon"
            variant="secondary"
            className="hover:bg-primary-foreground rounded-full"
          >
            <CirclePlus className="h-5 w-5 text-violet-500 " />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="hover:bg-primary-foreground rounded-full"
          >
            <Image className="h-5 w-5 text-violet-500 " />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="hover:bg-primary-foreground rounded-full"
          >
            <Sticker className="h-5 w-5 text-violet-500 " />
          </Button>
        </div>
        <div className="flex gap-2 flex-grow relative">
          <Input
            placeholder="Type a message..."
            className="flex-1 rounded-full"
          />
          <SmilePlus className="h-5 w-5 text-violet-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <Button
          size="icon"
          variant="secondary"
          className="hover:bg-primary-foreground rounded-full"
        >
          <ThumbsUp className="h-5 w-5 text-violet-500 " />
        </Button>
      </div>
    </div>
  );
}
