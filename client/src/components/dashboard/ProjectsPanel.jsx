import React, { useState, useEffect } from 'react';
import { FolderGit, Plus, Edit2, Trash2, Globe, Sparkles } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import portfolioService from '../../services/portfolioService';
import { TableSkeleton } from '../SkeletonLoader';

const ProjectsPanel = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: null, text: '' });
  
  // View states: 'list' or 'form'
  const [view, setView] = useState('list');
  const [editingId, setEditingId] = useState(null);
  
  // Form values
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [challenges, setChallenges] = useState('');
  const [solutions, setSolutions] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getProjects();
      setProjects(data);
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to retrieve projects list.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (view === 'form' && !editingId) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  }, [title, view, editingId]);

  const handleEditClick = (project) => {
    setEditingId(project._id);
    setTitle(project.title);
    setSlug(project.slug);
    setShortDescription(project.shortDescription);
    setFullDescription(project.fullDescription);
    setTechInput(project.technologies.join(', '));
    setFeaturesInput(project.features.join('\n'));
    setChallenges(project.challenges || '');
    setSolutions(project.solutions || '');
    setGithubUrl(project.githubUrl || '');
    setLiveUrl(project.liveUrl || '');
    setFeatured(project.featured || false);
    setDisplayOrder(project.displayOrder || 0);
    setImageFile(null);
    setView('form');
  };

  const handleNewClick = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setShortDescription('');
    setFullDescription('');
    setTechInput('');
    setFeaturesInput('');
    setChallenges('');
    setSolutions('');
    setGithubUrl('');
    setLiveUrl('');
    setFeatured(false);
    setDisplayOrder(0);
    setImageFile(null);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await portfolioService.deleteProject(id);
        setStatus({ type: 'success', text: 'Project deleted successfully!' });
        loadProjects();
      } catch (err) {
        setStatus({ type: 'error', text: err.message || 'Failed to delete project.' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, text: '' });

    if (!imageFile && !editingId) {
      setStatus({ type: 'error', text: 'Please select a project cover screenshot.' });
      setSaving(false);
      return;
    }

    const data = new FormData();
    data.append('title', title);
    data.append('slug', slug);
    data.append('shortDescription', shortDescription);
    data.append('fullDescription', fullDescription);
    data.append('challenges', challenges);
    data.append('solutions', solutions);
    data.append('githubUrl', githubUrl);
    data.append('liveUrl', liveUrl);
    data.append('featured', featured);
    data.append('displayOrder', displayOrder);
    
    // Convert inputs to array params
    const techs = techInput.split(',').map(item => item.trim()).filter(Boolean);
    techs.forEach(tech => data.append('technologies', tech));

    const features = featuresInput.split('\n').map(item => item.trim()).filter(Boolean);
    features.forEach(feat => data.append('features', feat));

    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingId) {
        await portfolioService.updateProject(editingId, data);
        setStatus({ type: 'success', text: 'Project configurations saved successfully!' });
      } else {
        await portfolioService.createProject(data);
        setStatus({ type: 'success', text: 'Project created successfully!' });
      }
      setView('list');
      loadProjects();
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Failed to save project.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading && view === 'list') {
    return <TableSkeleton />;
  }

  return (
    <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm animate-fade-in">
      
      {/* Panel Headers & Actions */}
      <div className="flex justify-between items-center pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-6">
        <div className="flex items-center gap-2">
          <FolderGit className="h-5 w-5 text-primary-500" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {view === 'list' ? 'Projects Showcase List' : editingId ? 'Edit Project Details' : 'Create New Project'}
          </h3>
        </div>
        
        {view === 'list' ? (
          <button
            onClick={handleNewClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        ) : (
          <button
            onClick={() => setView('list')}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:underline"
          >
            Back to List
          </button>
        )}
      </div>

      {status.type && (
        <div className={`p-4 rounded-xl text-sm border mb-4 ${
          status.type === 'error'
            ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400'
            : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400'
        }`}>
          {status.text}
        </div>
      )}

      {/* VIEW: Projects Grid Table List */}
      {view === 'list' && (
        <div className="overflow-x-auto">
          {projects.length === 0 ? (
            <div className="text-center py-10 text-sm text-slate-400 italic">No projects found. Create one.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {projects.map((proj) => (
                  <tr key={proj._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{proj.title}</td>
                    <td className="py-3.5 px-4 font-mono text-xs">{proj.slug}</td>
                    <td className="py-3.5 px-4">
                      {proj.featured ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 rounded-full border border-amber-200/50">
                          <Sparkles className="h-3 w-3 fill-amber-600" />
                          Yes
                        </span>
                      ) : 'No'}
                    </td>
                    <td className="py-3.5 px-4">{proj.displayOrder}</td>
                    <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2 mt-1">
                      <button 
                        onClick={() => handleEditClick(proj)}
                        className="p-1.5 text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(proj._id)}
                        className="p-1.5 text-slate-500 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* VIEW: Projects Creation and Edit Form */}
      {view === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-4.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                required
                placeholder="e.g. Real-Time Chat App"
              />
            </div>
            <div>
              <label className="form-label">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="form-input font-mono"
                required
                placeholder="real-time-chat-app"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">GitHub Repository URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400"><FaGithub className="h-4.5 w-4.5" /></div>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="form-input pl-11"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
            <div>
              <label className="form-label">Live Demo Website URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400"><Globe className="h-4.5 w-4.5" /></div>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="form-input pl-11"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Short Description (Cards view)</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="form-input"
              required
              placeholder="Provide a brief summary paragraph..."
            />
          </div>

          <div>
            <label className="form-label">Detailed Full Description (Details View)</label>
            <textarea
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              rows="5"
              className="form-input"
              required
              placeholder="Provide extensive project architectural descriptions..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Technologies (Comma separated)</label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="form-input"
                required
                placeholder="React, Node.js, Express, Socket.io"
              />
            </div>
            <div>
              <label className="form-label">Key Features (One feature per line)</label>
              <textarea
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                rows="3"
                className="form-input"
                placeholder="Real-time message routing&#10;Private room generation&#10;BCrypt authentication"
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Challenges Faced (Optional)</label>
              <textarea
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                rows="3"
                className="form-input"
                placeholder="Scaling socket events under heavy node load..."
              ></textarea>
            </div>
            <div>
              <label className="form-label">Implemented Solutions (Optional)</label>
              <textarea
                value={solutions}
                onChange={(e) => setSolutions(e.target.value)}
                rows="3"
                className="form-input"
                placeholder="Integrating redis cache and horizontal clusters..."
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="form-label">Display Order (Sorting)</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="form-input"
                min="0"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-5 w-5 rounded text-primary-600 border-slate-300 dark:border-slate-800"
              />
              <label htmlFor="featured" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Mark as Featured Project
              </label>
            </div>
            <div>
              <label className="form-label">Project Cover Screenshot</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="text-xs text-slate-500 w-full file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-200"
                required={!editingId}
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80 mt-6">
            <button
              type="button"
              onClick={() => setView('list')}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:underline"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl"
            >
              {saving ? 'Saving Project...' : 'Save Project'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

export default ProjectsPanel;
