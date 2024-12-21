"use client";
import { SearchIcon, UserRoundPlus, UsersRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../../lib/entity-types";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function UserSuggestionList() {
  const [users, setUsers] = useState<User[]>([]);
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  useEffect(() => {
    const fecthData = async () => {
      const res = await axios.get(`/api/users`);
      setUsers(res.data);
    };
    fecthData();
  }, [userId]);
  return (
    <div className="flex flex-col h-full w-96 p-2 py-4 bg-secondary rounded-xl gap-3 border">
      <div className="flex flex-col mx-2 gap-2">
        <h1 className="text-xl font-bold text-zinc-600 dark:text-zinc-300">
          Người dùng đề xuất
        </h1>
        <div className="flex flex-row gap-1 justify-center items-center">
          <div className="relative rounded-full flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Tìm kiếm bằng email..." className="pl-8" />
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-auto space-y-2">
        {users.map((user, index) => (
          <div
            key={index + user.id}
            className={
              "dark:hover:bg-zinc-700  flex items-center gap-3 p-3 rounded-md cursor-pointer"
            }
          >
            <Avatar className="w-11 h-11">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="bg-blue-400 text-white border-2 border-blue-300 dark:border-secondary">
                {user?.name[0]}
              </AvatarFallback>
            </Avatar>
            <p className="font-medium text-sm flex-grow">{user?.name}</p>
            <Button className="bg-blue-400 hover:bg-blue-400 text-white border-2 border-blue-300 hover:border-blue-300 dark:border-secondary">
              Kết bạn
            </Button>
          </div>
        ))}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
