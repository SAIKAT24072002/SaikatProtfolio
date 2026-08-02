import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FolderGit, 
  Mail, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon 
} from 'lucide-react';

const AdminLayout = ({ activeTab, setActiveTab, children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'profile', name: 'Profile Management', icon: User },
    { id: 'projects', name: 'Projects Management', icon: FolderGit },
    { id: 'skills', name: 'Skills Management', icon: Code },
    { id: 'experience', name: 'Experience Management', icon: Briefcase },
    { id: 'education', name: 'Education Management', icon: GraduationCap },
    { id: 'messages', name: 'Messages Inbox', icon: Mail },
    { id: 'settings', name: 'Admin Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-400">
            Admin Console
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
        </div>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav Menu Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-left transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-900/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="leading-snug">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
        {/* Theme Toggle within sidebar */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-5 w-5 text-yellow-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-5 w-5 text-slate-400" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-50 dark:bg-[#080d1a] flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 h-full">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile Drawer Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 md:hidden transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>

      {/* Dashboard Main Content area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header bar */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white dark:bg-[#0c1326] border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold font-sans text-slate-800 dark:text-white capitalize">
              {menuItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400">
              Admin
            </span>
          </div>
        </header>

        {/* Dashboard Panels container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
