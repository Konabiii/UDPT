const express = require('express');
const router = express.Router();
const statsController = require('../controller/start_controller');

router.get('/:date', statsController.getStats);
router.post('/', statsController.saveStats);

module.exports = router;
