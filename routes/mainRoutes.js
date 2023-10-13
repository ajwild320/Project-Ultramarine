const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
  
router.get('/', mainController.homePage);
router.get('/contact', mainController.contactPage);
router.get('/about', mainController.aboutPage);

module.exports = router;