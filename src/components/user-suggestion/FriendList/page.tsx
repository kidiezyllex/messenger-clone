import React, { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { User } from "../../../../lib/entity-types";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Loading from "@/components/animation/Loading";
import { MessageCircleMore } from "lucide-react";
import { useRouter } from "next/navigation";
export default function FriendList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id;
  const router = useRouter();
  const fecthData = async () => {
    setLoading(true);
    const res = await axios.get(`/api/users/${userId}/friends`);
    setUsers(res?.data);
    setLoading(false);
  };
  useEffect(() => {
    if (status === "authenticated") {
      fecthData();
    }
  }, [userId]);
  const handleCreateConversation = async (user: User) => {
    try {
      const res = await axios.post(`/api/conversations`, {
        userId,
        friendId: user?.id,
        name: user?.name,
        isGroup: false,
        groupImage: "",
        members: [userId, user?.id],
      });
      if (res?.status === 200) {
        router.push(`/t/${res.data.id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return loading ? (
    <Loading></Loading>
  ) : (
    <ScrollArea className={"rounded-md"}>
      <div
        className={
          status === "loading" ? "hidden" : "flex flex-col gap-3 p-3 rounded-md"
        }
      >
        {users.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-md dark:bg-primary-foreground">
            <p className="font-medium text-sm">Lmao, bạn không có bạn bè.</p>
          </div>
        ) : null}
        {users &&
          users.map((user, index) => (
            <div
              key={index + user.id}
              className="flex items-center gap-3 p-4 rounded-md dark:bg-primary-foreground"
            >
              <Avatar className="w-11 h-11">
                <AvatarImage src={user?.image} />
                <AvatarFallback className="bg-blue-400 text-white border-2 border-blue-300 dark:border-secondary">
                  {user?.name[0]}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium text-sm flex-grow">{user?.name}</p>
              <Button
                onClick={() => handleCreateConversation(user)}
                className="flex flex-row gap-2 bg-blue-400 hover:bg-blue-400 text-white border-2 border-blue-300 hover:border-blue-300 dark:border-secondary"
              >
                Nhắn tin
                <MessageCircleMore className="h-4 w-4" />
              </Button>
            </div>
          ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
