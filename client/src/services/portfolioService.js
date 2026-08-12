import api, { apiGet } from './api';

const portfolioService = {
  // --- Profile ---
  getProfile: async () => {
    const response = await apiGet('/profile');
    return response.data.profile;
  },
  getResumeDownloadUrl: () => api.getUri({ url: '/profile/resume/download' }),
  updateProfile: async (data) => {
    const response = await api.put('/profile', data);
    return response.data.profile;
  },
  uploadAvatar: async (formData) => {
    const response = await api.post('/profile/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.avatarUrl;
  },
  uploadResume: async (formData) => {
    const response = await api.post('/profile/upload-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.resumeUrl;
  },

  // --- Projects ---
  getProjects: async () => {
    const response = await apiGet('/projects');
    return response.data.projects;
  },
  getProjectBySlug: async (slug) => {
    const response = await apiGet(`/projects/${slug}`);
    return response.data.project;
  },
  createProject: async (formData) => {
    const response = await api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.project;
  },
  updateProject: async (id, formData) => {
    const response = await api.put(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.project;
  },
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // --- Skills ---
  getSkills: async () => {
    const response = await apiGet('/skills');
    return response.data.skills;
  },
  createSkill: async (data) => {
    const response = await api.post('/skills', data);
    return response.data.skill;
  },
  updateSkill: async (id, data) => {
    const response = await api.put(`/skills/${id}`, data);
    return response.data.skill;
  },
  deleteSkill: async (id) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },

  // --- Experiences ---
  getExperiences: async () => {
    const response = await apiGet('/experiences');
    return response.data.experiences;
  },
  createExperience: async (data) => {
    const response = await api.post('/experiences', data);
    return response.data.experience;
  },
  updateExperience: async (id, data) => {
    const response = await api.put(`/experiences/${id}`, data);
    return response.data.experience;
  },
  deleteExperience: async (id) => {
    const response = await api.delete(`/experiences/${id}`);
    return response.data;
  },

  // --- Education ---
  getEducation: async () => {
    const response = await apiGet('/education');
    return response.data.education;
  },
  createEducation: async (data) => {
    const response = await api.post('/education', data);
    return response.data.educationItem;
  },
  updateEducation: async (id, data) => {
    const response = await api.put(`/education/${id}`, data);
    return response.data.educationItem;
  },
  deleteEducation: async (id) => {
    const response = await api.delete(`/education/${id}`);
    return response.data;
  }
};

export default portfolioService;
