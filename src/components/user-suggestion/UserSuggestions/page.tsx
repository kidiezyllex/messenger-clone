import React, { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { User } from "../../../../lib/entity-types";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/animation/Loading";
import UserProfileDialog from "@/components/user/UserProfileDialog/page";
export default function UserSuggestions() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const userId = (session?.user as any)?.id;
  const fecthData = async () => {
    setLoading(true);
    // Lấy danh sách Id yêu cầu kết bạn
    const res = await axios.get(`/api/friend-requests/sent/${userId}`);
    const receiverIds = res.data.map((item: any) => item.id);

    // Lấy danh sách Id đã gửi kết bạn
    const res2 = await axios.get(`/api/friend-requests/pending/${userId}`);
    const senderIds = res2.data.map((item: any) => item.id);
    const res3 = await axios.get(`/api/users`);
    const users = res3.data.filter((item: any) => {
      if (
        item.id !== userId &&
        !(receiverIds?.includes(item?.id) || senderIds?.includes(item?.id))
      )
        return item;
    });
    console.log(users);
    setUsers(users);
    setLoading(false);
  };
  useEffect(() => {
    if (status === "authenticated") {
      fecthData();
    }
  }, [userId]);
  const handleSendFriendRequest = async (
    senderId: string,
    receiverId: string
  ) => {
    try {
      const res = await axios.post(`/api/friend-requests`, {
        senderId: senderId,
        receiverId: receiverId,
      });
      if (res?.status === 200) {
        toast({
          variant: "default",
          title: "Thành công!",
          description: "Đã gửi lời mời kết bạn!",
        });
        fecthData();
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: "Gửi lời mời không thành công!",
      });
    }
  };
  return loading ? (
    <Loading></Loading>
  ) : (
    <ScrollArea className="rounded-md">
      <div
        className={
          status === "loading" ? "hidden" : "flex flex-col gap-3 p-3 rounded-md"
        }
      >
        {users.map((user, index) => (
          <div
            key={index + user.id}
            className="flex items-center gap-3 p-4 rounded-md dark:bg-primary-foreground"
          >
            <Avatar
              className="w-11 h-11 cursor-pointer"
              onClick={() => {
                setSelectedUser(user);
                setOpen(true);
              }}
            >
              <AvatarImage src={user?.image} />
              <AvatarFallback className="bg-blue-400 text-slate-600 dark:text-slate-300 border-2 border-blue-300 dark:border-secondary">
                {user?.name[0]}
              </AvatarFallback>
            </Avatar>
            <p className="font-medium text-sm flex-grow text-slate-600 dark:text-slate-300">
              {user?.name}
            </p>
            <Button
              onClick={() => handleSendFriendRequest(userId, user?.id)}
              className="bg-blue-400 hover:bg-blue-400 text-white border-2 border-blue-300 hover:border-blue-300 dark:border-secondary"
            >
              Kết bạn
            </Button>
          </div>
        ))}
        <UserProfileDialog
          user={selectedUser}
          open={open}
          setOpen={setOpen}
        ></UserProfileDialog>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
