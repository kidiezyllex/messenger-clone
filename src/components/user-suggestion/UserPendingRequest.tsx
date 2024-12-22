import React, { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { User } from "../../../lib/entity-types";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import Loading from "../animation/Loading";

export default function UserPendingRequest() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const userId = (session?.user as any)?.id;
  const fecthData = async () => {
    setLoading(true);
    const res = await axios.get(`/api/friend-requests/pending/${userId}`);
    setUsers(res?.data);
    console.log(res?.data);
    setLoading(false);
  };
  useEffect(() => {
    if (status === "authenticated") {
      fecthData();
    }
  }, [userId]);
  const handleAcceptFriendRequest = async (friendRequestId: string) => {
    try {
      const res = await axios.post(`/api/friend-requests/accept`, {
        friendRequestId,
        userId,
      });
      if (res?.status === 200) {
        toast({
          variant: "default",
          title: "Thành công!",
          description: "Đã chấp nhận lời mời kết bạn!",
        });
        fecthData();
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: "Lỗi!",
      });
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
            <p className="font-medium text-sm">Chưa có lời mời kết bạn.</p>
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
                onClick={() => handleAcceptFriendRequest(user?.friendRequestId)}
                className="bg-blue-400 hover:bg-blue-400 text-white border-2 border-blue-300 hover:border-blue-300 dark:border-secondary"
              >
                Chấp nhận
              </Button>
            </div>
          ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
