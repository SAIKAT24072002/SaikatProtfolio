import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import OverviewPanel from '../components/dashboard/OverviewPanel';
import ProfilePanel from '../components/dashboard/ProfilePanel';
import ProjectsPanel from '../components/dashboard/ProjectsPanel';
import SkillsPanel from '../components/dashboard/SkillsPanel';
import ExperiencePanel from '../components/dashboard/ExperiencePanel';
import EducationPanel from '../components/dashboard/EducationPanel';
import MessagesPanel from '../components/dashboard/MessagesPanel';
import SettingsPanel from '../components/dashboard/SettingsPanel';
import api from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    education: 0,
    messages: 0
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/auth/dashboard-stats');
      setStats(response.data.stats);
      setRecentMessages(response.data.recentMessages);
      setRecentProjects(response.data.recentProjects);
    } catch (err) {
      console.error("Failed to load analytics dashboard statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchDashboardStats();
    }
  }, [activeTab]);

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewPanel 
            stats={stats} 
            recentMessages={recentMessages} 
            recentProjects={recentProjects} 
            setActiveTab={setActiveTab}
          />
        );
      case 'profile':
        return <ProfilePanel />;
      case 'projects':
        return <ProjectsPanel />;
      case 'skills':
        return <SkillsPanel />;
      case 'experience':
        return <ExperiencePanel />;
      case 'education':
        return <EducationPanel />;
      case 'messages':
        return <MessagesPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <div className="text-sm">Tab Panel Not Found</div>;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {loading && activeTab === 'overview' ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500"></div>
        </div>
      ) : (
        renderActivePanel()
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
