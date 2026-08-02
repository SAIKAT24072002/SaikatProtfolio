import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="rounded-xl border border-slate-200/50 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 p-5 space-y-4 animate-pulse">
      <div className="aspect-video w-full rounded-lg bg-slate-200 dark:bg-slate-800"></div>
      <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800"></div>
      <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
      <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-800"></div>
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-800"></div>
        <div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-800"></div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full overflow-hidden border border-slate-200 dark:border-slate-800 rounded-lg animate-pulse">
      <div className="bg-slate-100 dark:bg-slate-800 h-10 w-full"></div>
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ListSkeleton = ({ items = 4 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50">
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-2 w-1/2 rounded bg-slate-200 dark:bg-slate-800"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse max-w-4xl mx-auto py-8">
      <div className="h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-800"></div>
      <div className="w-full aspect-[21/9] rounded-xl bg-slate-200 dark:bg-slate-800"></div>
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
        <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-800"></div>
      </div>
    </div>
  );
};
