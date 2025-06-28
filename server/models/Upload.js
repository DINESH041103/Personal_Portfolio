const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  title: String,
  type: String,
  filename: String,
  path: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Upload', UploadSchema);
