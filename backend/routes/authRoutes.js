const express = require('express');
const { register, verifyRegisterOtp, login, googleLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/register/verify-otp', verifyRegisterOtp);
router.post('/login', login);
router.post('/google-login', googleLogin);

module.exports = router;
