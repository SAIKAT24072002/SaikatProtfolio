import React, { useState, useEffect } from 'react';
import { Code, Plus, Edit2, Trash2 } from 'lucide-react';
import portfolioService from '../../services/portfolioService';
import { TableSkeleton } from '../SkeletonLoader';

const SkillsPanel = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: null, text: '' });
  
  // States
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Code');
  const [category, setCategory] = useState('Frontend');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getSkills();
      setSkills(data);
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to retrieve skills list.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleEditClick = (skill) => {
    setEditingId(skill._id);
    setName(skill.name);
    setIcon(skill.icon || 'Code');
    setCategory(skill.category);
    setDisplayOrder(skill.displayOrder || 0);
    setShowForm(true);
  };

  const handleNewClick = () => {
    setEditingId(null);
    setName('');
    setIcon('Code');
    setCategory('Frontend');
    setDisplayOrder(0);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await portfolioService.deleteSkill(id);
        setStatus({ type: 'success', text: 'Skill deleted successfully!' });
        loadSkills();
      } catch (err) {
        setStatus({ type: 'error', text: err.message || 'Failed to delete skill.' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setStatus({ type: null, text: '' });

    const payload = { name, icon, category, displayOrder };

    try {
      if (editingId) {
        await portfolioService.updateSkill(editingId, payload);
        setStatus({ type: 'success', text: 'Skill saved successfully!' });
      } else {
        await portfolioService.createSkill(payload);
        setStatus({ type: 'success', text: 'Skill created successfully!' });
      }
      setShowForm(false);
      loadSkills();
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Failed to save skill.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm animate-fade-in">
      
      <div className="flex justify-between items-center pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-6">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary-500" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {showForm ? (editingId ? 'Edit Skill' : 'Add New Skill') : 'Skills Matrix Grid'}
          </h3>
        </div>
        
        {!showForm && (
          <button
            onClick={handleNewClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            Add Skill
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

      {/* FORM: Create or Edit */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mb-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Skill Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
                placeholder="e.g. React.js"
              />
            </div>
            <div>
              <label className="form-label">Lucide Icon Name</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="form-input font-mono"
                required
                placeholder="Code, Server, Database, GitBranch"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input py-3"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
            <div>
              <label className="form-label">Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="form-input"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:underline"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg"
            >
              {saving ? 'Saving...' : 'Save Skill'}
            </button>
          </div>
        </form>
      )}

      {/* TABLE LIST */}
      {loading && !showForm ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="overflow-x-auto">
          {skills.length === 0 ? (
            <div className="text-center py-6 text-sm text-slate-400 italic">No skills listed yet.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Icon Name</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {skills.map((skill) => (
                  <tr key={skill._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{skill.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {skill.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-400">{skill.icon}</td>
                    <td className="py-3 px-4">{skill.displayOrder}</td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-1.5 mt-0.5">
                      <button 
                        onClick={() => handleEditClick(skill)}
                        className="p-1.5 text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(skill._id)}
                        className="p-1.5 text-slate-500 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
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

    </div>
  );
};

export default SkillsPanel;
