import { Search, SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const conversations = [
  {
    id: 1,
    name: "Trần Nam",
    lastMessage: "Bạn: tối rồi nói",
    time: "50 phút",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "FDC Fan Doran Club",
    lastMessage: "zin: 1 card 4 con ni",
    time: "1 giờ",
    avatar: "/placeholder.svg",
  },
  // Add more conversations as needed
];

export function ConversationList() {
  return (
    <div className="flex flex-col h-full w-96 p-2 py-4 bg-secondary rounded-xl gap-3">
      <div className="flex flex-col mx-2 gap-2">
        <h1 className="text-2xl font-bold">Đoạn chat</h1>
        <div className="relative rounded-full">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Tìm kiếm trên Messenger" className="pl-8" />
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-auto space-y-2">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="flex items-center gap-3 p-4 hover:bg-zinc-700 rounded-md pointer-events-auto"
          >
            <Avatar className="border border-blue-500 w-12 h-12">
              <AvatarImage src={conversation.avatar} />
              <AvatarFallback>{conversation.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="font-medium">{conversation.name}</p>
                <span className="text-xs text-muted-foreground">
                  {conversation.time}
                </span>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {conversation.lastMessage}
              </p>
            </div>
          </div>
        ))}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
