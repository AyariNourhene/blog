const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = user =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

/* REGISTER */
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'Email déjà utilisé' });

  const user = await User.create({ username, email, password, role });
  res.status(201).json({
    _id: user._id,
    username: user.username,
    role: user.role,
    token: generateToken(user),
  });
});

/* LOGIN */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Identifiants incorrects' });

  res.json({
    _id: user._id,
    username: user.username,
    role: user.role,
    token: generateToken(user),
  });
});

module.exports = router;
