import React from 'react';

const Footer = ({ profile }) => {
  const currentYear = new Date().getFullYear();
  const name = profile?.name || "SAIKAT KHAMRAI";

  return (
    <footer className="border-t border-slate-200/50 dark:border-slate-800/80 bg-white/50 dark:bg-dark-bg/50 backdrop-blur-md py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300">
          {name}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          &copy; {currentYear} All Rights Reserved. Built with MERN Stack.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
