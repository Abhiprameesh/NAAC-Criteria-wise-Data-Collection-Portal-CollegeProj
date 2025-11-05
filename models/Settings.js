const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
  {
    defaultInstitution: { type: String, default: '' },
    defaultNaacId: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', SettingsSchema);
