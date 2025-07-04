const express = require('express');
const router = express.Router();
const { getCryHistory, addCryHistory, getInsights } = require('../controllers/cryHistoryController');
const auth = require('../middleware/auth');

// Get all cry history for a user
router.get('/', auth, getCryHistory);

// Add new cry history entry
router.post('/', auth, addCryHistory);

// Get insights based on cry history
router.get('/insights', auth, getInsights);

// Add anonymous cry history (no authentication)
router.post('/anonymous', addCryHistory);

module.exports = router;
