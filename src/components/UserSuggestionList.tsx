"use client";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import UserSuggestions from "./user-suggestion/UserSuggestions";
import UserRequestSent from "./user-suggestion/UserRequestSent";
import UserPendingRequest from "./user-suggestion/UserPendingRequest";
import FriendList from "./user-suggestion/FriendList";
export function UserSuggestionList() {
  const [activated, setActivated] = useState("suggestion");
  const renderTab = () => {
    switch (activated) {
      case "suggestion":
        return <UserSuggestions />;
      case "requested":
        return <UserRequestSent />;
      case "pendingRequest":
        return <UserPendingRequest />;
      case "friend":
        return <FriendList />;
      default:
        return null;
    }
  };
  return (
    <div className="flex flex-col h-full w-96 p-2 py-4 bg-secondary rounded-xl gap-3 border">
      <div className="flex flex-col mx-2 gap-2">
        <h1 className="text-lg font-bold text-zinc-600 dark:text-zinc-300">
          Người dùng đề xuất
        </h1>
        <div className="flex flex-row gap-1 justify-center items-center">
          <div className="relative rounded-full flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm bằng email..."
              className="dark:bg-primary-foreground pl-8"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full justify-center px-4">
        <p
          onClick={() => setActivated("suggestion")}
          className={
            activated === "suggestion"
              ? "border-b-2 border-blue-500 cursor-pointer text-sm font-semibold"
              : "border-b-2 border-secondary cursor-pointer text-sm font-semibold"
          }
        >
          Đề xuất
        </p>
        <p
          onClick={() => setActivated("requested")}
          className={
            activated === "requested"
              ? "border-b-2 border-blue-500 cursor-pointer text-sm font-semibold"
              : "border-b-2 border-secondary cursor-pointer text-sm font-semibold"
          }
        >
          Đã gửi
        </p>
        <p
          onClick={() => setActivated("pendingRequest")}
          className={
            activated === "pendingRequest"
              ? "border-b-2 border-blue-500 cursor-pointer text-sm font-semibold"
              : "border-b-2 border-secondary cursor-pointer text-sm font-semibold"
          }
        >
          Lời mời kết bạn
        </p>
        <p
          onClick={() => setActivated("friend")}
          className={
            activated === "friend"
              ? "border-b-2 border-blue-500 cursor-pointer text-sm font-semibold"
              : "border-b-2 border-secondary cursor-pointer text-sm font-semibold"
          }
        >
          Bạn bè
        </p>
      </div>
      {renderTab()}
    </div>
  );
}
