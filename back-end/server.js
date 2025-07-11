const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const articleRoutes = require('./routes/articles');
const authRoutes = require('./routes/auth');
const { protect, authorize } = require('./middleware/auth');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json()); // To parse JSON bodies
app.use('/articles', articleRoutes);
app.use('/auth', authRoutes);

// Exemple : protéger les routes articles
const Article = require('./models/Article');

app.post('/articles', protect, authorize('admin'), async (req, res) => {
  const article = await Article.create(req.body);
  res.status(201).json(article);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
