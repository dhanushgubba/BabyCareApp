const express = require('express');
const router = express.Router();
const { detectCry } = require('../controllers/cryHistoryController');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/detect', auth, upload.single('audio'), detectCry);

module.exports = router;
