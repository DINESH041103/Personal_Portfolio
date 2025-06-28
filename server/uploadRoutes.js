const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const verifyToken = require('./authMiddleware');
const Upload = require('./models/Upload'); // Add this

// Setup storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Route: POST /api/upload
router.post('/', verifyToken, upload.single('file'), async (req, res) => {
  const { title, type } = req.body;

  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  try {
    const newUpload = new Upload({
      title,
      type,
      filename: req.file.filename,
      path: req.file.path
    });

    await newUpload.save();

    res.json({
      msg: 'File uploaded and saved',
      upload: newUpload
    });
  } catch (err) {
    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
});

// GET /api/upload (list all uploads)
router.get('/', verifyToken, async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ createdAt: -1 });
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch uploads' });
  }
});


module.exports = router;
