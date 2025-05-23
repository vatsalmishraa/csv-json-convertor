import express from 'express';
import multer from 'multer';
import path from 'path';
import { config } from '../config';
import { uploadCsv, getSavedRecords, getSavedFiles, getFileData } from '../controllers/converter';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.csvUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.csv') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  }
});

// Routes
router.post('/convert', upload.single('file'), uploadCsv);
router.get('/saved-records', getSavedRecords);
router.get('/saved-files', getSavedFiles);
router.get('/file-data/:fileId', getFileData);

export default router;
