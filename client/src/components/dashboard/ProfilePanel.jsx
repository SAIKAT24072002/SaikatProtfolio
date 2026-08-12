import React, { useState, useEffect } from 'react';
import { User, Globe, FileUp, Check } from 'lucide-react';
import portfolioService from '../../services/portfolioService';

const ProfilePanel = () => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    about: '',
    socialLinks: {
      github: '',
      linkedin: '',
      email: '',
      twitter: ''
    }
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [status, setStatus] = useState({ type: null, text: '' });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await portfolioService.getProfile();
        if (profile) {
          setFormData({
            name: profile.name || '',
            title: profile.title || '',
            bio: profile.bio || '',
            about: profile.about || '',
            socialLinks: {
              github: profile.socialLinks?.github || '',
              linkedin: profile.socialLinks?.linkedin || '',
              email: profile.socialLinks?.email || '',
              twitter: profile.socialLinks?.twitter || ''
            }
          });
          setAvatarUrl(profile.avatar || '');
          setResumeUrl(profile.resume || '');
        }
      } catch (err) {
        setStatus({ type: 'error', text: 'Failed to retrieve profile configurations.' });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const field = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, text: '' });
    try {
      const updated = await portfolioService.updateProfile(formData);
      setStatus({ type: 'success', text: 'Profile configurations updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Failed to save profile details.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatarFile) return;
    setUploadingAvatar(true);
    setStatus({ type: null, text: '' });

    const data = new FormData();
    data.append('avatar', avatarFile);

    try {
      const url = await portfolioService.uploadAvatar(data);
      setAvatarUrl(url);
      setAvatarFile(null);
      setStatus({ type: 'success', text: 'Avatar uploaded and updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Avatar upload failed.' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    setUploadingResume(true);
    setStatus({ type: null, text: '' });

    const data = new FormData();
    data.append('resume', resumeFile);

    try {
      const url = await portfolioService.uploadResume(data);
      setResumeUrl(url);
      setResumeFile(null);
      setStatus({ type: 'success', text: 'Resume PDF uploaded and updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Resume upload failed.' });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleResumeFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) {
      e.target.value = '';
      setResumeFile(null);
      setStatus({ type: 'error', text: 'Please select a valid PDF resume.' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      e.target.value = '';
      setResumeFile(null);
      setStatus({ type: 'error', text: 'Resume PDF must be 10 MB or smaller.' });
      return;
    }

    setResumeFile(file);
    setStatus({ type: null, text: '' });
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500"></div></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      
      {/* Left side: Profile Info form */}
      <div className="lg:col-span-8 space-y-6">
        <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
            <User className="h-5 w-5 text-primary-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">General Information</h3>
          </div>

          {status.type === 'success' && status.text.includes('Profile') && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm border border-emerald-100 dark:border-emerald-950/30 flex items-center gap-1.5">
              <Check className="h-4.5 w-4.5" />
              {status.text}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Professional Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Short Bio (Hero Section)</label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="form-input resize-none"
              required
            ></textarea>
          </div>

          <div>
            <label className="form-label">Detailed About (About Section)</label>
            <textarea
              name="about"
              rows="5"
              value={formData.about}
              onChange={handleChange}
              className="form-input"
              required
            ></textarea>
          </div>

          {/* Social Links Sub Group */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
            <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Globe className="h-4.5 w-4.5 text-primary-500" />
              Social Web Profiles
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">GitHub Profile URL</label>
                <input
                  type="url"
                  name="social_github"
                  value={formData.socialLinks.github}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="form-label text-xs">LinkedIn Profile URL</label>
                <input
                  type="url"
                  name="social_linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="form-label text-xs">Contact Email Address</label>
                <input
                  type="email"
                  name="social_email"
                  value={formData.socialLinks.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label className="form-label text-xs">Twitter/X Profile URL</label>
                <input
                  type="url"
                  name="social_twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl"
          >
            {saving ? 'Saving Profile Details...' : 'Save General Info'}
          </button>
        </form>
      </div>

      {/* Right side: Image & File Upload panels */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Avatar Card panel */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm flex flex-col items-center">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 self-start">Avatar Settings</h3>
          
          <div className="w-32 h-32 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-900 mb-4 shadow">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Image</div>
            )}
          </div>

          <form onSubmit={handleAvatarUpload} className="w-full space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="text-xs text-slate-500 w-full file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-200"
            />
            <button
              type="submit"
              disabled={uploadingAvatar || !avatarFile}
              className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-slate-800 dark:bg-slate-900 hover:bg-slate-950 rounded-xl disabled:opacity-50"
            >
              <FileUp className="h-3.5 w-3.5" />
              {uploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
            </button>
          </form>
        </div>

        {/* Resume Card panel */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Resume Attachment</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
            Upload a PDF (max 10 MB). Recruiters will automatically see the latest uploaded resume.
          </p>

          {resumeUrl && (
            <div className="p-3 mb-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold truncate max-w-[150px]">Current Resume PDF</span>
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-primary-500 font-bold hover:underline">
                View File
              </a>
            </div>
          )}

          <form onSubmit={handleResumeUpload} className="space-y-3">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleResumeFileChange}
              className="text-xs text-slate-500 w-full file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-200"
            />
            <button
              type="submit"
              disabled={uploadingResume || !resumeFile}
              className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-slate-800 dark:bg-slate-900 hover:bg-slate-950 rounded-xl disabled:opacity-50"
            >
              <FileUp className="h-3.5 w-3.5" />
              {uploadingResume ? 'Replacing...' : 'Upload PDF'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ProfilePanel;
