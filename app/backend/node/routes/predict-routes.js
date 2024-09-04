const express = require('express');
const router = express.Router();
const predictController = require('../controllers/predict-controller');
const auth = require('../middleware/auth');

router.post('/', auth , predictController.predict);

module.exports = router;
