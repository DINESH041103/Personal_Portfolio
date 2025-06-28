const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verifyToken = require('./authMiddleware');
require('dotenv').config();

const router = express.Router();

const dummyUser = {
  id: 1,
  email: 'test@example.com',
  password: bcrypt.hashSync('password123', 8),
};

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== dummyUser.email) {
    return res.status(400).json({ msg: 'Invalid email' });
  }

  const isMatch = bcrypt.compareSync(password, dummyUser.password);
  if (!isMatch) {
    return res.status(400).json({ msg: 'Invalid password' });
  }

  // Example check inside your backend route
  if (user.role !== 'admin') {
    return res.status(403).json({ error: "Not allowed" });
  }


  const token = jwt.sign({ id: dummyUser.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
});

// ✅ Protected route
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    msg: 'Welcome to your profile',
    userId: req.user.id,
  });
});

module.exports = router;
