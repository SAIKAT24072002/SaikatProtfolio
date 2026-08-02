import React from 'react';
import { FolderGit, Code, Briefcase, GraduationCap, Mail } from 'lucide-react';

const OverviewPanel = ({ stats = {}, recentMessages = [], recentProjects = [], setActiveTab }) => {
  const cards = [
    { label: 'Total Projects', value: stats.projects || 0, icon: FolderGit, color: 'text-primary-500 bg-primary-50 dark:bg-primary-950/20' },
    { label: 'Total Skills', value: stats.skills || 0, icon: Code, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { label: 'Experiences', value: stats.experiences || 0, icon: Briefcase, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/20' },
    { label: 'Education Milestones', value: stats.education || 0, icon: GraduationCap, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/20' },
    { label: 'Total Messages', value: stats.messages || 0, icon: Mail, color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/20' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Metrics list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
              <div className={`p-3.5 rounded-xl ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-dark-textMuted font-medium">{card.label}</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1 font-sans">{card.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid feeds: Recent Messages and Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Messages Card */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Recent Messages</h3>
            <button 
              onClick={() => setActiveTab('messages')}
              className="text-xs font-semibold text-primary-500 hover:text-primary-600 dark:text-primary-400"
            >
              View All
            </button>
          </div>

          <div className="pt-4 divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
            {recentMessages.length === 0 ? (
              <p className="text-sm text-slate-400 italic py-4">No recent messages.</p>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg._id} className="pt-4 first:pt-0 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{msg.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      msg.status === 'New' 
                        ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/40' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{msg.email} &bull; {new Date(msg.createdAt).toLocaleDateString()}</span>
                  <p className="text-sm text-slate-600 dark:text-dark-textMuted line-clamp-2 mt-1">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Projects Card */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Featured Projects</h3>
            <button 
              onClick={() => setActiveTab('projects')}
              className="text-xs font-semibold text-primary-500 hover:text-primary-600 dark:text-primary-400"
            >
              Manage
            </button>
          </div>

          <div className="pt-4 space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-sm text-slate-400 italic py-4">No projects uploaded.</p>
            ) : (
              recentProjects.map((proj) => (
                <div key={proj._id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden flex-shrink-0">
                    {proj.imageUrl ? (
                      <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No Img</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{proj.title}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{proj.technologies.join(', ')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OverviewPanel;
