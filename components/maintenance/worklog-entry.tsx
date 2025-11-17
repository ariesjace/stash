'use client';

import { formatDistanceToNow } from 'date-fns';

export interface WorklogItem {
  id: string;
  date: Date | string; // allow string from backend
  update: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  technician?: string;
}

export function WorklogEntry({ date, update, status, technician }: WorklogItem) {
  // Convert string to Date safely
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) {
    // Invalid date fallback
    return (
      <div className="pb-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4 relative">
        <div className="text-sm text-red-500 dark:text-red-400">Invalid date</div>
        <p className="text-sm text-gray-900 dark:text-white">{update}</p>
        {technician && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            By {technician}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="pb-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4 relative">
      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 dark:bg-blue-400" />
      <div className="flex items-start justify-between gap-2 mb-2">
        <time className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {formatDistanceToNow(parsedDate, { addSuffix: true })}
        </time>
        <span className="inline-block px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-900 dark:text-white">{update}</p>
      {technician && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          By {technician}
        </p>
      )}
    </div>
  );
}
