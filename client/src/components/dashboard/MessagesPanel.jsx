import React, { useState, useEffect } from 'react';
import { Mail, Check, Trash2, Search, Calendar, RefreshCw } from 'lucide-react';
import messageService from '../../services/messageService';
import { TableSkeleton } from '../SkeletonLoader';

const MessagesPanel = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: null, text: '' });
  const [expandedId, setExpandedId] = useState(null);

  // Filter toolbar states
  const [searchInput, setSearchInput] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const loadMessages = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await messageService.getMessages(filters);
      setMessages(data);
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to retrieve inbox messages.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    loadMessages({ search: searchInput, from: fromDate, to: toDate });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setFromDate('');
    setToDate('');
    loadMessages({});
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await messageService.updateMessageStatus(id, newStatus);
      setStatus({ type: 'success', text: `Message status updated to ${newStatus}.` });
      loadMessages({ search: searchInput, from: fromDate, to: toDate });
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Failed to update message status.' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await messageService.deleteMessage(id);
        setStatus({ type: 'success', text: 'Message deleted successfully.' });
        loadMessages({ search: searchInput, from: fromDate, to: toDate });
      } catch (err) {
        setStatus({ type: 'error', text: err.message || 'Failed to delete message.' });
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    const msg = messages.find(m => m._id === id);
    // Auto-mark as Read if it was New
    if (msg && msg.status === 'New') {
      handleStatusChange(id, 'Read');
    }
  };

  // Convert Date strings to: DD Aug 2026 • 2:41 PM
  const formatMsgDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    
    return `${day} ${month} ${year} • ${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm animate-fade-in">
      
      {/* Panel Header */}
      <div className="flex items-center gap-2 pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-6">
        <Mail className="h-5 w-5 text-primary-500" />
        <h3 className="text-base font-bold text-slate-800 dark:text-white">Messages Inbox</h3>
      </div>

      {status.type && (
        <div className={`p-4 rounded-xl text-sm border mb-5 ${
          status.type === 'error'
            ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400'
            : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400'
        }`}>
          {status.text}
        </div>
      )}

      {/* FILTER TOOLBAR BAR */}
      <form onSubmit={handleApplyFilters} className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/80 rounded-xl p-4 mb-6 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Keyword Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search name, email, subject..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* From Date */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Calendar className="h-4 w-4" />
            </span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              title="From Date"
            />
          </div>

          {/* To Date */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Calendar className="h-4 w-4" />
            </span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              title="To Date"
            />
          </div>

        </div>

        {/* Buttons for applying / clearing */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium hover:underline"
          >
            Clear Filters
          </button>
          
          <button
            type="submit"
            className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </form>

      {/* MESSAGES LISTING */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-400 italic mb-4">No messages found for the selected filters.</p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-xs font-bold text-primary-600 dark:text-primary-400 border border-primary-500/20 hover:bg-primary-500/5 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            messages.map((msg) => {
              const isExpanded = expandedId === msg._id;
              const isNew = msg.status === 'New';
              return (
                <div 
                  key={msg._id} 
                  className={`rounded-xl border p-4 transition-all duration-200 ${
                    isNew 
                      ? 'border-l-4 border-l-primary-500 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 shadow-sm' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-transparent'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="cursor-pointer flex-1 min-w-0" onClick={() => toggleExpand(msg._id)}>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{msg.name}</span>
                        {isNew && (
                          <span className="px-2 py-0.5 text-[9px] font-bold text-primary-600 bg-primary-50 dark:bg-primary-950/30 rounded-full border border-primary-200/50">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-1 break-all">
                        {msg.email} &bull; {formatMsgDate(msg.createdAt)}
                      </p>
                    </div>

                    {/* Actions and Status Selection dropdown */}
                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                      
                      {/* Status Badges Select dropdown */}
                      <select
                        value={msg.status}
                        onChange={(e) => handleStatusChange(msg._id, e.target.value)}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none border border-slate-200 dark:border-slate-800 ${
                          msg.status === 'New' 
                            ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 border-red-200/50 dark:border-red-900/30'
                            : msg.status === 'Read'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30'
                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Read">Read</option>
                        <option value="Replied">Replied</option>
                      </select>

                      {/* Delete Action */}
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div className="mt-3 cursor-pointer" onClick={() => toggleExpand(msg._id)}>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <span className="text-xs text-slate-400 font-medium mr-1">Subject:</span>
                      {msg.subject}
                    </h4>
                  </div>

                  {/* Expanded Message content */}
                  {isExpanded ? (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-sm text-slate-600 dark:text-dark-textMuted leading-relaxed whitespace-pre-line break-words">
                      {msg.message}
                    </div>
                  ) : (
                    <div 
                      onClick={() => toggleExpand(msg._id)}
                      className="mt-1 text-xs text-slate-400 cursor-pointer truncate max-w-full hover:text-slate-500 transition-colors"
                    >
                      {msg.message}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
};

export default MessagesPanel;
