const express = require('express');
const { handleChat, handleMockInit } = require('../controllers/chatController');

const router = express.Router();

router.post('/chat', handleChat);
router.post('/mock', handleMockInit);

module.exports = router;
