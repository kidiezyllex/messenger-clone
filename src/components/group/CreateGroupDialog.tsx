"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUploadThing } from "@/utils/uploadthing";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CameraIcon, SearchIcon, Users, X } from "lucide-react";
import { User } from "../../../lib/entity-types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Loading from "../animation/Loading";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Image from "next/image";

export function CreateGroupDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [groupName, setGroupName] = useState("");
  const [groupImageUrl, setGroupImageUrl] = useState("");
  const [userIdList, setUserIdList] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing("imageUploader");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/users/${userId}/friends`);
      setUsers(res?.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [userId, status]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const res = await startUpload([file]);
        if (res && res[0]) {
          setGroupImageUrl(res[0].url);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUserSelect = (userId: string) => {
    setUserIdList((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateConversation = async () => {
    try {
      const res = await axios.post(`/api/conversations`, {
        groupImage: groupImageUrl,
        userId,
        name: groupName,
        isGroup: true,
        members: userIdList,
        friendId: "",
      });
      if (res?.status === 200) {
        onClose();
        router.push(`/t/${res.data.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] w-[95%] h-[90%] overflow-y-auto flex flex-col gap-4 ">
        <DialogTitle className="h-fit pb-2 m-0 text-lg font-bold text-zinc-600 dark:text-zinc-300 border-b dark:border-b-zinc-700 border-b-zinc-300">
          Tạo nhóm
        </DialogTitle>
        <div className="flex flex-col space-y-4 mr-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              {groupImageUrl ? (
                <Image
                  src={groupImageUrl}
                  alt="Selected image"
                  width={100}
                  height={100}
                  className="rounded-full"
                  quality={70}
                />
              ) : (
                <CameraIcon className="h-4 w-4" />
              )}
            </Button>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
            <Input
              placeholder="Nhập tên nhóm..."
              className="flex-1"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div className="relative rounded-full flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Nhập tên, email"
              className="dark:bg-primary-foreground pl-9 text-sm rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className={"rounded-md"}>
            {loading ? (
              <Loading />
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="dark:bg-zinc-700 dark:hover:bg-zinc-700 bg-secondary border flex items-center gap-3 p-4 rounded-md cursor-pointer mb-2"
                >
                  <Checkbox
                    id={user.id}
                    checked={userIdList.includes(user.id)}
                    onCheckedChange={() => handleUserSelect(user.id)}
                    className="h-5 w-5"
                  />
                  <Avatar className="w-11 h-11">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-300 to-blue-500 text-white border-2 border-blue-300 dark:border-secondary select-none">
                      {user?.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-between flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{user?.name}</p>
                      <span className="text-xs text-muted-foreground"></span>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      {user?.email}
                    </p>
                  </div>
                </div>
              ))
            )}
            <ScrollBar
              orientation="vertical"
              className="dark:bg-primary-foreground bg-secondary"
            />{" "}
          </ScrollArea>
          {userIdList.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-600 dark:text-slate-300">Đã chọn:</h3>
              <div className="flex flex-wrap gap-2">
                {userIdList.map((id) => {
                  const user = users.find((u) => u.id === id);
                  return user ? (
                    <div
                      key={id}
                      className="dark:bg-zinc-700 dark:hover:bg-zinc-700 bg-secondary border text-primary-foreground rounded-full p-1 text-sm flex flex-row items-center gap-2"
                    >
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={user?.image} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-300 to-blue-500 text-white border-2 border-blue-300 dark:border-secondary select-none">
                          {user?.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sm dark:text-slate-300 text-slate-600 mr-2">
                        {user?.name}
                      </p>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex-grow items-end mr-4">
          <Button variant="outline" onClick={onClose}>
            Huỷ
            <X className="h-4 w-4 ml-2"></X>
          </Button>
          <Button
            onClick={handleCreateConversation}
            disabled={userIdList.length < 2 || !groupName}
            className="flex flex-row gap-2 bg-blue-400 hover:bg-blue-400 text-white border-2 border-blue-300 hover:border-blue-300 dark:border-secondary"
          >
            Tạo nhóm
            <Users className="h-4 w-4"></Users>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
