const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const mongoose = require('mongoose');
const database = require('../config/database.js');

let gfs;

database.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(database.db, { bucketName: 'images' });
  console.log("GFS initialized");
});

const storage = new GridFsStorage({
  db: database,
  options: { useUnifiedTopology: true, useNewUrlParser: true },
  file: (req, file) => {
    console.log(file);
    const match = ['image/png', 'image/jpeg', 'image/jpg'];

    if (match.indexOf(file.mimetype) === -1) {
      
      res.status(400).json({ message: 'Invalid file type. Only accept png/jpeg/jpg.' });
    }

    return {
      bucketName: 'images',
      filename: `${Date.now()}-product-${file.originalname}`
      
    };
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const match = ['image/png', 'image/jpeg', 'image/jpg'];

    if (match.indexOf(file.mimetype) === -1) {
      // Reject the file
      cb(new Error(`${file.originalname} is invalid. Only accept png/jpeg/jpg.`), false);
    } else {
      // Accept the file
      cb(null, true);
    }
  }
});

module.exports = { upload, getGfs: () => gfs };