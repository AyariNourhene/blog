import axios from 'axios';

const API = import.meta.env.VITE_API_URL + '/articles';

export const fetchArticles = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createArticle = async (data, token) => {
  const res = await axios.post(API, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteArticle = async (id, token) => {
  const res = await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
