const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

// GET /api/entries
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 });
    return res.json(entries);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch entries' });
  }
});

// POST /api/entries
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};

    const entry = new Entry({
      ...body,
      id: Date.now(),
      dateAdded: new Date().toLocaleDateString(),
    });

    const saved = await entry.save();
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to create entry', error: err.message });
  }
});

// DELETE /api/entries/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await Entry.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ message: 'Entry not found' });
    return res.json({ message: 'Deleted', id });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete entry' });
  }
});

// DELETE /api/entries
router.delete('/', async (_req, res) => {
  try {
    await Entry.deleteMany({});
    return res.json({ message: 'All entries cleared' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to clear entries' });
  }
});

module.exports = router;
