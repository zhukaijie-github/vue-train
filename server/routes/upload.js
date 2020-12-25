const express = require('express');
const router = express.Router();
const uploadController = require('../controller/upload');

router.use(function log(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.post('/baseic', uploadController.baseic);
router.post('/sectioning', uploadController.sectioning);
router.post('/merge', uploadController.merge);
router.post('/verify', uploadController.verify);
router.post('/other', uploadController.other);

module.exports = {
  uploadRouter: router
};
