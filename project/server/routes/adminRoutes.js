const express = require('express');
const { users, results, removeUser, stats } = require('../controllers/adminController');
const { auth, adminOnly } = require('../utils/middleware');

const router = express.Router();
router.get('/users', auth, adminOnly, users);
router.get('/results', auth, adminOnly, results);
router.delete('/users/:id', auth, adminOnly, removeUser);
router.get('/stats', auth, adminOnly, stats);

module.exports = router;
