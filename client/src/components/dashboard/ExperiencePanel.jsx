import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit2, Trash2 } from 'lucide-react';
import portfolioService from '../../services/portfolioService';
import { TableSkeleton } from '../SkeletonLoader';

const ExperiencePanel = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: null, text: '' });

  // View States
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form values
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentStatus, setCurrentStatus] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const loadExperiences = async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getExperiences();
      setExperiences(data);
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to retrieve experience timelines.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleEditClick = (exp) => {
    setEditingId(exp._id);
    setPosition(exp.position);
    setCompany(exp.company);
    setStartDate(exp.startDate ? exp.startDate.split('T')[0] : '');
    setEndDate(exp.endDate ? exp.endDate.split('T')[0] : '');
    setCurrentStatus(exp.currentStatus || false);
    setDescriptionInput(exp.description.join('\n'));
    setTechInput(exp.technologies ? exp.technologies.join(', ') : '');
    setDisplayOrder(exp.displayOrder || 0);
    setShowForm(true);
  };

  const handleNewClick = () => {
    setEditingId(null);
    setPosition('');
    setCompany('');
    setStartDate('');
    setEndDate('');
    setCurrentStatus(false);
    setDescriptionInput('');
    setTechInput('');
    setDisplayOrder(0);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this experience timeline item?")) {
      try {
        await portfolioService.deleteExperience(id);
        setStatus({ type: 'success', text: 'Experience deleted successfully!' });
        loadExperiences();
      } catch (err) {
        setStatus({ type: 'error', text: err.message || 'Failed to delete experience.' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, text: '' });

    const description = descriptionInput.split('\n').map(b => b.trim()).filter(Boolean);
    const technologies = techInput.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      position,
      company,
      startDate,
      endDate: currentStatus ? null : endDate,
      currentStatus,
      description,
      technologies,
      displayOrder
    };

    try {
      if (editingId) {
        await portfolioService.updateExperience(editingId, payload);
        setStatus({ type: 'success', text: 'Experience timeline saved successfully!' });
      } else {
        await portfolioService.createExperience(payload);
        setStatus({ type: 'success', text: 'Experience item created successfully!' });
      }
      setShowForm(false);
      loadExperiences();
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Failed to save experience details.' });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm animate-fade-in">
      
      <div className="flex justify-between items-center pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-6">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary-500" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {showForm ? (editingId ? 'Edit Work/Project Experience' : 'Add Experience Item') : 'Experiences Timeline Matrix'}
          </h3>
        </div>
        
        {!showForm && (
          <button
            onClick={handleNewClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            Add Experience
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

      {/* FORM VIEW */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mb-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Position / Role Title</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="form-input"
                required
                placeholder="e.g. MERN Developer Intern"
              />
            </div>
            <div>
              <label className="form-label">Company / Involvements</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="form-input"
                required
                placeholder="e.g. Acme Labs or Personal Projects"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-input"
                disabled={currentStatus}
                required={!currentStatus}
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="currentStatus"
                checked={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.checked)}
                className="h-5 w-5 rounded text-primary-600 border-slate-300 dark:border-slate-800"
              />
              <label htmlFor="currentStatus" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                I currently work here
              </label>
            </div>
          </div>

          <div>
            <label className="form-label">Bullet points description (One bullet per line)</label>
            <textarea
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              rows="4"
              className="form-input"
              required
              placeholder="- Built messaging endpoints...&#10;- Optimized Mongoose aggregations by 20%..."
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
                placeholder="React, Express, JWT, Bcrypt"
              />
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
              {saving ? 'Saving...' : 'Save Experience'}
            </button>
          </div>
        </form>
      )}

      {/* TABLE GRID VIEW */}
      {loading && !showForm ? (
        <TableSkeleton rows={3} />
      ) : (
        <div className="overflow-x-auto">
          {experiences.length === 0 ? (
            <div className="text-center py-6 text-sm text-slate-400 italic">No experiences added yet.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {experiences.map((exp) => (
                  <tr key={exp._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{exp.position}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{exp.company}</td>
                    <td className="py-3.5 px-4 text-xs font-mono">
                      {formatDate(exp.startDate)} - {exp.currentStatus ? 'Present' : formatDate(exp.endDate)}
                    </td>
                    <td className="py-3.5 px-4">{exp.displayOrder}</td>
                    <td className="py-3.5 px-4 text-right flex items-center justify-end gap-1.5 mt-0.5">
                      <button 
                        onClick={() => handleEditClick(exp)}
                        className="p-1.5 text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(exp._id)}
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

export default ExperiencePanel;
