"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Bell,
  Pin,
  PenSquare,
  ImageIcon,
  Palette,
  Smile,
  Users,
  FileIcon,
  Link2,
  BellOff,
  Flag,
  LogOut,
  Ellipsis,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Conversation, Message, User } from "../../../lib/entity-types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeSelectorDialog } from "./ThemeSelectorDialog/page";
import useStore from "@/store/useStore";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { PinnedMessageDialog } from "./PinnedMessageDialog/page";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
export default function ChatSidebar({
  conversation,
  user2,
}: {
  conversation: Conversation;
  user2: User;
}) {
  const [sections, setSections] = useState({
    info: true,
    customize: true,
    members: true,
    files: true,
    privacy: true,
  });
  const { setShowFileSideBar } = useStore();
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const conversationId = usePathname().split("/")[2];
  const [pinnedMessages, setPinnedMessages] = useState<Message[]>([]);
  const { data: session, status } = useSession();

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/conversations/${conversationId}`);
      setPinnedMessages(res.data.pinnedMessages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      conversationId !== "" &&
      conversationId !== "new-account" &&
      status === "authenticated"
    ) {
      fetchData();
    }
  }, [status, conversationId]);
  return (
    <ScrollArea className="rounded-tl-xl rounded-bl-xl">
      <div className="w-[320px] h-full min-h-screen flex flex-grow flex-col bg-secondary rounded-xl pr-2">
        {/* Header */}
        <div className="p-4 border-b dark:border-b-zinc-700 border-b-zinc-300">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={
                  conversation?.isGroup
                    ? conversation?.groupImage
                    : user2?.image
                }
              />

              <AvatarFallback className="bg-gradient-to-r from-blue-300 to-blue-500 text-white border-2 border-blue-300 dark:border-secondary select-none">
                {conversation?.isGroup ? conversation?.name[0] : user2?.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-zinc-600 dark:text-zinc-300">
                {conversation?.isGroup
                  ? `Nhóm: ${conversation?.name}`
                  : user2?.name}
              </h2>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
            </div>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-primary-foreground dark:hover:bg-zinc-700 border"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-primary-foreground dark:hover:bg-zinc-700 border"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Chat Info Section */}
        <div className="border-b dark:border-b-zinc-700 border-b-zinc-300">
          <Button
            variant="ghost"
            className="w-full px-4 py-3 flex items-center justify-between"
            onClick={() => toggleSection("info")}
          >
            <span>Thông tin về đoạn chat</span>
            {sections.info ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
          {sections.info && (
            <div className="px-4 py-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-600 dark:text-slate-300 dark:hover:bg-zinc-700 hover:bg-white"
                  >
                    <Pin className="w-4 h-4 mr-3" />
                    Xem tin nhắn đã ghim
                  </Button>
                </DialogTrigger>
                <PinnedMessageDialog
                  pinnedMessages={pinnedMessages}
                  userId={(session?.user as any)?.id}
                />
              </Dialog>
            </div>
          )}
        </div>

        {/* Customize Section */}
        <div className="border-b dark:border-b-zinc-700 border-b-zinc-300">
          <Button
            variant="ghost"
            className="w-full px-4 py-3 flex items-center justify-between"
            onClick={() => toggleSection("customize")}
          >
            <span>Tùy chỉnh đoạn chat</span>
            {sections.customize ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
          {sections.customize && (
            <div className="px-4 py-2 space-y-1">
              {conversation?.isGroup && (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-600 dark:text-slate-300 dark:hover:bg-zinc-700 hover:bg-white"
                  >
                    <PenSquare className="w-4 h-4 mr-3" />
                    Đổi tên đoạn chat
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-600 dark:text-slate-300 dark:hover:bg-zinc-700 hover:bg-white"
                  >
                    <ImageIcon className="w-4 h-4 mr-3" />
                    Thay đổi ảnh
                  </Button>
                </>
              )}
              <Button
                onClick={() => setIsThemeDialogOpen(true)}
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 dark:hover:bg-zinc-700 hover:bg-white"
              >
                <Palette className="w-4 h-4 mr-3" />
                Đổi chủ đề
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 dark:hover:bg-zinc-700 hover:bg-white"
              >
                <Smile className="w-4 h-4 mr-3" />
                Thay đổi biểu tượng cảm xúc
              </Button>
            </div>
          )}
        </div>

        {conversation?.isGroup && (
          <div className="border-b dark:border-b-zinc-700 border-b-zinc-300">
            <Button
              variant="ghost"
              className="w-full px-4 py-3 flex items-center justify-between"
              onClick={() => toggleSection("members")}
            >
              <span>Thành viên trong đoạn chat</span>
              {sections.members ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </Button>
            {sections.members && (
              <div className="flex flex-col gap-2 px-4 py-2">
                {conversation?.users?.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between group text-slate-600 dark:text-slate-300"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarImage
                          src={
                            conversation?.isGroup ? member?.image : user2?.image
                          }
                        />

                        <AvatarFallback className="bg-gradient-to-r from-blue-300 to-blue-500 text-white border-2 border-blue-300 dark:border-secondary select-none">
                          {conversation?.isGroup
                            ? member?.name[0]
                            : user2?.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold">{member?.name}</p>
                        <p className="text-xs font-semibold">
                          {member?.id === conversation?.groupCreator?.id ? (
                            <span className="text-blue-500">Trưởng nhóm</span>
                          ) : (
                            <span className="text-muted-foreground">
                              Thành viên
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Ellipsis className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-600 dark:text-slate-300 dark:hover:bg-zinc-700 hover:bg-white"
                >
                  <Users className="w-4 h-4 mr-3" />
                  Thêm người
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Files Section */}
        <div className="border-b dark:border-b-zinc-700 border-b-zinc-300">
          <Button
            variant="ghost"
            className="w-full px-4 py-3 flex items-center justify-between"
            onClick={() => toggleSection("files")}
          >
            <span>File phương tiện, file và liên kết</span>
            {sections.files ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
          {sections.files && (
            <div className="px-4 py-2 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 dark:hover:bg-zinc-700 hover:bg-white"
                onClick={() => setShowFileSideBar(true)}
              >
                <ImageIcon className="w-4 h-4 mr-3" />
                File phương tiện
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 dark:hover:bg-zinc-700 hover:bg-white"
                onClick={() => setShowFileSideBar(true)}
              >
                <FileIcon className="w-4 h-4 mr-3" />
                File
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 dark:hover:bg-zinc-700 hover:bg-white"
                onClick={() => setShowFileSideBar(true)}
              >
                <Link2 className="w-4 h-4 mr-3" />
                Liên kết
              </Button>
            </div>
          )}
        </div>

        {/* Privacy Section */}
        <div>
          <Button
            variant="ghost"
            className="w-full px-4 py-3 flex items-center justify-between"
            onClick={() => toggleSection("privacy")}
          >
            <span>Quyền riêng tư và hỗ trợ</span>
            {sections.privacy ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
          {sections.privacy && (
            <div className="px-4 py-2 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 dark:hover:bg-zinc-700 hover:bg-white"
              >
                <BellOff className="w-4 h-4 mr-3" />
                <div className="flex flex-col items-start">
                  <span>Bật thông báo</span>
                  <span className="text-xs text-gray-400">Tắt vô thời hạn</span>
                </div>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 dark:hover:bg-zinc-700 hover:bg-white"
              >
                <Flag className="w-4 h-4 mr-3" />
                <div className="flex flex-col items-start">
                  <span>Báo cáo</span>
                  <span className="text-xs text-gray-400">
                    Báo cáo cuộc trò chuyện
                  </span>
                </div>
              </Button>
              {conversation?.isGroup && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 dark:hover:bg-zinc-700 hover:bg-white"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Rời nhóm
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <ScrollBar
        orientation="vertical"
        className="dark:bg-primary-foreground bg-secondary"
      />
      <ThemeSelectorDialog
        isOpen={isThemeDialogOpen}
        onClose={() => setIsThemeDialogOpen(false)}
      />
    </ScrollArea>
  );
}
