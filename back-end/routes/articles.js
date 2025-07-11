const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const Article = require('../models/Article');

// [GET] all articles
router.get('/', async (req, res) => {
  const articles = await Article.find();
  res.json(articles);
});

// [POST] create article (admin only )
router.post('/', protect, authorize('admin'), async (req, res) => {
  const { title, content } = req.body;
  const article = await Article.create({ title, content });
  res.status(201).json(article);
});

// [GET] one article
router.get('/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.json(article);
});

// [PUT] update article (admin only)
router.put('/:id',protect,authorize('admin') ,async (req, res) => {
  const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// [DELETE] delete article (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ message: 'Article deleted' });
});

// [POST] add comment
router.post('/:id/comments', protect, async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ message: 'Article non trouvé' });

  const comment = {
    user: req.user._id,
    username: req.user.username,
    text: req.body.text,
  };

  article.comments.push(comment);
  await article.save();
  res.status(201).json(article);
});

// [DELETE] comment (admin only)
router.delete('/:articleId/comments/:commentId', protect, authorize('admin'), async (req, res) => {
  const article = await Article.findById(req.params.articleId);
  if (!article) return res.status(404).json({ message: 'Article non trouvé' });


  article.comments = article.comments.filter(
    comment => comment._id.toString() !== req.params.commentId
  );

  await article.save();
  res.json({ message: 'Commentaire supprimé' });
});

// [GET] all comments for an article
router.get('/:id/comments', async (req, res) => {
  const article = await Article.findById(req.params.id).populate('comments.user', 'username');
  if (!article) return res.status(404).json({ message: 'Article non trouvé' });

  res.json(article.comments);
});
module.exports = router;
