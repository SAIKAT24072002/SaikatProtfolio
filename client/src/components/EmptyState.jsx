import React from 'react';
import { AlertCircle } from 'lucide-react';

const EmptyState = ({ title = "No Content Found", message = "There is no information to display here at the moment." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
      <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-full text-slate-400 dark:text-slate-500 mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">{message}</p>
    </div>
  );
};

export default EmptyState;
