import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Edit2, Trash2 } from 'lucide-react';
import portfolioService from '../../services/portfolioService';
import { TableSkeleton } from '../SkeletonLoader';

const EducationPanel = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: null, text: '' });
  
  // View states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form values
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const loadEducation = async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getEducation();
      setEducation(data);
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to retrieve education records.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEducation();
  }, []);

  const handleEditClick = (edu) => {
    setEditingId(edu._id);
    setDegree(edu.degree);
    setInstitution(edu.institution);
    setStartYear(edu.startYear);
    setEndYear(edu.endYear);
    setDescription(edu.description || '');
    setDisplayOrder(edu.displayOrder || 0);
    setShowForm(true);
  };

  const handleNewClick = () => {
    setEditingId(null);
    setDegree('');
    setInstitution('');
    setStartYear('');
    setEndYear('');
    setDescription('');
    setDisplayOrder(0);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this education item?")) {
      try {
        await portfolioService.deleteEducation(id);
        setStatus({ type: 'success', text: 'Education record deleted successfully!' });
        loadEducation();
      } catch (err) {
        setStatus({ type: 'error', text: err.message || 'Failed to delete record.' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, text: '' });

    const payload = {
      degree,
      institution,
      startYear,
      endYear,
      description,
      displayOrder
    };

    try {
      if (editingId) {
        await portfolioService.updateEducation(editingId, payload);
        setStatus({ type: 'success', text: 'Education record saved successfully!' });
      } else {
        await portfolioService.createEducation(payload);
        setStatus({ type: 'success', text: 'Education record created successfully!' });
      }
      setShowForm(false);
      loadEducation();
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Failed to save education record.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm animate-fade-in">
      
      <div className="flex justify-between items-center pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary-500" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {showForm ? (editingId ? 'Edit Academic Milestone' : 'Add Education Record') : 'Education Timeline Matrix'}
          </h3>
        </div>
        
        {!showForm && (
          <button
            onClick={handleNewClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            Add Education
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
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mb-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Degree Name</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="form-input"
                required
                placeholder="e.g. B.Tech in Computer Science"
              />
            </div>
            <div>
              <label className="form-label">Institution / University</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="form-input"
                required
                placeholder="e.g. ABC University"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Start Year</label>
              <input
                type="text"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                className="form-input"
                required
                placeholder="e.g. 2020"
              />
            </div>
            <div>
              <label className="form-label">End Year</label>
              <input
                type="text"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                className="form-input"
                required
                placeholder="e.g. 2024 or Present"
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

          <div>
            <label className="form-label">Brief Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="form-input"
              placeholder="Focused on algorithm designs, data structures, and database architectures..."
            ></textarea>
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
              {saving ? 'Saving...' : 'Save Education'}
            </button>
          </div>
        </form>
      )}

      {/* TABLE MATRIX VIEW */}
      {loading && !showForm ? (
        <TableSkeleton rows={2} />
      ) : (
        <div className="overflow-x-auto">
          {education.length === 0 ? (
            <div className="text-center py-6 text-sm text-slate-400 italic">No education records available.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                  <th className="py-3 px-4">Degree</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Years</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {education.map((edu) => (
                  <tr key={edu._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{edu.degree}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{edu.institution}</td>
                    <td className="py-3 px-4 font-mono text-xs">{edu.startYear} - {edu.endYear}</td>
                    <td className="py-3 px-4">{edu.displayOrder}</td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-1.5 mt-0.5">
                      <button 
                        onClick={() => handleEditClick(edu)}
                        className="p-1.5 text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="h-4.5 w-4.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(edu._id)}
                        className="p-1.5 text-slate-500 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
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

export default EducationPanel;
