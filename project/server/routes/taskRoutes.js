const express = require('express');
const { generate, checkAnswer, history } = require('../controllers/taskController');
const { auth } = require('../utils/middleware');

const router = express.Router();
router.post('/generate', auth, generate);
router.post('/check', auth, checkAnswer);
router.get('/history', auth, history);

module.exports = router;
