const express = require('express');
const router = express.Router();
const multer = require('multer');
const Upload = require('../models/Upload');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, type } = req.body;
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const newUpload = new Upload({
      title,
      type,
      filename: req.file.filename,
    });

    const saved = await newUpload.save();
    res.json({ msg: 'Upload successful', upload: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Upload failed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ msg: 'File not found' });

    const filePath = path.join(__dirname, '..', 'uploads', upload.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Upload.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during deletion' });
  }
});

// backend/routes/upload.js
router.get('/', async (req, res) => {
  const { type } = req.query;
  const query = type ? { type } : {};
  const uploads = await Upload.find(query).sort({ createdAt: -1 });
  res.json(uploads);
});


module.exports = router;