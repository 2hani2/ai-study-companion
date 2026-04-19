const router = require('express').Router();
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { generateCourseContent } = require('../services/gemini');

router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user._id }).sort('-createdAt');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const user = await User.findById(req.user._id);
    if (user.credits < 1) return res.status(400).json({ message: 'No credits left' });
    const content = await generateCourseContent(title, description);
    const course = await Course.create({ user: req.user._id, title, description, ...content });
    user.credits -= 1;
    await user.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, user: req.user._id });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Course.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
