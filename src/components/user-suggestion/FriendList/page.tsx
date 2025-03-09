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
import UserProfileDialog from "@/components/user/UserProfileDialog/page";
import useStore from "@/store/useStore";
import { Button as MuiButton } from "@mui/material";
export default function FriendList() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id;
  const router = useRouter();
  const { setSelectConversationId } = useStore();
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
        setSelectConversationId(res.data.id);
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
          status === "loading" ? "hidden" : "flex flex-col px-2 gap-2 rounded-md"
        }
      >
        {users.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-md dark:bg-primary-foreground bg-background">
            <p className="font-medium text-sm text-slate-600 dark:text-slate-300 italic">
              Lmao, bạn không có bạn bè.
            </p>
          </div>
        ) : null}
        {users &&
          users.map((user, index) => (
            <div
              key={index + user.id}
              className="border dark:bg-zinc-700/20 dark:hover:bg-zinc-700 bg-background flex items-center gap-3 p-4 rounded-md cursor-pointer flex-grow"
            >
              <Avatar
                className="w-11 h-11 cursor-pointer"
                onClick={() => {
                  setSelectedUser(user);
                  setOpen(true);
                }}
              >
                <AvatarImage src={user?.image} />
                <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-slate-600 dark:text-slate-300 border-2 border-blue-300 dark:border-secondary text-sm">
                  {user?.name[0].toUpperCase() + (user?.name[1] ? user?.name[1].toUpperCase() : '')}
                </AvatarFallback>
              </Avatar>
              <p
                className="font-semibold text-sm flex-grow text-slate-600 dark:text-slate-300"
                onClick={() => {
                  setSelectedUser(user);
                  setOpen(true);
                }}
              >
                {user?.name && user.name.length > 15
                  ? `${user.name.substring(0, 15)}...`
                  : user?.name}
              </p>
              <MuiButton
                className="flex-shrink-0 text-xs px-5"
                onClick={() => handleCreateConversation(user)}
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: '#60a5fa',
                  '&:hover': {
                    backgroundColor: '#3b82f6',
                  },
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '12px',
                }}
              >
                Nhắn tin
                <MessageCircleMore className="ml-2 h-4 w-4" />
              </MuiButton>
            </div>
          ))}
      </div>
      <ScrollBar orientation="vertical" />
      <UserProfileDialog
        user={selectedUser}
        open={open}
        setOpen={setOpen}
      ></UserProfileDialog>
    </ScrollArea>
  );
}
