"use client";

import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface WorklogItem {
  _id: string;
  createdAt: Date | string | null;
  comment: string;
}

export function WorklogEntry({ createdAt, comment }: WorklogItem) {
  const parsedDate = createdAt ? new Date(createdAt) : null;

  return (
    <Card className="relative border-l-2 border-gray-200 dark:border-gray-700 pl-4">
      <div className="absolute w-3 h-3 rounded-full -left-[7px] top-3 bg-blue-500 dark:bg-blue-400" />
      <div className="flex justify-between items-center mb-2">
        <time className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {parsedDate
            ? formatDistanceToNow(parsedDate, { addSuffix: true })
            : "Unknown date"}
        </time>
      </div>
      <p className="text-sm text-gray-900 dark:text-white">{comment}</p>
    </Card>
  );
}
