import { Quote } from "lucide-react";

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
  return (
    <div className="flex flex-col gap-2 relative">
      {replyText && (
        <div className="flex flex-row gap-2 items-center text-sm text-zinc-600 dark:text-zinc-300 p-2 rounded-md bg-background dark:bg-zinc-900 italic">
          <Quote className="h-4 w-4 text-zinc-600 dark:text-zinc-300 italic" />
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {replyText}
          </p>
        </div>
      )}
      {taggedUsers &&
        taggedUsers.map((tag) => (
          <p className="text-sm text-blue-500 font-semibold cursor-pointer">
            @{tag}
          </p>
        ))}
      <p className="text-base text-zinc-600 dark:text-zinc-300">{text}</p>
    </div>
  );
}
