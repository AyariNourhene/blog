const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String, // pour l'affichage direct
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  author: String,
  tags: [String],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', articleSchema);
