const debug = require('debug')('routes:photos');
const config = require('config');
const axios = require('axios');
const express = require('express');
const _ = require('lodash');
const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const handler = require('../middleware/wrapper');

const router = express.Router();

cloudinary.config({
  cloud_name: config.get('CLOUD_NAME'),
  api_key: config.get('API_KEY'),
  api_secret: config.get('API_SECRET'),
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'Matcha',
  allowedFormats: ['jpg', 'png'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }],
});

const parser = multer({ storage });

router.post('/', parser.single('image'), handler(async (req, res) => {
  debug('req.file', req.file);
  const image = {};
  image.url = req.file.url;
  image.id = req.file.public_id;
  debug(image);
  return res.status(200).json(image);
}));

module.exports = router;
