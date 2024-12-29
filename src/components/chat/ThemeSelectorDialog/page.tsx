import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "next-themes";
import useStore from "@/store/useStore";

const themes = [
  { name: "Light", value: "light", color: "#FFFFFF" },
  { name: "Dark", value: "dark", color: "#1F2937" },
  { name: "Red", value: "red", color: "#DC2626" },
  { name: "Rose", value: "rose", color: "#E11D48" },
  { name: "Blue", value: "blue", color: "#3B82F6" },
  { name: "Green", value: "green", color: "#22C55E" },
  { name: "Violet", value: "violet", color: "#6D28D9" },
  { name: "Yellow", value: "yellow", color: "#FACC15" },
  { name: "Orange", value: "orange", color: "#EA580C" },
];

interface ThemeSelectorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeSelectorDialog({
  isOpen,
  onClose,
}: ThemeSelectorDialogProps) {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const { setTheme } = useStore();
  const handleSave = () => {
    // setTheme(selectedTheme);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] w-[95%] h-[90%] flex flex-col">
        <DialogTitle className="h-fit pb-2 m-0 text-lg font-bold text-zinc-600 dark:text-zinc-300 border-b dark:border-b-zinc-700 border-b-zinc-300">
          Chọn chủ đề
        </DialogTitle>
        <ScrollArea className="flex-grow">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {themes.map((themeOption) => (
              <div
                key={themeOption.value}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedTheme === themeOption.value
                    ? "ring-2 ring-blue-500"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => setSelectedTheme(themeOption.value)}
              >
                <div
                  className="w-full h-20 rounded-md mb-2"
                  style={{ backgroundColor: themeOption.color }}
                />
                <p className="text-center font-medium">{themeOption.name}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
