const API_URL = 'http://localhost:8000';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'So‘rov bajarilmadi');
  }
  return data;
};

export const getReelState = (reelId, userId) =>
  request(`/reel/${encodeURIComponent(reelId)}?userId=${encodeURIComponent(userId || '')}`);

export const toggleLike = (reelId, userId) =>
  request(`/reel/${encodeURIComponent(reelId)}/like`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });

export const toggleRepost = (reelId, userId) =>
  request(`/reel/${encodeURIComponent(reelId)}/repost`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });

export const toggleSave = (reelId, userId) =>
  request(`/reel/${encodeURIComponent(reelId)}/save`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });

export const addComment = (reelId, userId, text) =>
  request(`/reel/${encodeURIComponent(reelId)}/comments`, {
    method: 'POST',
    body: JSON.stringify({ userId, text }),
  });

export const getComments = (reelId) =>
  request(`/reel/${encodeURIComponent(reelId)}/comments`);
