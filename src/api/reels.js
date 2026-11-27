import { api, API_URL } from './client';

// All reel requests go through the shared api client (token is added there)
export const getReels = (page = 1, limit = 5) => api.get(`/reels?page=${page}&limit=${limit}`);
export const getUserReels = (username, type = 'own') =>
  api.get(`/reels/user/${encodeURIComponent(username)}?type=${type}`);
export const createReel = (file, caption) => {
  const form = new FormData();
  form.append('video', file);
  form.append('caption', caption);
  return api.post('/reels', form);
};
export const deleteReel = (id) => api.delete(`/reels/${id}`);
export const toggleLike = (id) => api.post(`/reels/${id}/like`);
export const toggleSave = (id) => api.post(`/reels/${id}/save`);
export const toggleRepost = (id) => api.post(`/reels/${id}/repost`);
export const getComments = (id) => api.get(`/reels/${id}/comments`);
export const addComment = (id, text) => api.post(`/reels/${id}/comments`, { text });
export const toggleFollow = (userId) => api.post(`/user/${userId}/follow`);

// "/reels/<id>/video" -> full URL for <video src>
export const videoUrl = (reel) => `${API_URL}${reel.videoUrl}`;
