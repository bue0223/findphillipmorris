const express = require('express');
global.fetch = require('node-fetch');
const bodyParser = require('body-parser');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Add other headers used in your requests

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
//ROUTES
const pages = require('../controllers/pages.js');
router.get('/:page', pages.pages);
const index = require('../controllers/index.js');
router.get('/', pages.pages);
module.exports = router;
