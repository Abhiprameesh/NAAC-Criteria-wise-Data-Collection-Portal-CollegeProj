const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// GET /api/settings
router.get('/', async (_req, res) => {
  try {
    const existing = await Settings.findOne();
    return res.json(existing || { defaultInstitution: '', defaultNaacId: '' });
  } catch (_err) {
    return res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// PUT /api/settings
router.put('/', async (req, res) => {
  try {
    const payload = req.body || {};
    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: payload },
      { new: true, upsert: true }
    );
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to update settings', error: err.message });
  }
});

module.exports = router;
