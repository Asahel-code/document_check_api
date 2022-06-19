const express = require('express');
const router = express.Router();
const emailController = require('../../controllers/emailController');

router.post('/verify-email',  emailController.verifyEmail);

router.post('/resend-verification-code', emailController.resendToken);

module.exports = router;