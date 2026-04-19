const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create({ name, email, password });
    res.json({ _id: user._id, name: user.name, email: user.email, credits: user.credits, token: genToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) 
      return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ _id: user._id, name: user.name, email: user.email, credits: user.credits, token: genToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
