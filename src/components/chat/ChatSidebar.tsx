"use client";
import { useState } from "react";
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
import { Conversation, User } from "../../../lib/entity-types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  return (
    <ScrollArea className="rounded-tl-xl rounded-bl-xl">
      <div className="w-[320px] h-full flex flex-grow flex-col bg-secondary rounded-xl pr-2">
        {/* Header */}
        <div className="p-4 border-b border-zinc-700">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={
                  conversation?.isGroup
                    ? conversation?.groupImage
                    : user2?.image
                }
              />

              <AvatarFallback className="bg-blue-400 text-white border-2 border-blue-300 dark:border-secondary">
                {conversation?.isGroup ? conversation?.name : user2?.name[0]}
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
              className="rounded-full bg-primary-foreground"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-primary-foreground"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {/* Chat Info Section */}
        <div className="border-b border-zinc-700">
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
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 hover:bg-zinc-700"
              >
                <Pin className="w-4 h-4 mr-3" />
                Xem tin nhắn đã ghim
              </Button>
            </div>
          )}
        </div>

        {/* Customize Section */}
        <div className="border-b border-zinc-700">
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
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 hover:bg-zinc-700"
              >
                <PenSquare className="w-4 h-4 mr-3" />
                Đổi tên đoạn chat
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 hover:bg-zinc-700"
              >
                <ImageIcon className="w-4 h-4 mr-3" />
                Thay đổi ảnh
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 hover:bg-zinc-700"
              >
                <Palette className="w-4 h-4 mr-3" />
                Đổi chủ đề
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 hover:bg-zinc-700"
              >
                <Smile className="w-4 h-4 mr-3" />
                Thay đổi biểu tượng cảm xúc
              </Button>
            </div>
          )}
        </div>

        <div className="border-b border-zinc-700">
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

                      <AvatarFallback className="bg-blue-400 border-2 border-blue-300 dark:border-secondary">
                        {conversation?.isGroup ? member?.name : user2?.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-semibold">{member.name}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Ellipsis className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 hover:bg-zinc-700"
              >
                <Users className="w-4 h-4 mr-3" />
                Thêm người
              </Button>
            </div>
          )}
        </div>

        {/* Files Section */}
        <div className="border-b border-zinc-700">
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
                className="w-full justify-start text-slate-600 dark:text-slate-300 hover:bg-zinc-700"
              >
                <ImageIcon className="w-4 h-4 mr-3" />
                File phương tiện
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 hover:bg-zinc-700"
              >
                <FileIcon className="w-4 h-4 mr-3" />
                File
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 hover:bg-zinc-700"
              >
                <Link2 className="w-4 h-4 mr-3" />
                Liên kết
              </Button>
            </div>
          )}
        </div>

        {/* Privacy Section */}
        <div className="border-b border-zinc-700">
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
                className="w-full justify-start text-slate-600 dark:text-slate-300 hover:bg-zinc-700"
              >
                <BellOff className="w-4 h-4 mr-3" />
                <div className="flex flex-col items-start">
                  <span>Bật thông báo</span>
                  <span className="text-xs text-gray-400">Tắt vô thời hạn</span>
                </div>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 dark:text-slate-300 hover:bg-zinc-700"
              >
                <Flag className="w-4 h-4 mr-3" />
                <div className="flex flex-col items-start">
                  <span>Báo cáo</span>
                  <span className="text-xs text-gray-400">
                    Báo cáo cuộc trò chuyện
                  </span>
                </div>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:bg-zinc-700"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Rời nhóm
              </Button>
            </div>
          )}
        </div>
      </div>
      <ScrollBar
        orientation="vertical"
        className="dark:bg-primary-foreground bg-secondary"
      />
    </ScrollArea>
  );
}
