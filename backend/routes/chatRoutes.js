const express = require('express');
const { handleChat, handleMockInit, handlePracticeInit, handlePracticeEvaluate } = require('../controllers/chatController');
const multer = require('multer');

const router = express.Router();

// Configure multer to store uploaded files in a memory buffer
const upload = multer({ storage: multer.memoryStorage() });

router.post('/chat', handleChat);
router.post('/mock', upload.single('resumeFile'), handleMockInit);
router.post('/practice', handlePracticeInit);
router.post('/practice/evaluate', handlePracticeEvaluate);

module.exports = router;
