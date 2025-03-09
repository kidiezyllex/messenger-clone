import UserProfileDialog from "@/components/user/UserProfileDialog/page";
import useStore from "@/store/useStore";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "../../../../lib/entity-types";

interface TextMessageProps {
  text: string;
  replyText?: string;
  taggedUsers?: string[];
}

export function TextMessage({
  text,
  replyText,
  taggedUsers,
}: TextMessageProps) {
  const { member } = useStore();
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedUser, setSelectedUser] = useState<User>();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (selectedTag) {
      const res = member.filter((user) => user?.name === selectedTag);
      setSelectedUser(res[0]);
    }
    if (selectedUser && selectedTag) setOpen(true);
    setSelectedTag("");
  }, [selectedTag]);

  return (
    <div className="flex flex-col gap-2 relative">
      {replyText && (
        <div className="flex flex-row gap-2 items-center text-sm text-zinc-600 dark:text-zinc-300 p-2 rounded-md dark:bg-zinc-900 italic border bg-secondary">
          <Quote className="h-4 w-4 text-zinc-600 dark:text-zinc-300 italic flex-shrink-0" />
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {replyText}
          </p>
        </div>
      )}
      {taggedUsers &&
        taggedUsers.map((tag, index) => (
          <p
            className="text-sm text-blue-500 font-semibold cursor-pointer hover:underline"
            onClick={() => setSelectedTag(tag)}
            key={index}
          >
            @{tag}
          </p>
        ))}
      <p className="text-base text-zinc-600 dark:text-zinc-300">{text}</p>
      <UserProfileDialog
        user={selectedUser}
        open={open}
        setOpen={setOpen}
      ></UserProfileDialog>
    </div>
  );
}
