import React, { useState } from 'react';
import { Settings, ShieldCheck, AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';

const SettingsPanel = () => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, text: '' });

  // Password visibility states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus({ type: null, text: '' });

    if (newPassword && newPassword !== confirmPassword) {
      setStatus({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = { currentPassword };
      if (email.trim()) payload.email = email;
      if (newPassword) payload.newPassword = newPassword;

      await api.put('/auth/update-credentials', payload);
      setStatus({ type: 'success', text: 'Admin security settings updated successfully.' });
      setEmail('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Failed to update credentials.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm animate-fade-in">
      
      <div className="flex items-center gap-2 pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-6">
        <Settings className="h-5 w-5 text-primary-500" />
        <h3 className="text-base font-bold text-slate-800 dark:text-white">Admin Security Settings</h3>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        
        {status.type && (
          <div className={`p-4 rounded-xl text-sm border ${
            status.type === 'error'
              ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400'
              : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400'
          }`}>
            {status.type === 'error' ? (
              <div className="flex items-start gap-1.5"><AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" /> <span>{status.text}</span></div>
            ) : (
              <div className="flex items-start gap-1.5"><Check className="h-5 w-5 flex-shrink-0 mt-0.5" /> <span>{status.text}</span></div>
            )}
          </div>
        )}

        <div>
          <label className="form-label">Update Login Email Address (Optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="new-email@portfolio.local"
            disabled={submitting}
          />
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-primary-500" />
            Change Credentials Password
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* New Password */}
            <div>
              <label className="form-label">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input pr-10"
                  placeholder="••••••••"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex="-1"
                >
                  {showNew ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="form-label">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input pr-10"
                  placeholder="••••••••"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex="-1"
                >
                  {showConfirm ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Verify Current Password */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <label className="form-label text-red-500">Verify Current Password (Required to save changes)</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="form-input border-red-200 focus:ring-red-500 pr-10"
              required
              placeholder="Enter current password"
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              tabIndex="-1"
            >
              {showCurrent ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
        >
          {submitting ? 'Saving Settings...' : 'Save Settings'}
        </button>

      </form>

    </div>
  );
};

export default SettingsPanel;
