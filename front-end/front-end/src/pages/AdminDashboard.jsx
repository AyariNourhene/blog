import { useEffect, useState, useContext } from 'react';
import { fetchArticles, createArticle, deleteArticle } from '../services/articleServices';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const { user } = useContext(AuthContext);

  const loadArticles = async () => {
    const data = await fetchArticles();
    setArticles(data);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createArticle(form, user.token);
    setForm({ title: '', content: '' });
    loadArticles();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this article?')) {
      await deleteArticle(id, user.token);
      loadArticles();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Create Article Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Create Article</button>
      </form>

      {/* Article List */}
      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article._id} className="border p-4 rounded bg-white shadow flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">{article.title}</h3>
              <p className="text-gray-600 text-sm">{new Date(article.createdAt).toLocaleString()}</p>
            </div>
            <button
              onClick={() => handleDelete(article._id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

