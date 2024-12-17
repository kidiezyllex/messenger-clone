"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { stickers } from "../../../lib/stickers";
export default function StickerBoard() {
  const [search, setSearch] = useState("");
  return (
    <DropdownMenuContent className="w-80 bg-zinc-900 p-0">
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sticker"
            className="pl-8 bg-zinc-800 border-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="w-full h-[300px] p-2">
        {stickers.map((pack) => (
          <div key={pack.id}>
            <h2 className="text-base font-semibold mb-2 col-span-full text-zinc-600 dark:text-zinc-300">
              {pack.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-4">
              {pack.value.map((sticker) => (
                <div key={sticker.id} className="aspect-square relative ">
                  <Image
                    src={sticker.url}
                    alt={`Sticker ${sticker.id}`}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </DropdownMenuContent>
  );
}
