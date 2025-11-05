const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema(
  {
    id: { type: Number },
    institutionName: { type: String, required: true },
    naacId: { type: String },
    criteria: { type: String, required: true },
    academicYear: { type: String, required: true },
    studentStrength: { type: Number },
    facultyCount: { type: Number },
    programsOffered: { type: Number },
    budgetAllocation: { type: Number },
    description: { type: String, required: true },
    bestPractices: { type: String },
    files: [{ type: String }],
    dateAdded: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Entry', EntrySchema);
