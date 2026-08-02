import api from './api';

const messageService = {
  sendMessage: async (data) => {
    const response = await api.post('/messages', data);
    return response.data;
  },
  
  getMessages: async (params = {}) => {
    const response = await api.get('/messages', { params });
    return response.data.messages;
  },
  
  updateMessageStatus: async (id, status) => {
    const response = await api.patch(`/messages/${id}`, { status });
    return response.data.message;
  },
  
  deleteMessage: async (id) => {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  }
};

export default messageService;
